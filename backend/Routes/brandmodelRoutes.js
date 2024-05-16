const express = require('express');
const router = express.Router();
const BrandModel = require('../models/BrandModel');

// To Get List Of Spares
router.get('/', async (req, res) => {
  try {
    const BrandModels = await BrandModel.find();
    res.json(BrandModels);
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการโหลดข้อมูลรุ่นรถ:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการโหลดข้อมูลรุ่นรถ' });
  }
});

// สร้างใหม่
router.post('/', async (req, res) => {
  try {
    const { model, brand } = req.body;

    const existingBrandModel = await BrandModel.findOne({ model });

    if (existingBrandModel) {
      return res.status(400).json({ message: 'รถรุ่นนี้มีในระบบแล้ว' });
    }
    const newBrandModel = await BrandModel.create({
      model,
      brand,
    });
    res.status(201).json(newBrandModel);
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเพิ่มรุ่นรถ' });
  }
});

// แก้ไขข้อมูล
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { model, brand } = req.body;

    const existingBrandModel = await BrandModel.findOne({ $and: [{ _id: { $ne: id } }, { model }] });

    if (existingBrandModel) {
      return res.status(400).json({ message: 'รถรุ่นนี้มีในระบบแล้ว' });
    }

    const updatedBrandModel = await BrandModel.findByIdAndUpdate(
      id,
      {
        model,
        brand,
      },
      { new: true, useFindAndModify: false }
    );
    res.status(200).json(updatedBrandModel);
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการแก้ไขข้อมูลรุ่นรถ' });
  }
});

// ลบข้อมูล
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await BrandModel.findByIdAndRemove(id);
    res.status(200).json({ message: 'ลบข้อมูลรุ่นรถเรียบร้อยแล้ว' });
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบข้อมูลรุ่นรถ' });
  }
});

module.exports = router;