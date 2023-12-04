const mongoose = require('mongoose');

const dotenv = require('dotenv');

dotenv.config();

const UserName = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

// console.log(UserName,password);
const Connection = async () => {
  const URL = `mongodb+srv://${UserName}:${password}@chatappcluster.o0iqcoq.mongodb.net/?retryWrites=true&w=majority`;
  try {
    await mongoose.connect(URL, { useUnifiedTopology: true });
    console.log('DataBase Connect Succesfully');
  } catch (error) {
    console.log('error while Connecting Database', error.message);
  }
};

module.exports = Connection;
