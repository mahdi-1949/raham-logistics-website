(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];

  // Mobile navigation: focus, Escape, scroll lock and submenu state.
  const mobileMenu = $('.mobile-menu');
  const menuToggle = $('.menu-toggle');
  const mobileDrawer = $('.mobile-drawer');
  const closeButton = $('.mobile-close');
  let previousFocus = null;
  const closeMenu = () => {
    if (!mobileMenu?.classList.contains('open')) return;
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden','true');
    document.body.classList.remove('menu-open');
    menuToggle?.setAttribute('aria-expanded','false');
    (previousFocus || menuToggle)?.focus({preventScroll:true});
  };
  const openMenu = () => {
    if (!mobileMenu) return;
    previousFocus = document.activeElement;
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden','false');
    document.body.classList.add('menu-open');
    menuToggle?.setAttribute('aria-expanded','true');
    closeButton?.focus({preventScroll:true});
  };
  menuToggle?.addEventListener('click', () => mobileMenu?.classList.contains('open') ? closeMenu() : openMenu());
  $$('.mobile-close,.mobile-overlay').forEach(el => el.addEventListener('click', closeMenu));
  $$('.mobile-menu a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeMenu();
      $$('.nav-item.has-mega.open').forEach(el => el.classList.remove('open'));
    }
    if (e.key === 'Tab' && mobileMenu?.classList.contains('open') && mobileDrawer) {
      const focusable = $$('a[href],button:not([disabled])', mobileDrawer).filter(el => el.getClientRects().length);
      if (!focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  window.matchMedia('(min-width: 1101px)').addEventListener('change', e => { if (e.matches) closeMenu(); });
  $$('.mobile-sub-toggle').forEach(btn => btn.addEventListener('click', () => {
    const sub = document.getElementById(btn.getAttribute('aria-controls'));
    const willOpen = btn.getAttribute('aria-expanded') !== 'true';
    btn.setAttribute('aria-expanded', String(willOpen));
    sub?.classList.toggle('open', willOpen);
  }));

  // Full-width mega menu: preserve hover while traversing from trigger to panel.
  $$('.nav-item.has-mega').forEach(item => {
    let timer;
    item.addEventListener('mouseenter', () => { clearTimeout(timer); item.classList.add('open'); });
    item.addEventListener('mouseleave', () => { timer = setTimeout(() => item.classList.remove('open'), 240); });
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

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), {threshold:.12});
    $$('.reveal').forEach(el => observer.observe(el));
  } else $$('.reveal').forEach(el => el.classList.add('visible'));

  const backTop = $('.back-top');
  window.addEventListener('scroll', () => { backTop?.classList.toggle('show', window.scrollY > 500); }, {passive:true});
  backTop?.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));

  const current = location.pathname.split('/').pop() || 'index.html';
  $$('.desktop-nav a[data-page],.mobile-nav a[data-page]').forEach(a => { if (a.dataset.page === current) a.classList.add('active'); });
  if (current === 'services.html') $('.mobile-sub-toggle')?.classList.add('active');
})();
