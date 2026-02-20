// ============================================
// load-objects.js — АВТОМАТИЧЕСКАЯ ЗАГРУЗКА КАРТОЧЕК
// Версия: 2.0 (оптимизированная)
// ============================================

// Глобальный массив для хранения данных объектов
let objectsData = [];

// ============================================
// 1. ЗАГРУЗКА ДАННЫХ ИЗ ПАПОК ОБЪЕКТОВ
// ============================================
async function loadAllObjectsData() {
  objectsData = [];
  let objectId = 1;

  // Загружаем объекты последовательно, пока не кончатся
  while (true) {
    try {
      // Пытаемся загрузить data.js для текущего ID
      await loadScript(`objects/object${objectId}/data.js`);

      // Если данные успешно загружены (window.objectData существует)
      if (window.objectData) {
        objectsData.push({ ...window.objectData }); // копируем данные
        delete window.objectData; // очищаем для следующего объекта
        objectId++;
      } else {
        break; // данных нет — выходим
      }
    } catch (e) {
      // Файл не найден — заканчиваем загрузку
      break;
    }
  }

  console.log(`✅ Загружено ${objectsData.length} объектов`);
  return objectsData;
}

// ============================================
// 2. ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ ЗАГРУЗКИ СКРИПТА
// ============================================
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// ============================================
// 3. ОСНОВНАЯ ФУНКЦИЯ ЗАГРУЗКИ КАРТОЧЕК
// ============================================
async function loadObjects() {
  const grid = document.querySelector('.grid');
  const counter = document.querySelector('.counter-number');

  if (!grid) return;

  // Загружаем данные из всех объектов
  await loadAllObjectsData();

  // Очищаем сетку перед созданием новых карточек
  grid.innerHTML = '';

  // Создаём карточки для каждого объекта
  objectsData.forEach(obj => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.category = obj.category;
    card.dataset.city = obj.city; // для фильтрации по городам
    card.setAttribute('onclick', `window.location.href='objects/object${obj.id}/index.html'`);

    // Формируем HTML для бейджа (если есть)
    let badgeHtml = '';
    if (obj.badge) {
      if (obj.badge === 'urgent') {
        badgeHtml = `<div class="card-badge urgent">${obj.badgeText || 'Срочная продажа'}</div>`;
      } else {
        badgeHtml = `<div class="card-badge">${obj.badge}</div>`;
      }
    }

    // Иконка видео (если есть)
    const videoIcon = obj.hasVideo ?
      `<div class="card-video-icon" title="Есть видео-обзор"></div>` : '';

    // Вставляем HTML в карточку
    card.innerHTML = `
      <img src="${obj.image}" alt="${obj.title}" class="card-image" loading="lazy"
        onerror="this.src='https://via.placeholder.com/600x800/cccccc/666666?text=${obj.title.replace(/ /g, '+')}'">
      <div class="card-city">${obj.city}</div>
      ${badgeHtml}
      ${videoIcon}
      <div class="card-content">
        <div class="card-title">${obj.title}</div>
        <div class="card-area">Площадь: ${obj.area}</div>
        <div class="card-price">${obj.price}</div>
        <button class="card-contact-btn"
          onclick="event.stopPropagation(); window.parent.openContactForm('${obj.title}', 'OBJ-00${obj.id}')">Связаться</button>
      </div>
    `;

    grid.appendChild(card);
  });

  // Обновляем счётчик объектов
  if (counter) counter.textContent = objectsData.length;

  // Обновляем счётчик с учётом фильтров (после создания карточек)
  updateFiltersCount();
}

// ============================================
// 4. ОБНОВЛЕНИЕ СЧЁТЧИКА С УЧЁТОМ ФИЛЬТРОВ
// ============================================
function updateFiltersCount() {
  // Определяем активные фильтры
  const activeCategory = document.querySelector('.filter.active')?.dataset.filter || 'all';
  const citySelect = document.getElementById('city-select');
  const activeCity = citySelect ? citySelect.value : 'all';

  const cards = document.querySelectorAll('.card');
  let count = 0;

  cards.forEach(card => {
    const cardCategory = card.dataset.category;
    const cardCity = card.dataset.city;

    const categoryMatch = activeCategory === 'all' || cardCategory === activeCategory;
    const cityMatch = activeCity === 'all' || cardCity === activeCity;

    if (categoryMatch && cityMatch) {
      count++;
    }
  });

  const counter = document.querySelector('.counter-number');
  if (counter) counter.textContent = count;
}

// ============================================
// 5. ФИЛЬТРЫ ПО КАТЕГОРИЯМ (КНОПКИ)
// ============================================
document.querySelectorAll('.filter').forEach(filter => {
  filter.addEventListener('click', function() {
    // Убираем активный класс у всех кнопок категорий
    document.querySelectorAll('.filter').forEach(f => f.classList.remove('active'));
    // Добавляем активный класс текущей кнопке
    this.classList.add('active');

    // Получаем текущий выбранный город из выпадающего списка
    const citySelect = document.getElementById('city-select');
    const activeCity = citySelect ? citySelect.value : 'all';

    // Фильтруем карточки
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      const cardCategory = card.dataset.category;
      const cardCity = card.dataset.city;
      const categoryMatch = this.dataset.filter === 'all' || cardCategory === this.dataset.filter;
      const cityMatch = activeCity === 'all' || cardCity === activeCity;

      if (categoryMatch && cityMatch) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });

    // Обновляем счётчик
    updateFiltersCount();
  });
});

// ============================================
// 6. ФИЛЬТРЫ ПО ГОРОДАМ (ВЫПАДАЮЩИЙ СПИСОК)
// ============================================
const citySelect = document.getElementById('city-select');
if (citySelect) {
  citySelect.addEventListener('change', function() {
    const activeCategory = document.querySelector('.filter.active')?.dataset.filter || 'all';

    // Фильтруем карточки
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      const cardCategory = card.dataset.category;
      const cardCity = card.dataset.city;
      const categoryMatch = activeCategory === 'all' || cardCategory === activeCategory;
      const cityMatch = this.value === 'all' || cardCity === this.value;

      if (categoryMatch && cityMatch) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });

    // Обновляем счётчик
    updateFiltersCount();
  });
}

// ============================================
// 7. ЗАПУСК ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
// ============================================
document.addEventListener('DOMContentLoaded', loadObjects);

// ============================================
// 8. НАБЛЮДАТЕЛЬ ДЛЯ АНИМАЦИИ КАРТОЧЕК (FADE-IN)
// ============================================
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.2 });

// Запускаем наблюдение после загрузки карточек
setTimeout(() => {
  document.querySelectorAll('.card').forEach(card => {
    observer.observe(card);
  });
}, 500);

// ============================================
// ДОБАВЛЕНИЕ СЧЁТЧИКА ПРОСМОТРОВ НА КАРТОЧКИ
// ============================================

// Переопределяем функцию создания карточки, чтобы добавить счётчик
const originalLoadObjects = loadObjects;
loadObjects = async function() {
  await originalLoadObjects();

  // Добавляем счётчики просмотров после загрузки
  if (typeof displayViewCounts === 'function') {
    displayViewCounts();
  }
};