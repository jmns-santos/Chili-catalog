/* CATÁLOGO CHILI · proteção contra a página ser embutida noutro site (clickjacking).
   No endereço público (github.io), se a página estiver dentro de uma moldura de outro site,
   não arranca e mostra só uma ligação para abrir o catálogo diretamente. */
(function () {
  'use strict';
  var embutido = false;
  try { embutido = window.top !== window.self; } catch (e) { embutido = true; }
  if (!embutido || !/(^|\.)github\.io$/.test(location.hostname)) return;
  window.CC_EMBUTIDO = true;
  document.documentElement.style.visibility = 'hidden';
  document.addEventListener('DOMContentLoaded', function () {
    var a = document.createElement('a');
    a.href = location.href; a.target = '_top'; a.rel = 'noopener noreferrer';
    a.textContent = 'Abrir o CATÁLOGO CHILI';
    document.body.textContent = '';
    document.body.appendChild(a);
    document.documentElement.style.visibility = 'visible';
  });
})();
