const mongoose = require('mongoose');
require('dotenv').config();
mongoose.set('strictQuery', false);

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_ATLAS);
    console.log('DB connected.');
  } catch (err) {
    console.log('Mongoose: ', err);
  }
};
start();
