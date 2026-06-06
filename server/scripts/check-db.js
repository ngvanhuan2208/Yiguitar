const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const checkDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/guitar-shop');
    const count = await Product.countDocuments();
    const latest = await Product.find().sort({ createdAt: -1 }).limit(5);
    
    console.log(`Total Products: ${count}`);
    console.log('Latest 5 products:');
    latest.forEach(p => console.log(`- ID: ${p._id}, Name: ${p.name}, Hidden: ${p.isHidden || 'No'}`));
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkDB();
