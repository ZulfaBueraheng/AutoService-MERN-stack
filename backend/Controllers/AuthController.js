const bcrypt = require('bcryptjs');
const userModel = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.SECRET_KEY;

const login = (req, res) => {
  const { username, password } = req.body;
  userModel.findOne({ username: username })
    .then(user => {
      if (user) {
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) {
            res.status(500).json({ message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ" });
          }
          else if (isMatch) {
            const token = jwt.sign({ username: user.username }, secretKey);
            res.status(200).json({ message: "เข้าสู่ระบบสำเร็จ", token });
          }
          else {
            res.status(401).json({ message: "รหัสผ่านไม่ถูกต้อง" });
          }
        });
      }
      else {
        res.status(404).json({ message: "ไม่พบบัญชีผู้ใช้งาน" });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ" });
    });
};

const register = (req, res) => {
  const { username, password } = req.body;
  if (password.length < 8) {
    res.status(400).json({ error: "รหัสผ่านต้องมีอย่างน้อย 8 ตัว" });
  } else {
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการลงทะเบียน" });
      } else {
        userModel.create({ username, password: hashedPassword })
          .then(user => {
            res.status(201).json({ message: "ลงทะเบียนผู้ใช้งานสำเร็จ" });
          })
          .catch(err => {
            if (err.errors && err.errors.username && err.errors.username.message) {
              res.status(400).json({ error: "ชื่อผู้ใช้งานนี้ถูกใช้งานแล้ว" });
            } else {
              res.status(500).json({ error: "เกิดข้อผิดพลาดในการลงทะเบียน" });
            }
          });
      }
    });
  }
};

const verifyToken = (req, res) => {
  const { token } = req.body;
  try {
    const decodedToken = jwt.verify(token, secretKey);
    if (decodedToken && decodedToken.username) {
      res.status(200).json({ isValid: true, username: decodedToken.username });
    } else {
      res.status(401).json({ isValid: false });
    }
  } catch (err) {
    res.status(401).json({ isValid: false });
  }
};

module.exports = { login, register, verifyToken };