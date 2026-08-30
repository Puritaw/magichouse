const fs = require('fs');
const path = require('path');

const SUBMISSIONS_DIR = path.join(__dirname, 'submissions');

if (!fs.existsSync(SUBMISSIONS_DIR)) {
  fs.mkdirSync(SUBMISSIONS_DIR, { recursive: true });
}

function filePathFor(id) {
  return path.join(SUBMISSIONS_DIR, `${id}.json`);
}

// สร้าง/บันทึกข้อมูลผู้ใช้ 1 คน เป็นไฟล์ .json แยกรายคน อ่านง่าย จัดเรียงเป็นระเบียบ
function saveSubmission(id, data) {
  const filePath = filePathFor(id);
  const payload = {
    id,
    ...data,
    updatedAt: new Date().toISOString()
  };
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), 'utf-8');
  return payload;
}

function getSubmission(id) {
  const filePath = filePathFor(id);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

function mergeSubmission(id, patch) {
  const existing = getSubmission(id) || {};
  return saveSubmission(id, { ...existing, ...patch });
}

// ลบข้อมูลผู้ใช้ 1 คนออกจากระบบถาวร (สำหรับหน้าแอดมินเท่านั้น)
function deleteSubmission(id) {
  const filePath = filePathFor(id);
  if (!fs.existsSync(filePath)) return false;
  fs.unlinkSync(filePath);
  return true;
}

// ดึงรายชื่อผู้ลงทะเบียนทั้งหมด เรียงจากล่าสุดไปเก่าสุด (สำหรับหน้าแอดมินเท่านั้น)
function listSubmissions() {
  const files = fs.readdirSync(SUBMISSIONS_DIR).filter(f => f.endsWith('.json'));
  const all = files.map(f => {
    const raw = fs.readFileSync(path.join(SUBMISSIONS_DIR, f), 'utf-8');
    try {
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }).filter(Boolean);

  all.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  return all;
}

module.exports = {
  saveSubmission,
  getSubmission,
  mergeSubmission,
  deleteSubmission,
  listSubmissions,
  SUBMISSIONS_DIR
};
