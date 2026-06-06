const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Tạo phản hồi từ Gemini AI cho Chatbot Yi Guitar
 * @param {string} userMessage - Nội dung tin nhắn của người dùng
 * @returns {Promise<string>} - Nội dung phản hồi của AI
 */
const generateChatResponse = async (userMessage) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemPrompt = `Bạn là chuyên viên tư vấn của cửa hàng Yi Guitar (49 Bế Văn Đàn, Đà Nẵng). 
    Hãy trả lời ngắn gọn, thân thiện bằng tiếng Việt. 
    Tuyệt đối không tự bịa giá tiền, khuyến mãi hay tồn kho. 
    Nếu không chắc chắn, hãy bảo khách để lại SĐT để Admin hỗ trợ.
    
    Câu hỏi của khách: `;

    const result = await model.generateContent(systemPrompt + userMessage);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error("AI Integration Error:", error);
    return "Yi Guitar đã nhận được tin nhắn của bạn. Chuyên viên sẽ phản hồi sớm nhất có thể nhé!";
  }
};

module.exports = { generateChatResponse };
