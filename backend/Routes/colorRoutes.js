const express = require('express');
const router = express.Router();
const Color = require('../models/color');

// To Get List Of Spares
router.get('/', async (req, res) => {
  try {
    const Colors = await Color.find();
    res.json(Colors);
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการโหลดข้อมูลสีรถ:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการโหลดข้อมูลสีรถ' });
  }
});

// สร้างใหม่
router.post('/', async (req, res) => {
  try {
    const { colorname } = req.body;

    const existingColor = await Color.findOne({ colorname });

    if (existingColor) {
      return res.status(400).json({ message: 'สีนี้มีในระบบแล้ว' });
    }
    const newColor = await Color.create({
      colorname
    });
    res.status(201).json(newColor);
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเพิ่มสี' });
  }
});

module.exports = router;