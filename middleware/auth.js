function requireAdmin(req, res, next) {
  if (req.session && req.session.isAdmin) {
    return next();
  }
  // ถ้าเป็นการเรียก API ให้ตอบ JSON, ถ้าเป็นการเปิดหน้าเว็บให้ redirect ไป login
  if (req.originalUrl.startsWith('/api/')) {
    return res.status(401).json({ ok: false, message: 'กรุณาเข้าสู่ระบบแอดมินก่อน' });
  }
  return res.redirect('/admin/login');
}

module.exports = { requireAdmin };
