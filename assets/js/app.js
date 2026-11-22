(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const mobileMenu = $('.mobile-menu');
  const menuToggle = $('.menu-toggle');
  const closeMenu = () => { mobileMenu?.classList.remove('open'); document.body.classList.remove('menu-open'); menuToggle?.setAttribute('aria-expanded','false'); };
  menuToggle?.addEventListener('click', () => { mobileMenu?.classList.add('open'); document.body.classList.add('menu-open'); menuToggle.setAttribute('aria-expanded','true'); });
  $$('.mobile-close,.mobile-overlay').forEach(el => el.addEventListener('click', closeMenu));
  $$('.mobile-nav a').forEach(a => a.addEventListener('click', closeMenu));
  $$('.mobile-sub-toggle').forEach(btn => btn.addEventListener('click', () => { const sub = btn.nextElementSibling; sub?.classList.toggle('open'); btn.setAttribute('aria-expanded', sub?.classList.contains('open') ? 'true' : 'false'); }));

  // Mega menu remains open while the pointer moves from trigger to panel.
  $$('.nav-item.has-mega').forEach(item => {
    let timer;
    item.addEventListener('mouseenter', () => { clearTimeout(timer); item.classList.add('open'); });
    item.addEventListener('mouseleave', () => { timer = setTimeout(() => item.classList.remove('open'), 170); });
    item.addEventListener('focusin', () => { clearTimeout(timer); item.classList.add('open'); });
    item.addEventListener('focusout', e => { if (!item.contains(e.relatedTarget)) item.classList.remove('open'); });
  });

  $$('.faq-question').forEach(btn => btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item'); const answer = $('.faq-answer', item); const isOpen = item.classList.contains('open');
    $$('.faq-item.open').forEach(openItem => { openItem.classList.remove('open'); const a = $('.faq-answer', openItem); if (a) a.style.maxHeight = null; });
    if (!isOpen) { item.classList.add('open'); answer.style.maxHeight = answer.scrollHeight + 'px'; }
  }));

  const toast = $('.toast'); let toastTimer;
  const showToast = message => { if (!toast) return; toast.textContent = message; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 3600); };
  const trackingForm = $('.tracking-form');
  trackingForm?.addEventListener('submit', e => {
    e.preventDefault(); const value = ($('input', trackingForm)?.value || '').trim().toUpperCase(); const result = $('.tracking-result');
    if (!value) { showToast('لطفاً کد رهگیری را وارد کنید.'); return; }
    result?.classList.add('show');
    if (result) result.innerHTML = value === 'RH-2048' ? '<strong>محموله RH-2048 در مسیر تحویل است.</strong><br><span>آخرین به‌روزرسانی: امروز، ساعت ۱۰:۳۰ · مرکز توزیع اصفهان</span>' : '<strong>سامانه رهگیری نمایشی است.</strong><br><span>برای مشاهده نمونه وضعیت، کد RH-2048 را وارد کنید.</span>';
  });

  $$('form[data-demo-form]').forEach(form => form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const msg = $('.form-message', form); if (msg) { msg.classList.add('show'); msg.textContent = 'درخواست شما در نسخه نمایشی ثبت نمایشی شد؛ برای دریافت واقعی اطلاعات، فرم باید به سامانه شرکت متصل شود.'; }
    form.reset();
  }));

  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), {threshold:.12});
  $$('.reveal').forEach(el => observer.observe(el));

  const backTop = $('.back-top');
  window.addEventListener('scroll', () => { backTop?.classList.toggle('show', window.scrollY > 500); }, {passive:true});
  backTop?.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));

  const current = location.pathname.split('/').pop() || 'index.html';
  $$('.desktop-nav a[data-page],.mobile-nav a[data-page]').forEach(a => { if (a.dataset.page === current) a.classList.add('active'); });
})();
