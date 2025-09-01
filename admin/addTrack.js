const CURRENT_STORAGE_VERSION = '1';

// Очистка localStorage при изменении версии
const savedVersion = localStorage.getItem('storage_version');
if (savedVersion !== CURRENT_STORAGE_VERSION) {
  console.log('Версия изменена, localStorage очищен');
  localStorage.clear();
  localStorage.setItem('storage_version', CURRENT_STORAGE_VERSION);
}

const musicBox = document.querySelector('.music__box');
const adminModal = document.getElementById('adminModal');
const closeBtn = document.getElementById('closeAdminModal');

// Создание элемента трека с иконкой
function createSongElement(song) {
  const div = document.createElement('div');
  div.className = 'music__container';
  div.innerHTML = `
    <div class="left">
      <div class="openAdminModal player" tabindex="0">&#9658;</div>
      <div class="music__dsc">
        <div class="name">${song.name}</div>
        <div class="author">${song.author}</div>
      </div>
    </div>
    <div class="music__add right">
      <div class="time">${song.time}</div>
      <div class="dwn" style="cursor:pointer;">
        <svg fill="#757f8fff" width="28px" height="28px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M256,409.7,152.05,305.75,173.5,284.3l67.33,67.32V34h30.34V351.62L338.5,284.3,360,305.75ZM445.92,351v93.22a3.61,3.61,0,0,1-3.47,3.48H69.15a3.3,3.3,0,0,1-3.07-3.48V351H35.74v93.22A33.66,33.66,0,0,0,69.15,478h373.3a33.85,33.85,0,0,0,33.81-33.82V351Z"
            stroke="#757f8fff"
            stroke-width="45"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>
  `;
  return div;
}

// Сохраняем песни
function saveSongs() {
  const songs = [];
  musicBox.querySelectorAll('.music__container').forEach(container => {
    const name = container.querySelector('.name').textContent.trim();
    const author = container.querySelector('.author').textContent.trim();
    const time = container.querySelector('.time').textContent.trim();
    songs.push({ name, author, time });
  });
  localStorage.setItem('songs', JSON.stringify(songs));
  console.log('Сохранено в localStorage:', songs);
}

// Загружаем песни
function loadSongs() {
  musicBox.innerHTML = '';
  const saved = localStorage.getItem('songs');
  if (saved) {
    try {
      const songs = JSON.parse(saved);
      songs.forEach(song => {
        const el = createSongElement(song);
        musicBox.appendChild(el);
      });
      console.log('Загружено из localStorage:', songs);
    } catch (e) {
      console.error('Ошибка при загрузке треков:', e);
    }
  }
}

// Изменяем fill и stroke у всех svg path
function changeAllSvgColors(color) {
  document.querySelectorAll('svg path').forEach(path => {
    path.setAttribute('fill', color);
    path.setAttribute('stroke', color);
  });
}

// SHOW/HIDE меню выбора цвета иконки
document.getElementById('ChangeColorIcon').addEventListener('click', () => {
  const menu = document.getElementById('IconColorMenu');
  menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
});

// Применение выбранного цвета
document.getElementById('applyColorIcon').addEventListener('click', () => {
  const colorInput = document.getElementById('ColorIcon');
  const color = colorInput.value;

  changeAllSvgColors(color);
  localStorage.setItem('iconColor', color);
  document.getElementById('IconColorMenu').style.display = 'none';
});

// Восстановление цвета при загрузке
window.addEventListener('DOMContentLoaded', () => {
  const savedColor = localStorage.getItem('iconColor');
  if (savedColor) {
    document.getElementById('ColorIcon').value = savedColor;
    changeAllSvgColors(savedColor);
  }
});

// Добавление новой песни
document.getElementById('addBtn').addEventListener('click', () => {
  const newSong = {
    name: 'Нежно к себе',
    author: 'Артур Гончаров',
    time: '3:21'
  };
  const newSongEl = createSongElement(newSong);
  musicBox.appendChild(newSongEl);
  saveSongs();
});

// Удаление последней песни
document.getElementById('DeleteBtn').addEventListener('click', () => {
  const lastSong = musicBox.lastElementChild;
  if (lastSong && lastSong.classList.contains('music__container')) {
    musicBox.removeChild(lastSong);
    saveSongs();
  }
});

// Делегирование кликов для открытия админки и анимации скачивания
musicBox.addEventListener('click', (e) => {
  if (e.target.classList.contains('openAdminModal') && e.target.classList.contains('player')) {
    openAdminPanel();
  } else if (e.target.closest('.dwn')) {
    const button = e.target.closest('.dwn');
    button.style.transition = 'opacity 0.5s ease';
    button.style.opacity = '0';

    setTimeout(() => {
      button.innerHTML = '<img src="./images/download_animation.gif" alt="loading animation" style="width:28px; height:28px;">';
      button.style.opacity = '1';

      setTimeout(() => {
        button.style.opacity = '0';
        setTimeout(() => {
          button.innerHTML = `
            <svg fill="#757f8fff" width="28px" height="28px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M256,409.7,152.05,305.75,173.5,284.3l67.33,67.32V34h30.34V351.62L338.5,284.3,360,305.75ZM445.92,351v93.22a3.61,3.61,0,0,1-3.47,3.48H69.15a3.3,3.3,0,0,1-3.07-3.48V351H35.74v93.22A33.66,33.66,0,0,0,69.15,478h373.3a33.85,33.85,0,0,0,33.81-33.82V351Z"
                stroke="#757f8fff"
                stroke-width="45"
                stroke-linejoin="round"
              />
            </svg>
          `;
          button.style.opacity = '1';
        }, 500);
      }, 3000);
    }, 500);
  }
});

// Клавиатурное открытие админки
musicBox.addEventListener('keydown', (e) => {
  if ((e.key === 'Enter' || e.key === ' ') &&
      e.target.classList.contains('openAdminModal') &&
      e.target.classList.contains('player')) {
    e.preventDefault();
    openAdminPanel();
  }
});

// Открытие и закрытие админки
function openAdminPanel() {
  adminModal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  adminModal.setAttribute('tabindex', '-1');
  adminModal.focus();
}

function closeAdminPanel() {
  adminModal.style.display = 'none';
  document.body.style.overflow = '';
  adminModal.removeAttribute('tabindex');
}

closeBtn.addEventListener('click', closeAdminPanel);

adminModal.addEventListener('click', (e) => {
  if (e.target === adminModal) closeAdminPanel();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && adminModal.style.display === 'flex') closeAdminPanel();
});

// Загрузка песен при старте
loadSongs();
