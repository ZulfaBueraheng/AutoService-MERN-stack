const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// To Get List Of Employees
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการโหลดข้อมูลพนักงาน:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการโหลดข้อมูลพนักงาน' });
  }
});

// สร้างพนักงานใหม่
router.post('/', async (req, res) => {
  try {
    const { name, nickname, phone, subdistrict, district, province } = req.body;

    const existingEmployee = await Employee.findOne({ name });

    if (existingEmployee) {
      return res.status(400).json({ message: 'ชื่อหรือชื่อเล่นนี้ถูกใช้งานแล้ว' });
    }
    const newEmployee = await Employee.create({
      name,
      nickname,
      phone,
      address: { subdistrict, district, province },
    });
    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการสร้างพนักงานใหม่' });
  }
});

// แก้ไขข้อมูลพนักงาน
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, nickname, phone, subdistrict, district, province } = req.body;

    const existingEmployee = await Employee.findOne({ $and: [{ _id: { $ne: id } }, { name }] });

    if (existingEmployee) {
      return res.status(400).json({ message: 'ชื่อหรือชื่อเล่นนี้ถูกใช้งานแล้ว' });
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      {
        name,
        nickname,
        phone,
        address: { subdistrict, district, province },
      },
      { new: true, useFindAndModify: false }
    );
    res.status(200).json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการแก้ไขข้อมูลพนักงาน' });
  }
});

// ลบข้อมูลพนักงาน
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Employee.findByIdAndRemove(id);
    res.status(200).json({ message: 'ลบข้อมูลพนักงานเรียบร้อยแล้ว' });
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบข้อมูลพนักงาน' });
  }
});

module.exports = router;
