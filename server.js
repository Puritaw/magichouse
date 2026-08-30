require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');

const apiRoutes = require('./routes/api');
const adminRoutes = require('./routes/admin');
const { requireAdmin } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 4 // 4 ชั่วโมง
  }
}));

// ----- หน้าเว็บฝั่งผู้ใช้ (ทุกคนเข้าถึงได้) -----
// ให้เข้าถึงได้แค่ หน้าแรก / ลงทะเบียน / คำถาม / ผลลัพธ์ และไฟล์ css/js/รูปภาพที่จำเป็น
app.use(express.static(path.join(__dirname, 'public')));

// ----- API ฝั่งผู้ใช้ (ลงทะเบียน / ส่งคำตอบแบบทดสอบ) -----
app.use('/api', apiRoutes);

// ----- ฝั่งแอดมิน -----
// ไฟล์ static ของแอดมิน (css/js ของหน้า login/dashboard) เปิดให้โหลดได้
app.use('/admin/assets', express.static(path.join(__dirname, 'admin', 'assets')));

// หน้า login เข้าได้เสมอ
app.get('/admin/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'login.html'));
});

// หน้า dashboard และ API ของแอดมิน ต้อง login ก่อนเท่านั้น
app.get('/admin', requireAdmin, (req, res) => {
  res.redirect('/admin/dashboard');
});
app.get('/admin/dashboard', requireAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'dashboard.html'));
});

app.use('/api/admin', adminRoutes);

app.listen(PORT, () => {
  console.log(`✨ Magic Home server กำลังทำงานที่ http://localhost:${PORT}`);
});
