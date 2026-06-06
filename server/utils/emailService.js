const nodemailer = require('nodemailer');

// Cấu hình Email Transporter (Sử dụng Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Địa chỉ Gmail của cậu
    pass: process.env.EMAIL_PASS  // Mật khẩu ứng dụng (App Password)
  }
});

/**
 * Gửi email thông báo cho Admin khi có đơn hàng mới
 */
const sendAdminNotification = async (order) => {
  const mailOptions = {
    from: `"Yi Guitar System" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: `🔔 BÁO ĐỘNG: Đơn hàng mới từ ${order.customerInfo.name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
        <h2 style="color: #00c7d3; text-transform: uppercase;">Có Đơn Hàng Mới Cần Xử Lý!</h2>
        <p>Chào Admin, hệ thống vừa ghi nhận một yêu cầu đặt trước mới.</p>
        
        <div style="background: #f8fafc; padding: 15px; border-radius: 10px;">
          <h3 style="margin-top: 0;">Thông tin khách hàng:</h3>
          <p><strong>Họ tên:</strong> ${order.customerInfo.name}</p>
          <p><strong>Số điện thoại:</strong> ${order.customerInfo.phone}</p>
          <p><strong>Địa chỉ:</strong> ${order.customerInfo.address || 'Không cung cấp'}</p>
          <p><strong>Ghi chú từ khách:</strong> ${order.customerInfo.note || 'Không có'}</p>
        </div>

        <h3>Chi tiết đơn hàng:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #eee;">
              <th style="padding: 10px; text-align: left;">Sản phẩm</th>
              <th style="padding: 10px; text-align: center;">SL</th>
              <th style="padding: 10px; text-align: right;">Giá</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.price.toLocaleString()}đ</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <p style="text-align: right; font-size: 18px; font-weight: bold; color: #00c7d3;">
          Tổng cộng: ${order.totalAmount.toLocaleString()}đ
        </p>
        
        <div style="margin-top: 30px; text-align: center;">
          <a href="${process.env.CLIENT_URL}/admin/orders" style="background: #00c7d3; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Vào Trang Quản Trị Xem Ngay
          </a>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Admin notification email sent');
  } catch (error) {
    console.error('Error sending admin email:', error);
  }
};

/**
 * Gửi email xác nhận cho Khách hàng
 */
const sendCustomerConfirmation = async (order) => {
  // Vì hiện tại chúng ta chưa bắt buộc dùng email cho khách khi đặt hàng (chỉ có SĐT/Địa chỉ)
  // Nếu có email khách thì mới gửi
  const customerEmail = order.customerInfo.email; 
  if (!customerEmail) return;

  const mailOptions = {
    from: `"Yi Guitar Shop" <${process.env.EMAIL_USER}>`,
    to: customerEmail,
    subject: `Cảm ơn ${order.customerInfo.name} đã tin tưởng Yi Guitar!`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
        <h2 style="color: #00c7d3;">Chào ${order.customerInfo.name},</h2>
        <p>Cảm ơn cậu đã để lại thông tin đặt hàng tại <strong>Yi Guitar</strong>. Tụi mình đã nhận được yêu cầu của cậu và sẽ sớm liên hệ để tư vấn chi tiết hơn.</p>
        
        <div style="background: #f2fcfc; padding: 15px; border-radius: 10px; border-left: 5px solid #00c7d3;">
          <p style="margin: 0; font-weight: bold; color: #00c7d3;">Trạng thái đơn hàng: Chờ tư vấn</p>
          <p style="margin: 5px 0 0 0; font-size: 13px;">Tụi mình sẽ liên hệ với cậu qua số điện thoại: <strong>${order.customerInfo.phone}</strong></p>
        </div>

        <h3>Tóm tắt yêu cầu của cậu:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          ${order.items.map(item => `
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name} x ${item.quantity}</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.price.toLocaleString()}đ</td>
            </tr>
          `).join('')}
          <tr>
            <td style="padding: 10px; font-weight: bold;">Tổng tiền dự kiến</td>
            <td style="padding: 10px; text-align: right; font-weight: bold; color: #00c7d3;">${order.totalAmount.toLocaleString()}đ</td>
          </tr>
        </table>

        <p style="font-size: 14px; color: #666; margin-top: 30px;">
          Nếu có bất kỳ thắc mắc nào, cậu có thể nhắn tin trực tiếp cho shop qua Fanpage hoặc gọi hotline nhé.
        </p>

        <p style="font-weight: bold; color: #00c7d3;">Hẹn sớm gặp lại cậu!</p>
        <p>Đội ngũ Yi Guitar</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Customer confirmation email sent');
  } catch (error) {
    console.error('Error sending customer email:', error);
  }
};

const sendPasswordResetEmail = async ({ email, resetUrl }) => {
  const mailOptions = {
    from: `"Yi Guitar Shop" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Khoi phuc mat khau Yi Guitar',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
        <h2 style="color: #00c7d3;">Dat lai mat khau</h2>
        <p>Bon minh da nhan duoc yeu cau khoi phuc mat khau cho tai khoan cua ban.</p>
        <p>Link nay se het han sau 15 phut.</p>
        <div style="margin-top: 24px;">
          <a href="${resetUrl}" style="background: #00c7d3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Dat lai mat khau
          </a>
        </div>
        <p style="margin-top: 24px; font-size: 14px; color: #666;">Neu ban khong yeu cau thao tac nay, hay bo qua email nay.</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

const sendOtpEmail = async ({ email, otp }) => {
  const mailOptions = {
    from: `"Yi Guitar Shop" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Mã Xác Thực Đăng Ký Tài Khoản - Yi Guitar',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
        <h2 style="color: #00c7d3; text-align: center;">Xác Thực Tài Khoản Mới</h2>
        <p>Chào cậu,</p>
        <p>Cảm ơn cậu đã đăng ký gia nhập cộng đồng Yi Guitar. Để hoàn tất việc tạo tài khoản, vui lòng nhập mã xác thực gồm 6 chữ số dưới đây:</p>
        
        <div style="background: #f8fafc; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #00c7d3;">${otp}</span>
        </div>

        <p style="font-size: 14px; color: #666; text-align: center;">Mã này sẽ hết hạn sau <strong>5 phút</strong>.</p>
        <p style="font-size: 13px; color: #999; text-align: center; margin-top: 30px;">Nếu cậu không yêu cầu tạo tài khoản, xin vui lòng bỏ qua email này.</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendAdminNotification,
  sendCustomerConfirmation,
  sendPasswordResetEmail,
  sendOtpEmail
};
