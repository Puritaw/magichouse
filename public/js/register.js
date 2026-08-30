(function () {
  const form = document.getElementById('regForm');
  const errorMsg = document.getElementById('errorMsg');
  const submitBtn = document.getElementById('submitBtn');

  function showError(message) {
    errorMsg.textContent = message;
    errorMsg.classList.add('show');
    errorMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    errorMsg.classList.remove('show');

    const data = Object.fromEntries(new FormData(form).entries());

    submitBtn.disabled = true;
    submitBtn.textContent = 'กำลังบันทึก...';

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();

      if (!res.ok || !result.ok) {
        throw new Error(result.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่');
      }

      localStorage.setItem('magicHomeId', result.id);
      window.location.href = '/quiz.html';
    } catch (err) {
      showError(err.message);
      submitBtn.disabled = false;
      submitBtn.textContent = 'ถัดไป';
    }
  });
})();
