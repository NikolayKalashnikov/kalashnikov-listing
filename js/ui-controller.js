// ============================================
// UI CONTROLLER - модалки, фильтры, скролл
// ============================================

// Модальные окна
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

function openContactForm(projectName, projectId) {
  const nameSpan = document.getElementById('contact-project-name');
  const idSpan = document.getElementById('contact-project-id');
  if (nameSpan) nameSpan.textContent = projectName;
  if (idSpan) idSpan.textContent = 'ID: ' + projectId;
  openModal('modal-contact');
}

// Скролл
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

// Останавливаем всплытие
document.querySelectorAll('.modal-header, .modal-body, .modal-logo').forEach(function (element) {
  if (element) {
    element.addEventListener('click', function (e) {
      e.stopPropagation();
    });
  }
});

// Фильтры
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
    if (counter) counter.textContent = count;
  });
});

// Скролл
window.addEventListener('scroll', handleScroll);
document.addEventListener('DOMContentLoaded', handleScroll);
