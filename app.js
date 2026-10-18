/* Small local-preview fixes. Original effects are in source/effects.js. */
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('mobileMenuToggle');
  const menu = document.getElementById('mobileMenu');
  if (toggle && menu) {
    toggle.setAttribute('aria-label', 'Открыть меню');
    toggle.setAttribute('aria-controls', 'mobileMenu');
    const syncMenu = () => {
      const open = menu.classList.contains('active');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
      menu.setAttribute('aria-hidden', String(!open));
      menu.inert = !open;
    };
    new MutationObserver(syncMenu).observe(menu, { attributes: true, attributeFilter: ['class'] });
    syncMenu();
  }
  let returnFocus = null;
  document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-bm-modal]');
    if (trigger) returnFocus = trigger;
  }, true);
  document.querySelectorAll('.bm-modal').forEach(modal => {
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    const title = modal.querySelector('h2,h3');
    if (title) {
      title.id = title.id || `${modal.id}-title`;
      modal.setAttribute('aria-labelledby', title.id);
    }
    new MutationObserver(() => {
      if (modal.classList.contains('active')) {
        modal.querySelector('input:not([type="hidden"]), button')?.focus({ preventScroll: true });
      } else if (!document.querySelector('.bm-modal.active')) {
        returnFocus?.focus({ preventScroll: true });
      }
    }).observe(modal, { attributes: true, attributeFilter: ['class'] });
  });
});
