// دليلك الصحي | تطوير: Eslam Amin
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const KEY = 'lastDisease';
  const home = $('home'), dis = $('disease'), list = $('list');
  let current = null;

  // تفضيل بسيط: آخر مرض تم فتحه
  const store = {
    get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } },
    set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  };
  // تطبيع النص العربي للبحث (يتجاهل التشكيل والهمزات)
  const norm = s => s.toLowerCase().replace(/[\u064B-\u065F\u0640]/g, '')
    .replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه');

  // بطاقات الصفحة الرئيسية
  DATA.forEach(d => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'card'; b.style.setProperty('--c', 'var(--' + d.id + ')');
    b.innerHTML = '<b>' + d.name + '</b><small>' + d.en + '</small><span>' + d.blurb + '</span>';
    b.addEventListener('click', () => open(d.id));
    $('cards').appendChild(b);
  });

  function open(id) {
    current = DATA.find(d => d.id === id); if (!current) return;
    store.set(id);
    document.documentElement.style.setProperty('--accent', 'var(--' + id + ')');
    $('dName').textContent = current.name; $('q').value = '';
    render(''); home.hidden = true; dis.hidden = false;
    document.title = current.name + ' | دليلك الصحي'; window.scrollTo(0, 0);
  }
  function back() {
    dis.hidden = true; home.hidden = false; document.title = 'دليلك الصحي: السكري والضغط';
    document.documentElement.style.setProperty('--accent', 'var(--dm)');
  }
  // رسم قائمة Accordion
  function render(term) {
    const t = norm(term.trim()); list.textContent = '';
    const rows = current.faqs.filter(f => !t || norm(f[0] + ' ' + f[1]).includes(t));
    rows.forEach((f, i) => {
      const w = document.createElement('div'); w.className = 'item';
      const b = document.createElement('button'); b.type = 'button';
      b.setAttribute('aria-expanded', 'false'); b.textContent = f[0];
      const p = document.createElement('p'); p.className = 'ans'; p.hidden = true; p.textContent = f[1];
      b.id = 'q' + i; p.setAttribute('role', 'region'); p.setAttribute('aria-labelledby', b.id);
      b.addEventListener('click', () => {
        const o = b.getAttribute('aria-expanded') === 'true';
        b.setAttribute('aria-expanded', String(!o)); p.hidden = o;
      });
      w.append(b, p); list.appendChild(w);
    });
    $('count').textContent = rows.length + ' من ' + current.faqs.length + ' سؤالًا';
    $('empty').hidden = rows.length > 0;
  }
  $('q').addEventListener('input', e => render(e.target.value));
  $('backBtn').addEventListener('click', back);

  // التثبيت
  let deferred = null;
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferred = e; $('installBtn').hidden = false; });
  $('installBtn').addEventListener('click', async () => {
    if (!deferred) return; deferred.prompt(); await deferred.userChoice; deferred = null; $('installBtn').hidden = true;
  });
  window.addEventListener('appinstalled', () => { $('installBtn').hidden = true; });
  $('helpBtn').addEventListener('click', () => $('dlg').showModal());
  $('closeDlg').addEventListener('click', () => $('dlg').close());

  const last = store.get(); if (last) open(last);

  if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(() => {});
})();
