const STORAGE_TITLE_KEY = 'songsTitles';
const STORAGE_AUTHOR_KEY = 'songsAuthors';

let firstClick = true;

// Восстановление песен из localStorage при загрузке страницы
window.addEventListener('DOMContentLoaded', () => {
  const musicBox = document.querySelector('.music__box');
  musicBox.innerHTML = ''; // Очищаем перед загрузкой

  const savedSongs = JSON.parse(localStorage.getItem('savedSongs') || '[]');

  savedSongs.forEach(({ author, songName, duration }) => {
    const songElement = createSongElement(author, songName, duration);
    musicBox.appendChild(songElement);
  });

  // Восстановление изменённых названий и авторов
  const savedTitles = loadFromStorage(STORAGE_TITLE_KEY);
  const savedAuthors = loadFromStorage(STORAGE_AUTHOR_KEY);

  const nameDivs = document.querySelectorAll('.music__dsc .name');
  nameDivs.forEach((nameDiv, index) => {
    if (savedTitles && savedTitles[index]) {
      nameDiv.textContent = savedTitles[index];
    }
  });

  const authorDivs = document.querySelectorAll('.music__dsc .author');
  authorDivs.forEach((authorDiv, index) => {
    if (savedAuthors && savedAuthors[index]) {
      authorDiv.textContent = savedAuthors[index];
    }
  });
});

// Создание DOM-элемента песни с привязкой анимации
function createSongElement(author, songName, duration) {
  const newSong = document.createElement('div');
  newSong.className = 'music__container';
  newSong.innerHTML = `
    <div class="left">
      <div class="openAdminModal player">&#9658;</div>
      <div class="music__dsc">
        <div class="name">${songName}</div>
        <div class="author">${author}</div>
      </div>
    </div>
    <div class="music__add right">
      <div class="dwn" title="Скачать" style="cursor:pointer;">
        <?xml version="1.0" ?>
        <svg fill="#000000" width="24px" height="24px" viewBox="0 0 512 512"
             data-name="Layer 1" id="Layer_1" xmlns="http://www.w3.org/2000/svg">
          <path d="M256,409.7,152.05,305.75,173.5,284.3l67.33,67.32V34h30.34V351.62L338.5,
                   284.3,360,305.75ZM445.92,351v93.22a3.61,3.61,0,0,1-3.47,3.48H69.15a3.3,
                   3.3,0,0,1-3.07-3.48V351H35.74v93.22A33.66,33.66,0,0,0,69.15,478h373.3a33.85,
                   33.85,0,0,0,33.81-33.82V351Z"/>
        </svg>
      </div>
      <div class="time">${duration}</div>
    </div>
  `;

  const downloadButton = newSong.querySelector('.dwn');
  if (downloadButton) attachDownloadAnimation(downloadButton);

  return newSong;
}

// Анимация кнопки скачивания
function attachDownloadAnimation(button) {
  button.style.cursor = 'pointer';
  button.addEventListener('click', () => {
    button.style.transition = 'opacity 0.5s ease';
    button.style.opacity = '0';

    setTimeout(() => {
      button.innerHTML = '<img src="./images/download_animation.gif" alt="loading animation" style="width:24px; height:24px;">';
      button.style.opacity = '1';

      setTimeout(() => {
        button.style.opacity = '0';
        setTimeout(() => {
          button.innerHTML = `
            <svg fill="#000000" width="24px" height="24px" viewBox="0 0 512 512"
                 data-name="Layer 1" id="Layer_1" xmlns="http://www.w3.org/2000/svg">
             <path d="M256,409.7,152.05,305.75,173.5,284.3l67.33,67.32V34h30.34V351.62L338.5,
               284.3,360,305.75ZM445.92,351v93.22a3.61,3.61,0,0,1-3.47,3.48H69.15a3.3,
               3.3,0,0,1-3.07-3.48V351H35.74v93.22A33.66,33.66,0,0,0,69.15,478h373.3a33.85,
               33.85,0,0,0,33.81-33.82V351Z"/>
           </svg>`;
          button.style.opacity = '1';
        }, 500);
      }, 3000);
    }, 500);
  });
}

