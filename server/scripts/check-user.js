const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/guitar-shop';

mongoose.connect(MONGO_URI)
  .then(async () => {
    const user = await User.findOne({ name: /Nguyễn Văn Huân/i });
    if (user) {
      console.log('--- USER DATA ---');
      console.log('Name:', user.name);
      console.log('Email:', user.email);
      console.log('Role:', user.role);
      console.log('ID:', user._id);
    } else {
      console.log('User not found');
    }
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
