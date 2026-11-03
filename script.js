(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // entrances
  var items = document.querySelectorAll('[data-r]');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    items.forEach(function (el) { io.observe(el); });
    setTimeout(function () { items.forEach(function (el) { if (el.getBoundingClientRect().top < innerHeight) el.classList.add('in'); }); }, 50);
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // picker: index with preview
  var imgs = { evak: 'evakuator', kopat: 'ekskavator', snos: 'demontazh', musor: 'vyvoz', neznayu: 'zemlya' };
  var texts = { evak: 'увезти автомобиль', kopat: 'подготовить участок и выкопать', snos: 'снести или разобрать', musor: 'вывезти мусор', neznayu: 'подобрать технику' };
  var btns = document.querySelectorAll('.pick-list button');
  var arts = document.querySelectorAll('.pick-out article');
  var pimg = document.getElementById('pick-img');
  var cur = 'evak';
  function show(k) {
    if (k === cur) return;
    cur = k;
    btns.forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.k === k ? 'true' : 'false'); });
    arts.forEach(function (a) { a.hidden = a.dataset.p !== k; });
    pimg.style.opacity = 0;
    setTimeout(function () { pimg.src = 'assets/' + imgs[k] + '.webp'; pimg.style.opacity = 1; }, reduce ? 0 : 120);
    setWa();
  }
  btns.forEach(function (b) {
    b.addEventListener('click', function () { show(b.dataset.k); });
    b.addEventListener('mouseenter', function () { if (matchMedia('(hover:hover)').matches) show(b.dataset.k); });
    b.addEventListener('focus', function () { show(b.dataset.k); });
  });

  // WhatsApp text follows the chosen task
  function setWa() {
    var msg = encodeURIComponent('Здравствуйте! Нужно: ' + texts[cur] + '.');
    document.querySelectorAll('.pick-wa').forEach(function (a) {
      a.href = 'https://wa.me/79000000000?text=' + msg;
    });
  }
  setWa();

  // gallery: one frame, contents change
  var gal = document.getElementById('gal');
  var cap = document.getElementById('gal-cap');
  if (gal) {
    var ims = gal.querySelectorAll('img');
    var i = 0, timer;
    function go(n) {
      ims[i].classList.remove('on');
      i = n % ims.length;
      ims[i].classList.add('on');
      cap.textContent = ims[i].dataset.c;
    }
    ims[0].classList.add('on');
    function start() { if (!reduce) timer = setInterval(function () { go(i + 1); }, 3000); }
    gal.addEventListener('click', function () { clearInterval(timer); go(i + 1); start(); });
    gal.addEventListener('mouseenter', function () { clearInterval(timer); });
    gal.addEventListener('mouseleave', function () { clearInterval(timer); start(); });
    gal.addEventListener('focus', function () { clearInterval(timer); });
    gal.addEventListener('blur', function () { clearInterval(timer); start(); });
    gal.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); gal.click(); } });
    start();
  }
})();
