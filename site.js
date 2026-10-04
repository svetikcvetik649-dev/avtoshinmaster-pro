(function () {
  var $ = function (id) { return document.getElementById(id); };
  var PHONE_WA = '79151147299';
  var TG = 'https://t.me/+79151147299';

  /* статус по Москве: открыто с 10:00 до 20:00 каждый день */
  var st = $('open-status'), txt = $('open-text');
  try {
    var p = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Moscow', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
    var o = {}; p.forEach(function (x) { o[x.type] = x.value; });
    var cur = (parseInt(o.hour, 10) % 24) + parseInt(o.minute, 10) / 60;
    if (st && txt) {
      if (cur >= 10 && cur < 20) { txt.textContent = 'Сейчас открыто, до 20:00'; st.classList.remove('is-closed'); }
      else { txt.textContent = 'Сейчас закрыто, с 10:00 до 20:00'; st.classList.add('is-closed'); }
    }
  } catch (e) {}

  /* стенд на двери: выбор работ и текст сообщения */
  var board = $('board');
  if (!board) return;
  var tags = [].slice.call(board.querySelectorAll('.tag'));
  var car = $('car'), bubble = $('bubble'), wa = $('wa-send'), copyBtn = $('tg-copy'), copied = $('copied');
  var base = 'Здравствуйте! Хочу приехать в Автошинмастер-про на Нижние Поля, 29';

  function text() {
    var jobs = tags.filter(function (t) { return t.getAttribute('aria-pressed') === 'true'; }).map(function (t) { return t.getAttribute('data-job'); });
    var c = (car.value || '').trim();
    var s = base + '.';
    if (jobs.length) s += ' Нужно: ' + jobs.join(', ') + '.';
    if (c) s += ' Машина и колёса: ' + c + '.';
    s += ' Когда можно подъехать?';
    return s;
  }
  function render() {
    var t = text();
    bubble.textContent = t;
    wa.href = 'https://wa.me/' + PHONE_WA + '?text=' + encodeURIComponent(t);
    if (copied) copied.hidden = true;
  }
  tags.forEach(function (t) {
    t.addEventListener('click', function () {
      t.setAttribute('aria-pressed', t.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
      render();
    });
  });
  car.addEventListener('input', render);
  board.addEventListener('submit', function (e) { e.preventDefault(); });

  copyBtn.addEventListener('click', function () {
    var t = text();
    var done = function () {
      if (copied) { copied.hidden = false; }
      window.open(TG, '_blank', 'noopener');
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(done, done);
    else done();
  });

  /* WhatsApp в первом экране и внизу тоже получает текст */
  ['wa-hero', 'wa-foot'].forEach(function (id) {
    var a = $(id); if (!a) return;
    a.addEventListener('click', function () { a.href = 'https://wa.me/' + PHONE_WA + '?text=' + encodeURIComponent(text()); });
  });
  render();
})();
