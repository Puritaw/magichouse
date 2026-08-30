(function () {
  const tableBody = document.getElementById('tableBody');
  const emptyState = document.getElementById('emptyState');
  const summaryCards = document.getElementById('summaryCards');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalBox = document.getElementById('modalBox');
  const logoutBtn = document.getElementById('logoutBtn');

  function formatDate(d) {
    if (!d) return '-';
    return new Date(d).toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' });
  }

  function escapeHtml(str) {
    if (str === undefined || str === null) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  async function loadList() {
    const res = await fetch('/api/admin/list');
    if (res.status === 401) {
      window.location.href = '/admin/login';
      return;
    }
    const data = await res.json();
    renderSummary(data.submissions);
    renderTable(data.submissions);
  }

  function renderSummary(rows) {
    const total = rows.length;
    const completed = rows.filter(r => r.status === 'completed').length;
    const houseCounts = {};
    rows.forEach(r => {
      if (r.houseName && r.houseName !== '-') {
        houseCounts[r.houseName] = (houseCounts[r.houseName] || 0) + 1;
      }
    });

    let html = `
      <div class="summary-card"><div class="num">${total}</div><div class="label">ลงทะเบียนทั้งหมด</div></div>
      <div class="summary-card"><div class="num">${completed}</div><div class="label">ทำแบบทดสอบเสร็จแล้ว</div></div>
    `;
    Object.entries(houseCounts).forEach(([name, count]) => {
      html += `<div class="summary-card"><div class="num">${count}</div><div class="label">${escapeHtml(name)}</div></div>`;
    });
    summaryCards.innerHTML = html;
  }

  function renderTable(rows) {
    tableBody.innerHTML = '';
    if (rows.length === 0) {
      emptyState.style.display = 'block';
      return;
    }
    emptyState.style.display = 'none';

    rows.forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${escapeHtml(r.fullName)}</td>
        <td>${escapeHtml(r.nickname)}</td>
        <td>${escapeHtml(r.age)}</td>
        <td>${escapeHtml(r.phone)}</td>
        <td><span class="badge ${r.status}">${r.status === 'completed' ? 'เสร็จสมบูรณ์' : 'ลงทะเบียนแล้ว'}</span></td>
        <td>${escapeHtml(r.houseName)}</td>
        <td>${formatDate(r.registeredAt)}</td>
        <td><button type="button" class="delete-btn" data-id="${r.id}" data-name="${escapeHtml(r.fullName)}">ลบ</button></td>
      `;
      tr.addEventListener('click', () => openDetail(r.id));
      const delBtn = tr.querySelector('.delete-btn');
      delBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteSubmission(r.id, r.fullName);
      });
      tableBody.appendChild(tr);
    });
  }

  async function deleteSubmission(id, name) {
    const confirmed = window.confirm(`ต้องการลบข้อมูลของ "${name}" ใช่ไหม?\n\nการลบนี้ถาวร กู้คืนไม่ได้`);
    if (!confirmed) return;

    const res = await fetch('/api/admin/delete/' + id, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      alert(data.message || 'ลบไม่สำเร็จ กรุณาลองใหม่');
      return;
    }
    closeDetail();
    loadList();
  }

  async function openDetail(id) {
    const res = await fetch('/api/admin/detail/' + id);
    const data = await res.json();
    if (!data.ok) return;
    const s = data.submission;
    const reg = s.registration || {};
    const result = s.result || {};
    const open = s.openAnswers || {};

    modalBox.innerHTML = `
      <button class="modal-close" id="modalCloseBtn">&times;</button>
      <h2>${escapeHtml(reg.fullName)} (${escapeHtml(reg.nickname)})</h2>

      <div class="detail-row"><span class="k">อายุ / เบอร์โทร / อีเมล</span><span class="v">${escapeHtml(reg.age)} / ${escapeHtml(reg.phone)} / ${escapeHtml(reg.email)}</span></div>
      <div class="detail-row"><span class="k">ช่องทางติดต่อ</span><span class="v">${escapeHtml(reg.contactChannel)}</span></div>
      <div class="detail-row"><span class="k">ผู้ปกครองท่านที่ 1</span><span class="v">${escapeHtml(reg.guardian1Name)} — ${escapeHtml(reg.guardian1Phone)}</span></div>
      <div class="detail-row"><span class="k">ผู้ปกครองท่านที่ 2</span><span class="v">${escapeHtml(reg.guardian2Name)} — ${escapeHtml(reg.guardian2Phone)}</span></div>
      <div class="detail-row"><span class="k">แนะนำตัวเอง</span><span class="v">${escapeHtml(reg.selfIntro) || '-'}</span></div>
      <div class="detail-row"><span class="k">เหตุผลที่อยากเข้าร่วม</span><span class="v">${escapeHtml(reg.reason) || '-'}</span></div>
      <div class="detail-row"><span class="k">สถานะ</span><span class="v">${s.status === 'completed' ? 'ทำแบบทดสอบเสร็จแล้ว — ได้ ' + escapeHtml(result.houseName) : 'ลงทะเบียนแล้ว ยังไม่ทำแบบทดสอบ'}</span></div>
      ${open.open1 ? `<div class="detail-row"><span class="k">ถ้ามีคนสนับสนุน อยากลองทำอะไรที่สุด</span><span class="v">${escapeHtml(open.open1)}</span></div>` : ''}
      ${open.open2 ? `<div class="detail-row"><span class="k">ตอนนี้สนใจอะไรอยู่</span><span class="v">${escapeHtml(open.open2)}</span></div>` : ''}
      <div class="detail-row"><span class="k">ลงทะเบียนเมื่อ</span><span class="v">${formatDate(s.registeredAt)}</span></div>
      ${s.completedAt ? `<div class="detail-row"><span class="k">ทำแบบทดสอบเสร็จเมื่อ</span><span class="v">${formatDate(s.completedAt)}</span></div>` : ''}
      <div class="modal-actions">
        <button type="button" class="delete-btn-lg" id="modalDeleteBtn">ลบข้อมูลคนนี้ทิ้ง</button>
      </div>
    `;
    modalOverlay.classList.add('show');
    document.getElementById('modalCloseBtn').addEventListener('click', closeDetail);
    document.getElementById('modalDeleteBtn').addEventListener('click', () => {
      deleteSubmission(s.id, reg.fullName);
    });
  }

  function closeDetail() {
    modalOverlay.classList.remove('show');
  }

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeDetail();
  });

  logoutBtn.addEventListener('click', async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  });

  loadList();
})();
