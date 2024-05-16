const express = require('express');
const router = express.Router();
const Spare = require('../models/Spare');

// To Get List Of Spares
router.get('/', async (req, res) => {
  try {
    const Spares = await Spare.find();
    res.json(Spares);
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการโหลดข้อมูลอะไหล่:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการโหลดข้อมูลอะไหล่' });
  }
});

// สร้างใหม่
router.post('/', async (req, res) => {
  try {
    const {
      spareName,
      spareType,
      sparePrice,
    } = req.body;

    const existingSpare = await Spare.findOne({ spareName });

    if (existingSpare) {
      return res.status(400).json({ message: 'ชื่ออะไหล่นี้มีในระบบแล้ว' });
    }
    const newSpare = await Spare.create({
      spareName,
      spareType,
      sparePrice,
    });
    res.status(201).json(newSpare);
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเพิ่มอะไหล่' });
  }
});

// แก้ไขข้อมูล
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      spareName,
      spareType,
      sparePrice,
    } = req.body;

    const existingSpare = await Spare.findOne({ $and: [{ _id: { $ne: id } }, { spareName }] });

    if (existingSpare) {
      return res.status(400).json({ message: 'ชื่ออะไหล่นี้มีในระบบแล้ว' });
    }

    const updatedSpare = await Spare.findByIdAndUpdate(
      id,
      {
        spareName,
        spareType,
        sparePrice,
      },
      { new: true, useFindAndModify: false }
    );
    res.status(200).json(updatedSpare);
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการแก้ไขข้อมูลอะไหล่' });
  }
});

// ลบข้อมูล
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Spare.findByIdAndRemove(id);
    res.status(200).json({ message: 'ลบข้อมูลอะไหล่เรียบร้อยแล้ว' });
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบข้อมูลอะไหล่' });
  }
});

module.exports = router;