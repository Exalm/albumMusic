const STORAGE_TITLE_KEY = 'songsTitles';
const STORAGE_AUTHOR_KEY = 'songsAuthors';

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

    // Обновляем объект сохранённых значений и сохраняем обратно
    const allData = loadFromStorage(storageKey);
    allData[index] = newText;
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
  setTimeout(() => document.addEventListener('click', outsideClickHandler), 0);
}

document.getElementById('changeSongTitleBtn').addEventListener('click', () => {
  const nameDivs = document.querySelectorAll('.music__dsc .name');
  nameDivs.forEach((nameDiv, index) => {
    if (nameDiv.tagName === 'DIV') {
      replaceDivToInput(nameDiv.textContent, nameDiv, STORAGE_TITLE_KEY, index);
    }
  });
});

document.getElementById('changeAuthorNameBtn').addEventListener('click', () => {
  const authorDivs = document.querySelectorAll('.music__dsc .author');
  authorDivs.forEach((authorDiv, index) => {
    if (authorDiv.tagName === 'DIV') {
      replaceDivToInput(authorDiv.textContent, authorDiv, STORAGE_AUTHOR_KEY, index);
    }
  });
});

window.addEventListener('DOMContentLoaded', () => {
  const savedTitles = loadFromStorage(STORAGE_TITLE_KEY);
  const nameDivs = document.querySelectorAll('.music__dsc .name');
  nameDivs.forEach((nameDiv, index) => {
    if (savedTitles && savedTitles[index]) {
      nameDiv.textContent = savedTitles[index];
    }
  });

  const savedAuthors = loadFromStorage(STORAGE_AUTHOR_KEY);
  const authorDivs = document.querySelectorAll('.music__dsc .author');
  authorDivs.forEach((authorDiv, index) => {
    if (savedAuthors && savedAuthors[index]) {
      authorDiv.textContent = savedAuthors[index];
    }
  });
});
