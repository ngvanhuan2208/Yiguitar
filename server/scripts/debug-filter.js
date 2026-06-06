
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Product = mongoose.model('Product', new mongoose.Schema({
  name: String,
  category: String,
  type: String,
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' }
}));

const Brand = mongoose.model('Brand', new mongoose.Schema({
  name: String
}));

async function check() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/guitar-shop');
  
  const allGuitars = await Product.find({ category: 'Guitar' }).populate('brand');
  console.log('--- SCANNING ALL GUITARS ---');
  console.log('Total Guitars:', allGuitars.length);
  allGuitars.forEach(p => {
    console.log(`- [${p.name}] | Type: [${p.type}] | Brand: [${p.brand?.name || 'N/A'}] | BrandID: [${p.brand?._id || 'N/A'}]`);
  });

  const yamaha = await Brand.findOne({ name: 'Yamaha' });
  console.log('\n--- TARGET SEARCH: YAMAHA ACOUSTIC ---');
  console.log('Yamaha Brand Object ID:', yamaha?._id);

  const target = await Product.find({ 
    category: 'Guitar',
    type: 'Acoustic',
    brand: yamaha?._id
  });
  console.log('Target Brand+Type Search Results:', target.length);

  await mongoose.disconnect();
}
check();
