const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/auth');
const store = require('../data/store');

// เข้าสู่ระบบแอดมิน
router.post('/login', (req, res) => {
  const { password } = req.body;
  const correctPassword = process.env.ADMIN_PASSWORD || 'changeme123';

  if (password === correctPassword) {
    req.session.isAdmin = true;
    return res.json({ ok: true });
  }
  res.status(401).json({ ok: false, message: 'รหัสผ่านไม่ถูกต้อง' });
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

router.get('/check', (req, res) => {
  res.json({ ok: true, isAdmin: !!(req.session && req.session.isAdmin) });
});

// รายชื่อผู้ลงทะเบียนทั้งหมด (สรุปย่อ) เรียงจากล่าสุด
router.get('/list', requireAdmin, (req, res) => {
  const all = store.listSubmissions().map(s => ({
    id: s.id,
    fullName: s.registration ? s.registration.fullName : '-',
    nickname: s.registration ? s.registration.nickname : '-',
    age: s.registration ? s.registration.age : '-',
    phone: s.registration ? s.registration.phone : '-',
    status: s.status,
    houseName: s.result ? s.result.houseName : '-',
    registeredAt: s.registeredAt,
    completedAt: s.completedAt || null
  }));
  res.json({ ok: true, submissions: all });
});

// ดูรายละเอียดเต็มของคนใดคนหนึ่ง
router.get('/detail/:id', requireAdmin, (req, res) => {
  const submission = store.getSubmission(req.params.id);
  if (!submission) {
    return res.status(404).json({ ok: false, message: 'ไม่พบข้อมูล' });
  }
  res.json({ ok: true, submission });
});

// ลบข้อมูลผู้ใช้ 1 คนออกถาวร (ลบไฟล์ .json ทิ้งจากเซิร์ฟเวอร์เลย กู้คืนไม่ได้)
router.delete('/delete/:id', requireAdmin, (req, res) => {
  const existing = store.getSubmission(req.params.id);
  if (!existing) {
    return res.status(404).json({ ok: false, message: 'ไม่พบข้อมูลนี้ อาจถูกลบไปแล้ว' });
  }
  store.deleteSubmission(req.params.id);
  res.json({ ok: true });
});

// ส่งออกเป็นไฟล์ CSV เปิดใน Excel ได้ทันที
router.get('/export.csv', requireAdmin, (req, res) => {
  const all = store.listSubmissions();

  const headers = [
    'ชื่อ-สกุล', 'ชื่อเล่น', 'อายุ', 'เบอร์โทร', 'อีเมล', 'ช่องทางติดต่อ',
    'ผู้ปกครอง1', 'เบอร์ผู้ปกครอง1', 'ผู้ปกครอง2', 'เบอร์ผู้ปกครอง2',
    'แนะนำตัว', 'เหตุผลที่อยากเข้าร่วม', 'สถานะ', 'บ้านที่ได้',
    'วันที่ลงทะเบียน', 'วันที่ทำแบบทดสอบเสร็จ'
  ];

  const escapeCsv = (val) => {
    if (val === undefined || val === null) return '';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = all.map(s => {
    const r = s.registration || {};
    return [
      r.fullName, r.nickname, r.age, r.phone, r.email, r.contactChannel,
      r.guardian1Name, r.guardian1Phone, r.guardian2Name, r.guardian2Phone,
      r.selfIntro, r.reason, s.status,
      s.result ? s.result.houseName : '',
      s.registeredAt, s.completedAt || ''
    ].map(escapeCsv).join(',');
  });

  const csv = '\uFEFF' + headers.map(escapeCsv).join(',') + '\n' + rows.join('\n');

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="magic-home-submissions.csv"');
  res.send(csv);
});

module.exports = router;
