const express = require('express');
const router = express.Router();
const UserLineId = require('../models/UserLineId')
const line = require('@line/bot-sdk');
require('dotenv').config();

const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
};
const client = new line.Client(config);

router.post('/', async (req, res) => {
    const events = req.body.events;
    for (const event of events) {
        if (event.type === 'message' && event.message.type === 'text') {
            const userId = event.source.userId;
            const messageText = event.message.text;

            if (messageText.toLowerCase().startsWith('lineid ')) {
                const lineId = messageText.substring(7);

                await addOrUpdateLineIdToDatabase(userId, lineId);

                await client.replyMessage(event.replyToken, [
                    {
                        type: 'text',
                        text: `Line ID: ${lineId} ถูกบันทึกเรียบร้อย`,
                    },
                    {
                        type: 'text',
                        text: 'หากต้องการแก้ไข ท่านสามารถพิมพ์\n"lineid ตามด้วยไลน์ไอดีของคุณ" อีกครั้งค่ะ\nเช่น lineid somchai1234',
                    }
                ]);
            }
        }
    }
    res.sendStatus(200);
});

// ฟังก์ชันสำหรับการเพิ่มข้อมูล Line ID ลงในฐานข้อมูล
async function addOrUpdateLineIdToDatabase(userId, lineId) {
    try {
        const existingUser = await UserLineId.findOne({ userId: userId });

        if (existingUser) {
            const updatedResult = await UserLineId.updateOne(
                { userId: userId },
                { $set: { lineId: lineId } }
            );
            console.log('Line ID updated in MongoDB:', updatedResult.modifiedCount);
        } else {
            const newUserLineId = await UserLineId.create({
                userId,
                lineId,
            });
        }
    } catch (error) {
        console.error('Error adding/updating Line ID to MongoDB:', error);
    }
}

router.get('/', async (req, res) => {
    try {
        const customers = await UserLineId.find();
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: 'Error loading UserLineId data', error });
    }
});

module.exports = router;