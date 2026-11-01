/* Tutorin — SNBT Readiness Check
 * Direct assessment access. Enhances the existing Download Hasil button
 * so the complete rendered analysis can be saved as a standalone HTML file.
 */
(function () {
  function makeReport(buttonId, sections, filename, title) {
    const button = document.getElementById(buttonId);
    if (!button) return;
    const replacement = button.cloneNode(true);
    button.replaceWith(replacement);
    replacement.addEventListener('click', function () {
      const content = sections.map(function (selector) {
        const el = document.querySelector(selector);
        if (!el) return '';
        const clone = el.cloneNode(true);
        clone.querySelectorAll('.actions, .reportActions, button').forEach(function (node) { node.remove(); });
        return clone.outerHTML;
      }).join('\n');
      const styles = Array.from(document.querySelectorAll('style')).map(function (s) { return s.textContent; }).join('\n');
      const report = '<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + title + '</title><style>' + styles + '\nbody{background:#fff}.wrap{max-width:980px;margin:0 auto;padding:24px 20px}.result,.recommend{display:block!important;margin:0 0 18px}.actions,.reportActions{display:none!important}.tableWrap{overflow:visible}.table{min-width:0!important}@media print{body{background:#fff}.wrap{max-width:none;padding:0}.result,.recommend{border:0;box-shadow:none}.tableWrap{overflow:visible}}</style></head><body><main class="wrap"><div style="margin-bottom:22px"><strong style="font-size:22px;color:#064e3b">TUTORIN</strong><div style="color:#687a72;font-size:12px;margin-top:4px">' + title + '</div><div style="color:#687a72;font-size:11px;margin-top:4px">Laporan dibuat ' + new Date().toLocaleString('id-ID') + '</div></div>' + content + '<div style="margin-top:24px;padding-top:14px;border-top:1px solid #dce9e1;color:#687a72;font-size:11px">Laporan ini berisi hasil analisis berdasarkan jawaban assessment. Bukan prediksi skor SNBT.</div></main></body></html>';
      const blob = new Blob([report], {type:'text/html;charset=utf-8'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    });
  }
  makeReport('download', ['#result', '#recommend'], 'Tutorin-SNBT-Readiness-Check.html', 'SNBT Readiness Check — Laporan Analisis');
})();
