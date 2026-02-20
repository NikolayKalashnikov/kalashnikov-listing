// ============================================
// ui-controller.js — УПРАВЛЕНИЕ ИНТЕРФЕЙСОМ
// Версия: 2.0 (оптимизированная)
// ============================================

// ============================================
// 1. МОДАЛЬНЫЕ ОКНА (ОТКРЫТИЕ/ЗАКРЫТИЕ)
// ============================================

/**
 * Открывает модальное окно по его ID
 * @param {string} modalId - ID модального окна
 */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // запрещаем скролл страницы
  }
}

/**
 * Закрывает модальное окно по его ID
 * @param {string} modalId - ID модального окна
 */
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // возвращаем скролл
  }
}

/**
 * Открывает контактную форму с подстановкой названия и ID объекта
 * @param {string} projectName - Название объекта
 * @param {string} projectId - ID объекта
 */
function openContactForm(projectName, projectId) {
  const nameSpan = document.getElementById('contact-project-name');
  const idSpan = document.getElementById('contact-project-id');
  if (nameSpan) nameSpan.textContent = projectName;
  if (idSpan) idSpan.textContent = 'ID: ' + projectId;
  openModal('modal-contact');
}

// ============================================
// 2. КНОПКА «НАВЕРХ»
// ============================================

/**
 * Плавная прокрутка в начало страницы
 */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Обработчик скролла для показа/скрытия кнопки «Наверх»
 */
function handleScroll() {
  const btn = document.getElementById('scrollTop');
  if (btn) {
    // Для мобильных меньший порог появления
    const threshold = window.innerWidth <= 768 ? 150 : 250;
    if (document.body.scrollTop > threshold || document.documentElement.scrollTop > threshold) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }
}

// ============================================
// 3. ГЛОБАЛЬНЫЕ ОБРАБОТЧИКИ
// ============================================

/**
 * Закрытие модальных окон по клавише Escape
 */
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal.active').forEach(modal => {
      modal.classList.remove('active');
    });
    document.body.style.overflow = '';
  }
});

/**
 * Закрытие модального окна при клике на фон (вне контента)
 */
document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeModal(modal.id);
    }
  });
});

/**
 * Остановка всплытия событий при клике на содержимое модалки
 * (чтобы клик по контенту не закрывал окно)
 */
document.querySelectorAll('.modal-header, .modal-body, .modal-logo').forEach(element => {
  if (element) {
    element.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  }
});

// ============================================
// 4. УДАЛЕНИЕ СТАРЫХ ФИЛЬТРОВ (ВАЖНО!)
// ============================================
// ВНИМАНИЕ: фильтрация полностью вынесена в load-objects.js
// Этот файл больше НЕ ДОЛЖЕН содержать логику фильтрации.
// Старые обработчики удалены, чтобы не конфликтовать с новыми.
//
// Если раньше здесь был код для фильтров, он больше не нужен.
// Вся фильтрация теперь происходит в load-objects.js:
// - фильтры по категориям (кнопки)
// - фильтры по городам (выпадающий список)
// - совместная фильтрация
// - обновление счётчика

// ============================================
// 5. ЗАПУСК ОБРАБОТЧИКОВ ПРИ ЗАГРУЗКЕ
// ============================================

window.addEventListener('scroll', handleScroll);

document.addEventListener('DOMContentLoaded', function() {
  handleScroll(); // проверяем положение скролла при загрузке

  // Можно добавить лог для проверки
  console.log('✅ UI Controller загружен. Фильтрация теперь в load-objects.js');
});

// ============================================
// КОНЕЦ ФАЙЛА
// ============================================