// Добавление новой песни
document.getElementById('addSongBtn').addEventListener('click', () => {
  const addSongMenu = document.getElementById('addSongMenu');
  if (!addSongMenu || addSongMenu.style.display === 'none' || getComputedStyle(addSongMenu).display === 'none') return;

  const author = document.getElementById('authorInput').value.trim();
  const songName = document.getElementById('songNameInput').value.trim();
  const duration = document.getElementById('durationInput').value.trim();

  if (!author) {
    alert('Пожалуйста, введите имя автора');
    return;
  }
  if (!songName) {
    alert('Пожалуйста, введите название песни');
    return;
  }
  if (!duration) {
    alert('Пожалуйста, введите продолжительность трека');
    return;
  }
  if (!/^[0-9]+:[0-5][0-9]$/.test(duration)) {
    alert('Введите время трека в формате минуты:секунды (например, 2:16)');
    return;
  }

  const newSong = createSongElement(author, songName, duration);
  const musicBox = document.querySelector('.music__box');
  if (!musicBox) {
    alert('Контейнер с песнями не найден');
    return;
  }
  musicBox.appendChild(newSong);
  saveSongsToLocalStorage();

  document.getElementById('authorInput').value = '';
  document.getElementById('songNameInput').value = '';
  document.getElementById('durationInput').value = '';
});

// Удаление последнего трека с ограничением — нельзя удалить если осталась одна песня
document.getElementById('deleteLastSongBtn').addEventListener('click', () => {
  const musicBox = document.querySelector('.music__box');
  if (!musicBox) return;

  const songs = musicBox.querySelectorAll('.music__container');
  if (songs.length <= 1) {
    alert('Удаление невозможно: осталась всего одна песня.');
    return;
  }

  songs[songs.length - 1].remove();
  saveSongsToLocalStorage();
});

// Сохранение списка песен в localStorage и отдельно названий и авторов для редактирования
function saveSongsToLocalStorage() {
  const musicBox = document.querySelector('.music__box');
  const songs = musicBox.querySelectorAll('.music__container');

  const songsArray = Array.from(songs).map(song => ({
    author: song.querySelector('.author')?.textContent || '',
    songName: song.querySelector('.name')?.textContent || '',
    duration: song.querySelector('.time')?.textContent || ''
  }));

  localStorage.setItem('savedSongs', JSON.stringify(songsArray));
  localStorage.setItem(STORAGE_TITLE_KEY, JSON.stringify(songsArray.map(s => s.songName)));
  localStorage.setItem(STORAGE_AUTHOR_KEY, JSON.stringify(songsArray.map(s => s.author)));
}

// Делегирование клика для открытия админ-модального окна
document.querySelector('.music__box').addEventListener('click', event => {
  const target = event.target;
  if (target.closest('.openAdminModal')) {
    const adminModal = document.getElementById('adminModal');
    if (adminModal) {
      adminModal.style.display = 'block';
    }
  }
});

// Закрытие админ-модального окна
document.getElementById('closeAdminModal').addEventListener('click', () => {
  const adminModal = document.getElementById('adminModal');
  if (adminModal) {
    adminModal.style.display = 'none';
  }
});

// Дополнительные функции для редактирования названия и автора с сохранением
function saveToStorage(key, obj) {
  localStorage.setItem(key, JSON.stringify(obj));
}

function loadFromStorage(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : {};
}

function replaceDivToInput(originalText, nameDiv, storageKey, index) {
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'song-title-input';
  input.value = originalText;

  nameDiv.replaceWith(input);
  input.focus();

  function saveAndClose() {
    const newText = input.value.trim() || originalText;
    const newDiv = document.createElement('div');
    newDiv.className = nameDiv.className;
    newDiv.textContent = newText;

    input.replaceWith(newDiv);

    // Загружаем весь объект из localStorage
    const allData = loadFromStorage(storageKey);
    allData[index] = newText; // сохраняем по индексу песни
    saveToStorage(storageKey, allData);

    input.removeEventListener('keydown', keyHandler);
    document.removeEventListener('click', outsideClickHandler);
  }

  function keyHandler(e) {
    if (e.key === 'Enter') {
      saveAndClose();
    } else if (e.key === 'Escape') {
      input.value = originalText;
      saveAndClose();
    }
  }

  function outsideClickHandler(e) {
    const adminModal = document.getElementById('adminModal');
    if (e.target !== input && !adminModal.contains(e.target)) {
      saveAndClose();
    }
  }

  input.addEventListener('keydown', keyHandler);
  setTimeout(() => {
    document.addEventListener('click', outsideClickHandler);
  }, 0);
}

// Изменение названия песен
document.getElementById('changeSongTitleBtn').addEventListener('click', () => {
  const nameDivs = document.querySelectorAll('.music__dsc .name');
  nameDivs.forEach((nameDiv, index) => {
    if (nameDiv.tagName === 'DIV') {
      replaceDivToInput(nameDiv.textContent, nameDiv, STORAGE_TITLE_KEY, index);
    }
  });
});

// Изменение имени автора
document.getElementById('changeAuthorNameBtn').addEventListener('click', () => {
  const authorDivs = document.querySelectorAll('.music__dsc .author');
  authorDivs.forEach((authorDiv, index) => {
    if (authorDiv.tagName === 'DIV') {
      replaceDivToInput(authorDiv.textContent, authorDiv, STORAGE_AUTHOR_KEY, index);
    }
  });
});
