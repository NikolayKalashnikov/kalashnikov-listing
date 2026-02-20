// ============================================
// ОСНОВНЫЕ ФУНКЦИИ (модалки, фильтры, скролл)
// ============================================

function openContactForm(projectName, projectId) {
  const nameSpan = document.getElementById('contact-project-name');
  const idSpan = document.getElementById('contact-project-id');
  if (nameSpan) nameSpan.textContent = projectName;
  if (idSpan) idSpan.textContent = 'ID: ' + projectId;
  openModal('modal-contact');
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleScroll() {
  const btn = document.getElementById('scrollTop');
  if (btn) {
    const threshold = window.innerWidth <= 768 ? 150 : 250;
    if (document.body.scrollTop > threshold || document.documentElement.scrollTop > threshold) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }
}

// Закрытие по Escape
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal.active').forEach(function (modal) {
      modal.classList.remove('active');
    });
    document.body.style.overflow = '';
  }
});

// Закрытие по клику на фон
document.querySelectorAll('.modal').forEach(function (modal) {
  modal.addEventListener('click', function (e) {
    if (e.target === modal) {
      closeModal(modal.id);
    }
  });
});

// Останавливаем всплытие клика внутри контента
document.querySelectorAll('.modal-header, .modal-body, .modal-logo').forEach(function (element) {
  if (element) {
    element.addEventListener('click', function (e) {
      e.stopPropagation();
    });
  }
});

// Фильтрация объектов
document.querySelectorAll('.filter').forEach(function (filter) {
  filter.addEventListener('click', function () {
    document.querySelectorAll('.filter').forEach(function (f) {
      f.classList.remove('active');
    });
    this.classList.add('active');

    const value = this.dataset.filter;
    const cards = document.querySelectorAll('.card');
    let count = 0;

    cards.forEach(function (card) {
      const cardCategory = card.dataset.category;

      if (value === 'all' || cardCategory === value) {
        card.classList.remove('hidden');
        count++;
      } else {
        card.classList.add('hidden');
      }
    });

    const counter = document.querySelector('.counter-number');
    if (counter) {
      counter.textContent = count;
    }
  });
});

// Обработчик скролла
window.addEventListener('scroll', handleScroll);

// Первоначальная настройка
document.addEventListener('DOMContentLoaded', function () {
  handleScroll();
});

// Переключение темы
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const button = document.getElementById('themeToggle');

  if (currentTheme === 'dark') {
    document.documentElement.removeAttribute('data-theme');
    button.textContent = '🌙';
    localStorage.setItem('theme', 'light');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    button.textContent = '☀️';
    localStorage.setItem('theme', 'dark');
  }
}

// Загрузка сохранённой темы при старте
(function () {
  const savedTheme = localStorage.getItem('theme');
  const button = document.getElementById('themeToggle');

  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (button) button.textContent = '☀️';
  } else {
    if (button) button.textContent = '🌙';
  }
})();
