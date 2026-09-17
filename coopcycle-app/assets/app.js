/* CoopCycle Courier landing page.
   Two jobs: draw the QR code, and say something useful about the APK. */

(function () {
  'use strict';

  // The APK sits next to this page. Change it here if you rename the file,
  // or point it at a full URL if you ever host the build elsewhere.
  var APK_FILE = 'https://github.com/r0xsh/r0xsh.github.io/releases/download/coopcycle-app/coopcycle-courier.apk';

  /* ----- QR code -------------------------------------------------------- */
  // Encodes this page's own address, not the APK: a courier scanning from a
  // laptop lands on the install instructions rather than on a bare download.

  function drawQr() {
    var host = document.getElementById('qr');
    if (!host || typeof qrcode !== 'function') return;

    var url = location.href.split('#')[0].split('?')[0];
    if (location.protocol === 'file:') {
      // No meaningful URL to hand out yet — hide the card instead of
      // encoding a path that only exists on this machine.
      var card = host.closest('.qr-card');
      if (card) card.style.display = 'none';
      return;
    }

    try {
      var qr = qrcode(0, 'M'); // 0 = pick the smallest version that fits
      qr.addData(url);
      qr.make();
      host.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
    } catch (e) {
      var fallback = host.closest('.qr-card');
      if (fallback) fallback.style.display = 'none';
    }
  }

  /* ----- APK status ----------------------------------------------------- */

  function formatSize(bytes) {
    var mb = bytes / (1024 * 1024);
    return (mb >= 10 ? Math.round(mb) : mb.toFixed(1)) + ' MB';
  }

  function formatDate(value) {
    var d = new Date(value);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleDateString(undefined, {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  function markUnavailable(btn, meta) {
    btn.classList.add('is-unavailable');
    btn.removeAttribute('href');
    btn.setAttribute('aria-disabled', 'true');
    var label = btn.querySelector('span');
    if (label) label.textContent = 'Build not published yet';
    if (meta) meta.textContent = 'Check back shortly — the APK is on its way.';
  }

  function checkApk() {
    var btn = document.getElementById('download-btn');
    var meta = document.getElementById('file-meta');
    if (!btn) return;

    btn.setAttribute('href', APK_FILE);

    // file:// and some static hosts do not answer HEAD usefully. In that case
    // we leave the button exactly as the HTML shipped it.
    if (location.protocol === 'file:' || typeof fetch !== 'function') return;

    fetch(APK_FILE, { method: 'HEAD' })
      .then(function (res) {
        if (res.status === 404) {
          markUnavailable(btn, meta);
          return;
        }
        if (!res.ok || !meta) return;

        var parts = [];
        var size = parseInt(res.headers.get('content-length') || '', 10);
        if (size > 0) parts.push(formatSize(size));

        var built = formatDate(res.headers.get('last-modified'));
        if (built) parts.push('built ' + built);

        parts.push('Android 8.0 or newer');
        meta.textContent = parts.join(' · ');
      })
      .catch(function () {
        /* Network hiccup or CORS: keep the plain download link. */
      });
  }

  drawQr();
  checkApk();
})();
