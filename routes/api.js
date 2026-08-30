const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const store = require('../data/store');
const { QUESTIONS, OPEN_QUESTIONS, calculateHouse } = require('./houseLogic');

// ให้หน้าคำถามฝั่งผู้ใช้ดึงชุดคำถามไปแสดงผล (ไม่มีข้อมูลส่วนตัวใครอยู่ในนี้)
router.get('/quiz-questions', (req, res) => {
  res.json({ ok: true, questions: QUESTIONS, openQuestions: OPEN_QUESTIONS });
});

// ขั้นตอนที่ 1: บันทึกข้อมูลลงทะเบียน -> สร้างไฟล์ข้อมูล 1 ไฟล์ต่อ 1 คน
router.post('/register', (req, res) => {
  const {
    fullName, nickname, age, phone, email, contactChannel,
    guardian1Name, guardian1Phone, guardian2Name, guardian2Phone,
    selfIntro, reason
  } = req.body;

  if (!fullName || !nickname || !age || !phone) {
    return res.status(400).json({ ok: false, message: 'กรุณากรอกข้อมูลให้ครบ (ชื่อ-สกุล, ชื่อเล่น, อายุ, เบอร์โทร)' });
  }

  const id = uuidv4();
  const submission = store.saveSubmission(id, {
    status: 'registered',
    registeredAt: new Date().toISOString(),
    registration: {
      fullName, nickname, age, phone, email, contactChannel,
      guardian1Name, guardian1Phone, guardian2Name, guardian2Phone,
      selfIntro, reason
    }
  });

  res.json({ ok: true, id: submission.id });
});

// ขั้นตอนที่ 2: บันทึกคำตอบแบบทดสอบ + คำนวณผลบ้าน
router.post('/quiz', (req, res) => {
  const { id, answers, openAnswers } = req.body;

  if (!id) {
    return res.status(400).json({ ok: false, message: 'ไม่พบรหัสผู้ลงทะเบียน กรุณาลงทะเบียนใหม่อีกครั้ง' });
  }

  const existing = store.getSubmission(id);
  if (!existing) {
    return res.status(404).json({ ok: false, message: 'ไม่พบข้อมูลการลงทะเบียนนี้' });
  }

  const result = calculateHouse(answers || {});

  const updated = store.mergeSubmission(id, {
    status: 'completed',
    quizAnswers: answers || {},
    openAnswers: openAnswers || {},
    result: {
      houseKey: result.houseKey,
      houseName: result.house.name,
      score: result.score
    },
    completedAt: new Date().toISOString()
  });

  res.json({
    ok: true,
    id: updated.id,
    house: result.house,
    fullName: updated.registration ? updated.registration.fullName : '',
    nickname: updated.registration ? updated.registration.nickname : ''
  });
});

// หน้าผลลัพธ์ใช้ดึงข้อมูลย้อนหลังของตัวเอง (ต้องมี id ที่ถูกต้องเท่านั้น ไม่เปิดให้ list รายชื่อคนอื่น)
router.get('/my-result/:id', (req, res) => {
  const submission = store.getSubmission(req.params.id);
  if (!submission || submission.status !== 'completed') {
    return res.status(404).json({ ok: false, message: 'ไม่พบผลลัพธ์ กรุณาทำแบบทดสอบให้เสร็จก่อน' });
  }
  const { HOUSES } = require('./houseLogic');
  res.json({
    ok: true,
    house: HOUSES[submission.result.houseKey],
    fullName: submission.registration.fullName,
    nickname: submission.registration.nickname
  });
});

module.exports = router;
