const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

router.get('/', async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการโหลดข้อมูลบริการ:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการโหลดข้อมูลบริการ' });
  }
});

router.post('/', async (req, res) => {
  try {
    const {
      serviceName,
    } = req.body;

    const existingService = await Service.findOne({ serviceName });

    if (existingService) {
      return res.status(400).json({ message: 'ชื่อบริการนี้มีในระบบแล้ว' });
    }

    const newService = await Service.create({
      serviceName,
    });

    res.status(201).json(newService);
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการเพิ่มรายการซ่อม:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเพิ่มรายการซ่อม' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      serviceName,
    } = req.body;

    const existingService = await Service.findOne({ $and: [{ _id: { $ne: id } }, { serviceName }] });

    if (existingService) {
      return res.status(400).json({ message: 'ชื่อบริการนี้มีในระบบแล้ว' });
    }

    const updatedService = await Service.findByIdAndUpdate(
      id,
      {
        serviceName,
      },
      { new: true, useFindAndModify: false }
    );

    res.status(200).json(updatedService);
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการแก้ไขข้อมูลรายการซ่อม:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการแก้ไขข้อมูลรายการซ่อม' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Service.findByIdAndRemove(id);
    res.status(200).json({ message: 'ลบข้อมูลบริการเรียบร้อยแล้ว' });
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการลบข้อมูลบริการ:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบข้อมูลบริการ' });
  }
});

module.exports = router;
