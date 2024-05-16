const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();

router.post('/', async (req, res) => {
    const { userId, flexMessage } = req.body;
    try {
        const LINE_MESSAGING_API = 'https://api.line.me/v2/bot/message/push';
        const LINE_ACCESS_TOKEN = process.env.LINE_ACCESSTOKEN;
        await axios.post(
            LINE_MESSAGING_API,
            {
                to: userId,
                messages: [
                    {
                        type: 'flex',
                        altText: 'This is a Flex Message',
                        contents: flexMessage,
                    },
                ],
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${LINE_ACCESS_TOKEN}`,
                },
            }
        );
        res.status(200).json({ success: true, message: 'ส่งข้อความไปทางไลน์สำเร็จ' });
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการส่งข้อความไปทางไลน์:', error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการส่งข้อความไปทางไลน์' });
    }
});

module.exports = router;
