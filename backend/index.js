const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
require('dotenv').config();
const cookieParser = require("cookie-parser");

const mongo_url = process.env.MONGO_URL;
const port = process.env.PORT || 3001;

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// การเชื่อมต่อฐานข้อมูล MongoDB
mongoose.connect(mongo_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// กำหนดเส้นทาง API ของระบบ
const authRoutes = require('./Routes/AuthRoute');
app.use('/', authRoutes);

const employeeRoutes = require('./Routes/employeeRoutes');
app.use('/employees', employeeRoutes);

const spareRoutes = require('./Routes/spareRoutes');
app.use('/spares', spareRoutes);

const serviceRoutes = require('./Routes/serviceRoutes');
app.use('/services', serviceRoutes);

const brandmodelRoutes = require('./Routes/brandmodelRoutes');
app.use('/brandmodels', brandmodelRoutes);

const colorRoutes = require('./Routes/colorRoutes');
app.use('/colors', colorRoutes);

const repairRoutes = require('./Routes/repairRoutes');
app.use('/repairs', repairRoutes);

const userlineidRoutes = require('./Routes/userlineidRoutes');
app.use('/webhook', userlineidRoutes);

const sendlineRoutes = require('./Routes/sendlineRoutes');
app.use('/send-message', sendlineRoutes);

// กำหนดพอร์ตที่ใช้รัน Backend
app.listen(port, () => {
    console.log("server is running");
});
