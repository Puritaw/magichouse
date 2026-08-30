(function () {
  const container = document.getElementById('heroForest');
  if (!container) return;

  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', '0 0 1000 220');
  svg.setAttribute('preserveAspectRatio', 'none');
  svg.setAttribute('aria-hidden', 'true');
  container.appendChild(svg);

  function pineTree(x, baseY, height, width, cls, color, trunkColor) {
    const g = document.createElementNS(svgNS, 'g');
    g.setAttribute('class', cls);
    g.style.transformBox = 'fill-box';
    g.style.transformOrigin = 'bottom center';

    const trunkW = width * 0.14;
    const trunk = document.createElementNS(svgNS, 'rect');
    trunk.setAttribute('x', x - trunkW / 2);
    trunk.setAttribute('y', baseY - height * 0.12);
    trunk.setAttribute('width', trunkW);
    trunk.setAttribute('height', height * 0.16);
    trunk.setAttribute('fill', trunkColor);
    g.appendChild(trunk);

    const tiers = 3;
    for (let i = 0; i < tiers; i++) {
      const tierH = height * (0.55 - i * 0.1);
      const tierW = width * (1 - i * 0.22);
      const tierY = baseY - height * 0.08 - i * (height * 0.32);
      const p = document.createElementNS(svgNS, 'path');
      p.setAttribute(
        'd',
        'M ' + x + ' ' + (tierY - tierH) +
        ' L ' + (x - tierW / 2) + ' ' + tierY +
        ' L ' + (x + tierW / 2) + ' ' + tierY + ' Z'
      );
      p.setAttribute('fill', color);
      g.appendChild(p);
    }
    svg.appendChild(g);
  }

  const farColor = '#1b3a26';
  const nearColor = '#0f2418';
  const trunkColor = '#2a1a10';

  // distant, smaller cluster scattered across the horizon
  const farPositions = [30, 130, 220, 780, 870, 960];
  farPositions.forEach(function (x, i) {
    pineTree(x, 185, 85 + (i % 3) * 8, 65, 'tree-far', farColor, trunkColor);
  });

  // taller trees framing the left/right edges, closer to the viewer
  const nearPositions = [-20, 95, 905, 1020];
  nearPositions.forEach(function (x, i) {
    pineTree(x, 220, 150 + (i % 2) * 22, 110, 'tree-near', nearColor, trunkColor);
  });
})();