(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('#mobile-nav');
  const inquiryDialog = document.querySelector('#inquiry-dialog');
  const projectDialog = document.querySelector('#project-dialog');
  const form = document.querySelector('#inquiry-form');
  const status = document.querySelector('.form-status');
  let inquirySubject = 'Рассчитать проект';
  let selectedProject = '';

  function closeMenu() {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Открыть меню');
    mobileNav.hidden = true;
  }

  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    mobileNav.hidden = !open;
  });
  mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !mobileNav.hidden) {
      closeMenu();
      menuButton.focus();
    }
  });
  const desktop = window.matchMedia('(min-width: 701px)');
  desktop.addEventListener('change', event => { if (event.matches) closeMenu(); });

  function syncScrollLock() {
    document.body.classList.toggle('modal-open', Boolean(document.querySelector('dialog[open]')));
  }
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', syncScrollLock);
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    });
  });

  document.querySelectorAll('[data-inquiry]').forEach(button => {
    button.addEventListener('click', () => {
      inquirySubject = button.dataset.inquiry;
      selectedProject = projectDialog.open ? document.querySelector('#project-dialog-title').textContent : '';
      if (projectDialog.open) projectDialog.close();
      closeMenu();
      status.textContent = '';
      document.querySelector('#inquiry-title').innerHTML = inquirySubject === 'Заказать звонок' ? 'Давайте<br>созвонимся.' : 'Расскажите<br>о вашей идее.';
      inquiryDialog.showModal();
      syncScrollLock();
    });
  });

  document.querySelectorAll('[data-project]').forEach(button => {
    button.addEventListener('click', () => {
      const image = document.querySelector('#project-dialog-image');
      image.src = button.dataset.image;
      image.alt = button.querySelector('img').alt;
      document.querySelector('#project-dialog-title').textContent = button.dataset.project;
      document.querySelector('#project-dialog-description').textContent = button.dataset.description;
      projectDialog.showModal();
      syncScrollLock();
    });
  });

  const filters = document.querySelectorAll('[data-filter]');
  filters.forEach(button => button.addEventListener('click', () => {
    const category = button.dataset.filter;
    filters.forEach(filter => {
      const active = filter === button;
      filter.classList.toggle('active', active);
      filter.setAttribute('aria-pressed', String(active));
    });
    document.querySelector('.project-grid').classList.toggle('is-filtered', category !== 'all');
    let count = 0;
    document.querySelectorAll('[data-project]').forEach(project => {
      project.hidden = category !== 'all' && project.dataset.category !== category;
      if (!project.hidden) count++;
    });
    document.querySelector('#filter-status').textContent = `Показано проектов: ${count}`;
  }));

  form.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(form);
    const body = [
      `Имя: ${data.get('name').trim()}`,
      `Телефон: ${data.get('phone').trim()}`,
      `Задача: ${data.get('product')}`,
      selectedProject ? `Понравился проект: ${selectedProject}` : '',
      '', data.get('message').trim()
    ].filter(line => line !== '').join('\r\n');
    const mail = document.createElement('a');
    mail.href = `mailto:mail@printanit.ru?subject=${encodeURIComponent(inquirySubject + ' — Принтанит Outdoor')}&body=${encodeURIComponent(body)}`;
    mail.click();
    status.textContent = 'Заявка подготовлена. Отправьте письмо в почтовой программе. Если она не открылась, напишите на mail@printanit.ru или позвоните нам.';
  });
})();
