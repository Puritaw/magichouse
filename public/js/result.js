(function () {
  const id = localStorage.getItem('magicHomeId');
  const container = document.getElementById('resultContainer');

  if (!id) {
    window.location.href = '/register.html';
    return;
  }

  const AVATAR = {
    tonthara: '🌱',
    daonamtang: '⭐',
    raekarun: '🌅'
  };

  const HOUSE_IMAGE = {
    tonthara: '/images/houses/tonthara.png',
    daonamtang: '/images/houses/daonamtang.png',
    raekarun: '/images/houses/raekarun.png'
  };

  function formatDate(d) {
    const date = new Date(d);
    return date.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  fetch('/api/my-result/' + id)
    .then(r => r.json())
    .then(data => {
      if (!data.ok) throw new Error(data.message || 'ไม่พบผลลัพธ์');
      renderResult(data);
    })
    .catch(err => {
      container.innerHTML = `<p class="loading-text">${err.message}. <a href="/quiz.html" style="text-decoration:underline;">กลับไปทำแบบทดสอบ</a></p>`;
    });

  function renderResult(data) {
    const house = data.house;
    const avatar = AVATAR[house.key] || '✨';
    const houseImage = HOUSE_IMAGE[house.key] || '';
    const today = formatDate(new Date());

    container.innerHTML = `
      <div class="result-screen active" id="screenHouse">
        <h1 class="result-heading">เธออยู่ที่...</h1>
        <p class="result-sub">${house.name}</p>

        <div class="house-intro-card theme-${house.theme}">
          <span class="house-badge">${house.name}</span>
          <p class="house-welcome">ยินดีต้อนรับสู่ &ldquo;${house.name}&rdquo;</p>
          <p class="house-intro-text">${escapeHtml(house.description)}</p>
        </div>

        <div class="result-actions">
          <button type="button" class="pill-btn" id="toCardBtn">ดูบัตรของเธอ</button>
        </div>

        ${houseImage ? `
        <div class="house-character theme-${house.theme}">
          <img src="${houseImage}" alt="${escapeHtml(house.name)}" loading="lazy" decoding="async" />
        </div>` : ''}
      </div>

      <div class="result-screen" id="screenCard">
        <h1 class="result-heading">บัตรประจำตัว</h1>
        <p class="result-sub">เวทมนตร์ของเธอ</p>

        <div class="id-card theme-${house.theme}" id="idCard">
          <span class="id-card-corner corner-tl" aria-hidden="true">✦</span>
          <span class="id-card-corner corner-tr" aria-hidden="true">✦</span>
          <div class="id-card-shine" aria-hidden="true"></div>

          <div class="id-card-top">
            <div class="id-card-brand"><span class="brand-icon" aria-hidden="true">✨</span>Magic Home<small>STUDENT&nbsp;ID</small></div>
          </div>

          <div class="id-card-body">
            <div class="id-card-avatar-wrap">
              <div class="id-card-avatar">${avatar}</div>
              <span class="id-card-avatar-badge" aria-hidden="true">★</span>
            </div>

            <p class="id-card-name">${escapeHtml(data.nickname || data.fullName || '')}</p>
            <p class="id-card-house">${house.name}</p>

            <div class="id-card-divider" aria-hidden="true"></div>

            <div class="id-card-row">
              <div>
                <span class="row-label"><span class="row-icon" aria-hidden="true">🏡</span>บ้าน</span>
                <span class="row-value">${house.name}</span>
              </div>
              <div>
                <span class="row-label"><span class="row-icon" aria-hidden="true">📅</span>วันที่ออกบัตร</span>
                <span class="row-value">${today}</span>
              </div>
            </div>

            <div class="id-card-signature">${escapeHtml(data.nickname || '')}</div>
          </div>

          <div class="id-card-footer">✦ find your magic home ✦</div>
        </div>

        <div class="result-actions">
          <button type="button" class="nav-btn-secondary" id="backBtn">ย้อนกลับ</button>
          <button type="button" class="pill-btn" id="downloadBtn">ดาวน์โหลดบัตร</button>
        </div>
        <p class="download-note">บันทึกเป็นรูปภาพเก็บไว้ในเครื่องของเธอได้เลย</p>
      </div>
    `;

    const screenHouse = document.getElementById('screenHouse');
    const screenCard = document.getElementById('screenCard');

    document.getElementById('toCardBtn').addEventListener('click', () => {
      screenHouse.classList.remove('active');
      screenCard.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Card screen is now in use: start fetching html2canvas in the
      // background so it's likely ready by the time "download" is pressed.
      loadHtml2Canvas().catch(() => {});
    });
    document.getElementById('backBtn').addEventListener('click', () => {
      screenCard.classList.remove('active');
      screenHouse.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.getElementById('downloadBtn').addEventListener('click', downloadCard);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // html2canvas is only needed if/when the user reaches the ID-card screen
  // and actually presses "download". Loading it eagerly on every visit to
  // this page wastes ~200KB of JS most people never use, so we fetch the
  // library lazily, once, the first time it's actually needed.
  let html2canvasPromise = null;
  function loadHtml2Canvas() {
    if (window.html2canvas) return Promise.resolve(window.html2canvas);
    if (!html2canvasPromise) {
      html2canvasPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        script.onload = () => resolve(window.html2canvas);
        script.onerror = () => reject(new Error('โหลดไลบรารีไม่สำเร็จ'));
        document.head.appendChild(script);
      });
    }
    return html2canvasPromise;
  }

  function downloadCard() {
    const card = document.getElementById('idCard');
    const btn = document.getElementById('downloadBtn');
    btn.disabled = true;
    btn.textContent = 'กำลังสร้างรูปภาพ...';

    loadHtml2Canvas()
      .then(html2canvas => html2canvas(card, { scale: 2, backgroundColor: null }))
      .then(canvas => {
        const link = document.createElement('a');
        link.download = 'magic-home-card.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        btn.disabled = false;
        btn.textContent = 'ดาวน์โหลดบัตร';
      })
      .catch(() => {
        btn.disabled = false;
        btn.textContent = 'ดาวน์โหลดบัตร';
      });
  }
})();
