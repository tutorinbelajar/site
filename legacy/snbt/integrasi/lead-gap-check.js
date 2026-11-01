/* Tutorin — SNBT TO Gap Check
 * Direct assessment access. Enhances the existing report button
 * so the complete rendered analysis can be saved as a standalone HTML file.
 */
(function () {
  function install() {
    const button = document.getElementById('downloadReport');
    if (!button) return;
    const replacement = button.cloneNode(true);
    button.replaceWith(replacement);
    replacement.addEventListener('click', function () {
      const selectors = ['#result', '#study'];
      const content = selectors.map(function (selector) {
        const el = document.querySelector(selector);
        if (!el) return '';
        const clone = el.cloneNode(true);
        clone.querySelectorAll('.reportActions, .actions, button').forEach(function (node) { node.remove(); });
        return clone.outerHTML;
      }).join('\n');
      const styles = Array.from(document.querySelectorAll('style')).map(function (s) { return s.textContent; }).join('\n');
      const report = '<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SNBT TO Gap Check — Laporan Analisis</title><style>' + styles + '\nbody{background:#fff}.wrap{max-width:1100px;margin:0 auto;padding:24px 20px}.result,.study{display:block!important;margin:0 0 18px}.reportActions,.actions{display:none!important}.tableWrap{overflow:visible}.table{min-width:0!important}@media print{body{background:#fff}.wrap{max-width:none;padding:0}.result,.study{border:0;box-shadow:none}.tableWrap{overflow:visible}.table{min-width:0!important}}</style></head><body><main class="wrap"><div style="margin-bottom:22px"><strong style="font-size:22px;color:#07583f">TUTORIN</strong><div style="color:#64766e;font-size:12px;margin-top:4px">SNBT TO Gap Check — Laporan Analisis</div><div style="color:#64766e;font-size:11px;margin-top:4px">Laporan dibuat ' + new Date().toLocaleString('id-ID') + '</div></div>' + content + '<div style="margin-top:24px;padding-top:14px;border-top:1px solid #d9e7df;color:#64766e;font-size:11px">Laporan ini berisi analisis berdasarkan target, hasil Try Out, dan diagnosis yang dimasukkan. Rekomendasi bukan prediksi hasil SNBT.</div></main></body></html>';
      const blob = new Blob([report], {type:'text/html;charset=utf-8'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Tutorin-SNBT-TO-Gap-Check.html';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install); else install();
})();
