const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Import Models
const User = require('./models/User');
const Brand = require('./models/Brand');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Course = require('./models/Course');
const Tab = require('./models/Tab');
const Cart = require('./models/Cart');
const Review = require('./models/Review');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/guitar-shop';

async function seedDB() {
  try {
    console.log('\x1b[36m%s\x1b[0m', '🚀 Đang kết nối đến MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('\x1b[32m%s\x1b[0m', '✅ Kết nối thành công!');

    // 1. Dọn dẹp dữ liệu cũ (Xóa Brands/Categories/Users để làm mới, nhưng tớ sẽ CẨN THẬN)
    // Tớ chỉ xóa Admin cũ nếu trùng email, và reset các danh mục/hãng mẫu
    console.log('\x1b[33m%s\x1b[0m', '🧹 Đang dọn dẹp dữ liệu mẫu...');
    
    // Tớ xóa sạch Brands và Category vì ta đã có collection Brand mới
    await Brand.deleteMany({});
    await Category.deleteMany({});
    
    // Xóa User admin cũ (nếu có) để tạo mới chuẩn
    await User.deleteOne({ email: 'admin@yiguitar.com' });

    // 2. Tạo tài khoản Admin mặc định
    console.log('\x1b[36m%s\x1b[0m', '👤 Đang tạo tài khoản Admin...');
    const hashedAdminPassword = await bcrypt.hash('123456', 10);

    const adminUser = await User.create({
      name: 'YI Guitar Admin',
      email: 'admin@yiguitar.com',
      password: hashedAdminPassword,
      role: 'admin',
      avatar: '/uploads/default-avatar.png'
    });
    console.log(`✅ Admin account created: ${adminUser.email}`);

    // 3. Tạo các Thương hiệu mẫu (Brands)
    console.log('\x1b[36m%s\x1b[0m', '🎸 Đang tạo danh sách Hãng sản xuất...');
    const brandsData = [
      { name: 'Yamaha', description: 'Đàn Nhật bản chất lượng cao', mainCategory: 'Guitar' },
      { name: 'Ba Đờn', description: 'Thương hiệu Việt Nam truyền thống', mainCategory: 'Guitar' },
      { name: 'Enya', description: 'Công nghệ sợi carbon đột phá', mainCategory: 'Guitar' },
      { name: 'Taylor', description: 'Guitar cao cấp từ Mỹ', mainCategory: 'Guitar' },
      { name: 'Fender', description: 'Huyền thoại guitar điện', mainCategory: 'Guitar' },
      { name: 'Cordoba', description: 'Đỉnh cao guitar classic', mainCategory: 'Guitar' }
    ];
    const createdBrands = await Brand.insertMany(brandsData);

    // 4. Tạo các Danh mục mẫu (Categories)
    console.log('\x1b[36m%s\x1b[0m', '📂 Đang tạo danh mục sản phẩm...');
    const categoriesData = [
      { 
        name: 'Guitar', 
        subCategories: ['Acoustic', 'Classic', 'Electric', 'Bass', 'Ukulele', 'Vip'],
        brands: createdBrands.map(b => b.name)
      },
      { 
        name: 'Accessory', 
        subCategories: ['Dây đàn', 'Capo', 'Bao đàn', 'Pick', 'Máy lên dây', 'Eq - Pickup'],
        brands: ['Yamaha', 'Elixir', 'Alice', 'D’Addario']
      },
      {
        name: 'Course',
        subCategories: ['Guitar Cơ Bản', 'Guitar Nâng Cao', 'Fingerstyle', 'Đệm Hát'],
        brands: ['Yi Guitar Academy']
      },
      {
        name: 'Tab',
        subCategories: ['Việt Nam', 'Quốc Tế', 'Fingerstyle', 'Cổ Điển'],
        brands: ['Yi Guitar Tab']
      }
    ];
    await Category.insertMany(categoriesData);

    // 5. Cập nhật lại các Product hiện có để khớp ID Brand mới
    console.log('\x1b[36m%s\x1b[0m', '🔗 Đang đồng bộ hóa liên kết Brand cho Product...');
    const products = await Product.collection.find().toArray();
    for (const prod of products) {
        // Tìm brand tương ứng theo tên (vì trong seed ta vừa tạo lại Brands mới với ID mới)
        let brandName = '';
        if (typeof prod.brand === 'string') {
            brandName = prod.brand;
        } else if (prod.brand && typeof prod.brand === 'object') {
            // Trường hợp đã là object nhưng có thể ID cũ không còn tồn tại do vừa deleteMany
            // Ta cần lấy lại name để mapping
            const oldBrand = await Brand.findById(prod.brand);
            if (oldBrand) brandName = oldBrand.name;
        }
        
        if (brandName) {
            const newBrand = await Brand.findOne({ name: brandName });
            if (newBrand) {
                await Product.updateOne({ _id: prod._id }, { $set: { brand: newBrand._id } });
            }
        }
    }

    console.log('\x1b[42m%s\x1b[0m', '✨ TẤT CẢ DỮ LIỆU ĐÃ ĐƯỢC KHỞI TẠO VÀ ĐỒNG BỘ THÀNH CÔNG! ✨');
    process.exit(0);
  } catch (err) {
    console.error('\x1b[41m%s\x1b[0m', '❌ LỖI SEEDING:', err);
    process.exit(1);
  }
}

seedDB();
