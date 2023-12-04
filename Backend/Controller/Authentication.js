const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');
const User = require('../models/User.js');

const dotenv = require('dotenv');

dotenv.config();

const generateToken = (userId) => {
  return jwt.sign({ _id: userId }, process.env.JWT_SECRETKEY);
};

const addUser = async (req, res) => {
  try {
    const { name, email, password, pic } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please fill all field');
    }

    const Exist = await User.findOne({ email: email });

    if (Exist) {
      res.status(200).json('user is Already Exist');
    }

    const salt = await bcrypt.genSalt(10);

    const hash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name,
      email: email,
      password: hash,
      pic: pic,
    });

    if (user) {
      res.status(201).json({
        id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json('Unable To create User Please try Again');
    }
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ msg: 'Error while creating User', error: error.message });
  }
};

const LoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    if (user) {
      const result = await bcrypt.compare(password, user.password);

      if (result === true) {
        res.status(200).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          pic: user.pic,
          token: generateToken(user._id),
        });
      } else {
        res.status(400).json({ success: false, message: 'Incorrect Password' });
      }
    } else {
      res.status(400).json({ success: false, message: 'Please Check Email' });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = { addUser, LoginUser };
