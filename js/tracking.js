// ============================================
// tracking.js — ОТСЛЕЖИВАНИЕ ПРОСМОТРОВ И ДИНАМИЧЕСКИЕ СООБЩЕНИЯ
// Версия: 1.0
// ============================================

// ============================================
// 1. СЧЁТЧИК ПРОСМОТРОВ ОБЪЕКТОВ
// ============================================

/**
 * Получить количество просмотров объекта
 * @param {number} objectId - ID объекта
 * @returns {number} - количество просмотров
 */
function getViewCount(objectId) {
  const key = `view_${objectId}`;
  const views = localStorage.getItem(key);
  return views ? parseInt(views) : 0;
}

/**
 * Увеличить счётчик просмотров объекта
 * @param {number} objectId - ID объекта
 */
function incrementViewCount(objectId) {
  const key = `view_${objectId}`;
  const currentViews = getViewCount(objectId);
  localStorage.setItem(key, currentViews + 1);

  // Для отладки (можно удалить)
  console.log(`👁️ Объект ${objectId} просмотрен ${currentViews + 1} раз`);
}

/**
 * Отобразить счётчики просмотров на карточках
 * (вызывается после загрузки карточек)
 */
function displayViewCounts() {
  document.querySelectorAll('.card').forEach(card => {
    // Получаем ID из ссылки (objects/object1/index.html)
    const href = card.getAttribute('onclick');
    const match = href?.match(/object(\d+)/);
    if (match && match[1]) {
      const objectId = parseInt(match[1]);
      const views = getViewCount(objectId);

      // Добавляем элемент счётчика, если его ещё нет
      if (!card.querySelector('.card-views')) {
        const viewsDiv = document.createElement('div');
        viewsDiv.className = 'card-views';
        viewsDiv.title = 'Количество просмотров';
        viewsDiv.innerHTML = `👁️ ${views}`;
        card.appendChild(viewsDiv);
      } else {
        card.querySelector('.card-views').innerHTML = `👁️ ${views}`;
      }
    }
  });
}

// ============================================
// 2. ДИНАМИЧЕСКИЕ СООБЩЕНИЯ ДЛЯ КОНТАКТОВ
// ============================================

/**
 * Открыть чат Telegram с предзаполненным сообщением
 * @param {string} objectName - Название объекта
 * @param {string} objectId - ID объекта
 * @param {string} action - Действие (забронировать, просмотр, ипотека)
 */
function openTelegramWithObject(objectName, objectId, action) {
  let text = '';

  switch(action) {
    case 'book':
      text = `Здравствуйте! Хочу забронировать ${objectName} (ID: ${objectId})`;
      break;
    case 'viewing':
      text = `Здравствуйте! Хочу записаться на просмотр ${objectName} (ID: ${objectId})`;
      break;
    case 'mortgage':
      text = `Здравствуйте! Интересует ипотека на ${objectName} (ID: ${objectId})`;
      break;
    default:
      text = `Здравствуйте! Интересует объект ${objectName} (ID: ${objectId})`;
  }

  window.open(`https://t.me/NAKalashnikov?text=${encodeURIComponent(text)}`, '_blank');
}

/**
 * Открыть WhatsApp с предзаполненным сообщением
 * @param {string} objectName - Название объекта
 * @param {string} objectId - ID объекта
 * @param {string} action - Действие
 */
function openWhatsAppWithObject(objectName, objectId, action) {
  let text = '';

  switch(action) {
    case 'book':
      text = `Здравствуйте! Хочу забронировать ${objectName} (ID: ${objectId})`;
      break;
    case 'viewing':
      text = `Здравствуйте! Хочу записаться на просмотр ${objectName} (ID: ${objectId})`;
      break;
    case 'mortgage':
      text = `Здравствуйте! Интересует ипотека на ${objectName} (ID: ${objectId})`;
      break;
    default:
      text = `Здравствуйте! Интересует объект ${objectName} (ID: ${objectId})`;
  }

  window.open(`https://wa.me/79130019041?text=${encodeURIComponent(text)}`, '_blank');
}

// ============================================
// 3. ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  // Обновляем счётчики на карточках
  setTimeout(displayViewCounts, 1000); // небольшая задержка для загрузки карточек
});

// Наблюдатель за изменениями в DOM (для динамически добавляемых карточек)
const observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.addedNodes.length) {
      displayViewCounts();
    }
  });
});

// Запускаем наблюдение после загрузки
document.addEventListener('DOMContentLoaded', function() {
  const grid = document.querySelector('.grid');
  if (grid) {
    observer.observe(grid, { childList: true, subtree: true });
  }
});

// ============================================
// 4. ЯВНОЕ ДОБАВЛЕНИЕ ФУНКЦИЙ В ГЛОБАЛЬНУЮ ОБЛАСТЬ
// ============================================

window.openTelegramWithObject = openTelegramWithObject;
window.openWhatsAppWithObject = openWhatsAppWithObject;

console.log('✅ tracking.js загружен. Функции доступны:', {
  telegram: typeof openTelegramWithObject,
  whatsapp: typeof openWhatsAppWithObject
});