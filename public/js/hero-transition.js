(function () {
  const link = document.getElementById('ctaLink');
  const veil = document.getElementById('transitionVeil');
  const hero = document.getElementById('heroMain');
  if (!link || !veil || !hero) return;

  link.addEventListener('click', function (e) {
    e.preventDefault();
    const dest = link.getAttribute('href');

    hero.classList.add('is-leaving');
    veil.classList.add('is-active');

    setTimeout(function () {
      window.location.href = dest;
    }, 620);
  });
})();