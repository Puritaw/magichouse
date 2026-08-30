(function () {
  const container = document.getElementById('butterflies');
  if (!container) return;

  const COLORS = ['#ffd873', '#f7c9d6', '#a7d8f0', '#fff3c4'];

  function makeButterfly() {
    const wrap = document.createElement('span');
    wrap.className = 'butterfly';

    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    wrap.innerHTML =
      '<svg viewBox="0 0 40 28" xmlns="http://www.w3.org/2000/svg">' +
      '<g class="wing wing-left"><path d="M20 14 C10 2, -2 4, 2 14 C-2 24, 10 26, 20 14 Z" fill="' + color + '"/></g>' +
      '<g class="wing wing-right"><path d="M20 14 C30 2, 42 4, 38 14 C42 24, 30 26, 20 14 Z" fill="' + color + '"/></g>' +
      '<line x1="20" y1="8" x2="20" y2="20" stroke="#3a2a12" stroke-width="1.4" stroke-linecap="round"/>' +
      '</svg>';

    // random start/end positions for a lazy diagonal flight path across the scene
    const startX = -8 + Math.random() * 20;
    const startY = 20 + Math.random() * 55;
    const driftX = 60 + Math.random() * 30;
    const driftY = -20 + Math.random() * 40;
    const duration = 9 + Math.random() * 6;
    const delay = Math.random() * 10;
    const scale = 0.7 + Math.random() * 0.6;
    const reverse = Math.random() > 0.5;

    wrap.style.left = startX + '%';
    wrap.style.top = startY + '%';
    wrap.style.setProperty('--drift-x', (reverse ? -1 : 1) * driftX + 'px');
    wrap.style.setProperty('--drift-y', driftY + 'px');
    wrap.style.setProperty('--bfly-scale', scale);
    wrap.style.animationDuration = duration + 's, 0.5s';
    wrap.style.animationDelay = delay + 's, ' + delay + 's';
    if (reverse) wrap.style.transform = 'scaleX(-1)';

    container.appendChild(wrap);

    // remove and respawn after each flight loop so paths stay varied
    setTimeout(function respawn() {
      wrap.remove();
      makeButterfly();
    }, (duration + delay) * 1000);
  }

  const COUNT = 5;
  for (let i = 0; i < COUNT; i++) {
    setTimeout(makeButterfly, i * 1400);
  }
})();