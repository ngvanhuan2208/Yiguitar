const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Lấy phản hồi từ Gemini AI dựa trên tin nhắn khách hàng
 * @param {string} userMessage - Nội dung tin nhắn khách hàng
 * @returns {Promise<string>} - Câu trả lời của AI
 */
const getAIResponse = async (userMessage) => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: `Bạn là trợ lý ảo chính thức của cửa hàng "Yi Guitar" (Địa chỉ: 49 Bế Văn Đàn, Thanh Khê, Đà Nẵng). 
      Nhiệm vụ của bạn là tư vấn khách hàng về các loại đàn Guitar (Acoustic, Classic, Electric), phụ kiện và các khóa học đàn.
      
      Phong cách trả lời:
      - Luôn bắt đầu bằng lời chào thân thiện (ví dụ: Chào bạn, Yi Guitar có thể giúp gì cho bạn?).
      - Trả lời ngắn gọn, súc tích, dễ hiểu.
      - Sử dụng tiếng Việt tự nhiên, trẻ trung nhưng vẫn chuyên nghiệp.
      - Nếu khách hỏi về địa chỉ, hãy nhắc đến "49 Bế Văn Đàn, Đà Nẵng".
      - Nếu khách hỏi về mua đàn, hãy tư vấn nhiệt tình các dòng đàn shop có.
      - Luôn kết thúc bằng một câu mời gọi hoặc hỏi xem khách có cần hỗ trợ gì thêm không.
      
      Lưu ý: Nếu câu hỏi không liên quan đến Guitar hoặc cửa hàng, hãy khéo léo từ chối và hướng khách quay lại chủ đề Guitar.`
    });

    const result = await model.generateContent(userMessage);
    const response = await result.response;
    const text = response.text();
    
    return text.trim();
  } catch (error) {
    console.error("AI Service Error:", error);
    return "Xin lỗi bạn, mình đang gặp một chút trục trặc kỹ thuật. Bạn vui lòng chờ Admin một chút hoặc nhắn lại sau nhé! 🙏";
  }
};

module.exports = { getAIResponse };
