(function () {
  const form = document.getElementById('loginForm');
  const errorEl = document.getElementById('loginError');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    errorEl.classList.remove('show');
    const password = document.getElementById('password').value;

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.message || 'เข้าสู่ระบบไม่สำเร็จ');
      }
      window.location.href = '/admin/dashboard';
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.classList.add('show');
    }
  });
})();
