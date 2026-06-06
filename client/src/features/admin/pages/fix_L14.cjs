const fs = require('fs');
const path = 'c:/Users/Admin/guitar-shop-ecommerce/client/src/features/admin/pages/ManageOrders.jsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/case 'Ch? tu v?n':(.*)\n.*case 'Ðã liên h?':(.*)\n.*case 'Ðã h?y':(.*)/g, "case 'Ch? tu v?n': return 'bg-amber-100 text-amber-600 border-amber-200';\n      case 'Ðã thanh toán': return 'bg-sky-100 text-sky-600 border-sky-200';\n      case 'Ðang giao': return 'bg-indigo-100 text-indigo-600 border-indigo-200';\n      case 'Hoàn thành': return 'bg-emerald-100 text-emerald-600 border-emerald-200';\n      case 'Ðã h?y': return 'bg-rose-100 text-rose-600 border-rose-200';");

content = content.replace(/<option>Ch? tu v?n<\/option>\s*<option>Ðã liên h?<\/option>\s*<option>Ðã h?y<\/option>/g, "<option>Ch? tu v?n</option>\n              <option>Ðã thanh toán</option>\n              <option>Ðang giao</option>\n              <option>Hoàn thành</option>\n              <option>Ðã h?y</option>");

fs.writeFileSync(path, content);
