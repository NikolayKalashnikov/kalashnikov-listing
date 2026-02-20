// ============================================
// АВТОМАТИЧЕСКАЯ ЗАГРУЗКА КАРТОЧЕК
// ============================================

// Глобальный массив для хранения данных объектов
let objectsData = [];

// Загрузка данных из всех объектов
async function loadAllObjectsData() {
  objectsData = [];
  let objectId = 1;

  while (true) {
    try {
      await loadScript(`objects/object${objectId}/data.js`);
      if (window.objectData) {
        objectsData.push({ ...window.objectData });
        delete window.objectData;
        objectId++;
      } else {
        break;
      }
    } catch (e) {
      break;
    }
  }

  console.log(`Загружено ${objectsData.length} объектов`);
  return objectsData;
}

// Вспомогательная функция для загрузки скрипта
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Основная функция загрузки карточек
async function loadObjects() {
  const grid = document.querySelector('.grid');
  const counter = document.querySelector('.counter-number');

  if (!grid) return;

  // Загружаем данные
  await loadAllObjectsData();
  grid.innerHTML = '';

  objectsData.forEach(obj => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.category = obj.category;
    card.dataset.city = obj.city;  // ← ДОБАВЛЕНО для фильтрации по городам
    card.setAttribute('onclick', `window.location.href='objects/object${obj.id}/index.html'`);

    let badgeHtml = '';
    if (obj.badge) {
      if (obj.badge === 'urgent') {
        badgeHtml = `<div class="card-badge urgent">${obj.badgeText || 'Срочная продажа'}</div>`;
      } else {
        badgeHtml = `<div class="card-badge">${obj.badge}</div>`;
      }
    }

    const videoIcon = obj.hasVideo ?
      `<div class="card-video-icon" title="Есть видео-обзор"></div>` : '';

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

  if (counter) counter.textContent = objectsData.length;
  updateFiltersCount();
}

// Обновление счетчика с учетом фильтров
function updateFiltersCount() {
  const activeCategory = document.querySelector('.filter.active')?.dataset.filter || 'all';
  const activeCity = document.querySelector('.city-filter.active')?.dataset.city || 'all';

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

// Фильтры по категориям
document.querySelectorAll('.filter').forEach(filter => {
  filter.addEventListener('click', function () {
    document.querySelectorAll('.filter').forEach(f => f.classList.remove('active'));
    this.classList.add('active');

    // Фильтруем карточки
    const cards = document.querySelectorAll('.card');
    const activeCity = document.querySelector('.city-filter.active')?.dataset.city || 'all';

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

    updateFiltersCount();
  });
});

// Фильтры по городам
document.querySelectorAll('.city-filter').forEach(filter => {
  filter.addEventListener('click', function () {
    document.querySelectorAll('.city-filter').forEach(f => f.classList.remove('active'));
    this.classList.add('active');

    // Фильтруем карточки
    const cards = document.querySelectorAll('.card');
    const activeCategory = document.querySelector('.filter.active')?.dataset.filter || 'all';

    cards.forEach(card => {
      const cardCategory = card.dataset.category;
      const cardCity = card.dataset.city;
      const categoryMatch = activeCategory === 'all' || cardCategory === activeCategory;
      const cityMatch = this.dataset.city === 'all' || cardCity === this.dataset.city;

      if (categoryMatch && cityMatch) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });

    updateFiltersCount();
  });
});

// Запуск
document.addEventListener('DOMContentLoaded', loadObjects);

// Наблюдатель за появлением карточек
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.2 });

// После загрузки карточек
setTimeout(() => {
  document.querySelectorAll('.card').forEach(card => {
    observer.observe(card);
  });
}, 500);