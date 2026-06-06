/**
 * Chuẩn hóa chuỗi ký tự Tiếng Việt về dạng Unicode Dựng sẵn (NFC).
 * Giúp khắc phục triệt để lỗi nhảy dấu/lỗi font khi copy-paste từ các nguồn khác nhau.
 * @param {string} text - Chuỗi cần chuẩn hóa
 * @returns {string} - Chuỗi đã được chuẩn hóa
 */
export const normalizeVN = (text) => {
  if (typeof text !== 'string') return text;
  return text.normalize('NFC');
};

/**
 * Chuẩn hóa toàn bộ các trường text trong một object.
 * @param {object} obj - Object chứa các trường dữ liệu
 * @param {string[]} fields - Danh sách các trường cần chuẩn hóa
 * @returns {object} - Object mới đã được chuẩn hóa các trường chỉ định
 */
export const normalizeObject = (obj, fields) => {
  const newObj = { ...obj };
  fields.forEach(field => {
    if (newObj[field]) {
      newObj[field] = normalizeVN(newObj[field]);
    }
  });
  return newObj;
};
