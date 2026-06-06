const Order = require('../models/Order');
const Product = require('../models/Product');
const emailService = require('../utils/emailService');

exports.createOrder = async (req, res) => {
  try {
    const { items, customerInfo } = req.body;
    let serverTotalAmount = 0;
    const io = req.app.get('io');

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(400).json({ message: `Sản phẩm không tồn tại (ID: ${item.productId})` });
      
      serverTotalAmount += product.price * (item.quantity || 1);
      
      if (!['Course', 'Tab'].includes(product.category)) {
        const updated = await Product.findOneAndUpdate(
          { _id: item.productId, stock: { $gte: item.quantity } }, 
          { $inc: { stock: -item.quantity } }
        );
        if (!updated) return res.status(400).json({ message: `Sản phẩm "${product.name}" không đủ số lượng trong kho.` });
      }
    }

    const saved = await new Order({ 
      userId: req.user._id, 
      items, 
      customerInfo, 
      totalAmount: serverTotalAmount, 
      status: 'Chờ tư vấn' 
    }).save();

    emailService.sendAdminNotification(saved);
    emailService.sendCustomerConfirmation(saved);
    
    if (io) io.emit('dashboard-update', { type: 'NEW_ORDER', order: saved });
    
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    res.json(await Order.find().sort({ createdAt: -1 }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    res.json(await Order.find({ userId: req.user._id }).sort({ createdAt: -1 }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const oldOrder = await Order.findById(req.params.id);
    const io = req.app.get('io');

    if (status === 'Đã hủy' && oldOrder.status !== 'Đã hủy') {
      for (const item of oldOrder.items) {
        const product = await Product.findById(item.productId);
        if (product && !['Course', 'Tab'].includes(product.category)) {
          await Product.findByIdAndUpdate(item.productId, { $inc: { stock: item.quantity } });
        }
      }
    }

    const order = await Order.findByIdAndUpdate(req.params.id, { status, adminNote }, { new: true });
    if (io) io.emit('dashboard-update', { type: 'ORDER_UPDATED', order });
    
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRevenueStats = async (req, res) => {
  try {
    const { filter, startDate, endDate } = req.query;
    let start, end = new Date();
    if (startDate && endDate) {
      start = new Date(startDate); end = new Date(endDate);
    } else {
      switch (filter) {
        case 'Hôm nay': start = new Date(); start.setHours(0,0,0,0); break;
        case 'Tuần này': start = new Date(); start.setDate(start.getDate() - 7); break;
        case 'Năm nay': start = new Date(new Date().getFullYear(), 0, 1); break;
        case 'Tháng này':
        default: start = new Date(new Date().getFullYear(), new Date().getMonth(), 1); break;
      }
    }

    const dateFilter = { createdAt: { $gte: start, $lte: end } };
    const currentStats = await Order.aggregate([
      { $match: { status: { $ne: 'Đã hủy' }, ...dateFilter } }, 
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" }, orderCount: { $sum: 1 }, avgOrderValue: { $avg: "$totalAmount" } } }
    ]);
    
    const canceledCount = await Order.countDocuments({ status: 'Đã hủy', ...dateFilter });
    const chartData = await Order.aggregate([
      { $match: { status: { $ne: 'Đã hủy' }, ...dateFilter } }, 
      { $group: { _id: { $dateToString: { format: "%d/%m", date: "$createdAt" } }, revenue: { $sum: "$totalAmount" }, orders: { $sum: 1 }, timestamp: { $first: "$createdAt" } } }, 
      { $sort: { timestamp: 1 } }, 
      { $project: { name: "$_id", revenue: 1, orders: 1, _id: 0 } }
    ]);
    
    const topProducts = await Order.aggregate([
      { $match: { status: { $ne: 'Đã hủy' }, ...dateFilter } }, 
      { $unwind: "$items" }, 
      { $group: { _id: "$items.productId", name: { $first: "$items.name" }, totalQty: { $sum: "$items.quantity" }, totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } } } }, 
      { $sort: { totalRevenue: -1 } }, 
      { $limit: 5 }
    ]);

    // 4. Thống kê theo danh mục (Pie Chart)
    const categoryStats = await Order.aggregate([
      { $match: { status: { $ne: 'Đã hủy' }, ...dateFilter } },
      { $unwind: "$items" },
      { $lookup: {
          from: 'products',
          localField: 'items.productId',
          foreignField: '_id',
          as: 'productInfo'
      }},
      { $unwind: "$productInfo" },
      { $group: {
          _id: "$productInfo.category",
          value: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
      }},
      { $project: { name: "$_id", value: 1, _id: 0 } }
    ]);

    // 5. Lấy danh sách đơn hàng gần đây
    const recentOrders = await Order.find({ ...dateFilter })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ 
      kpis: { 
        totalRevenue: currentStats[0]?.totalRevenue || 0, 
        totalOrders: currentStats[0]?.orderCount || 0, 
        avgOrderValue: currentStats[0]?.avgOrderValue || 0, 
        canceledOrders: canceledCount,
        growth: 5.2 // Giá trị giả lập hoặc tính toán thực tế nếu có dữ liệu tháng trước
      }, 
      chartData, 
      categoryStats,
      topProducts,
      recentOrders
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.warrantyLookup = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: 'Vui lòng nhập mã đơn hàng hoặc số điện thoại' });

    const mongoose = require('mongoose');
    const isObjectId = mongoose.isValidObjectId(query);
    const filter = isObjectId ? { $or: [{ _id: query }, { 'customerInfo.phone': query }] } : { 'customerInfo.phone': query };

    const orders = await Order.find(filter).populate('items.productId').sort({ createdAt: -1 });
    if (!orders || orders.length === 0) return res.status(404).json({ message: 'Không tìm thấy thông tin' });

    const currentDate = new Date();
    const customerName = orders[0].customerInfo.name;
    const lookupType = isObjectId ? 'Mã ĐH' : 'SĐT';
    const lookupValue = query;

    const products = [];
    orders.forEach(order => {
      const purchaseDate = new Date(order.createdAt);
      order.items.forEach(item => {
        const warrantyText = item.productId?.warranty || 'Không bảo hành';
        let months = 0;
        const monthMatch = warrantyText.match(/(\d+)\s*tháng/i);
        if (monthMatch) {
          months = parseInt(monthMatch[1]);
        } else {
          const yearMatch = warrantyText.match(/(\d+)\s*năm/i);
          if (yearMatch) months = parseInt(yearMatch[1]) * 12;
        }

        const expiryDate = new Date(purchaseDate);
        expiryDate.setMonth(expiryDate.getMonth() + months);
        
        const isExpired = months === 0 || expiryDate < currentDate;

        products.push({
          name: item.name,
          warrantyText,
          purchaseDate,
          expiryDate,
          isExpired,
          orderId: order._id
        });
      });
    });

    res.json({
      lookupType,
      lookupValue,
      customerName,
      products
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
