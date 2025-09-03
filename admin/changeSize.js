// Получаем элементы управления
const fontSizeRange = document.getElementById('fontSizeRange');
const fontSizeValue = document.getElementById('fontSizeValue');
const applyFontSizeBtn = document.getElementById('applyFontSizeBtn');
const fontSizeAuthorRange = document.getElementById('fontSizeAuthorRange');
const fontSizeAuthorValue = document.getElementById('fontSizeAuthorValue');

// Инициализируем ползунок и текст с начальным значением
fontSizeRange.min = 1;
fontSizeRange.max = 120;
fontSizeRange.value = 10;
fontSizeValue.textContent = fontSizeRange.value;

// Обновление отображаемого значения при изменении ползунка
fontSizeRange.addEventListener('input', () => {
  fontSizeValue.textContent = fontSizeRange.value;
});

// Применение выбранного размера шрифта к всем элементам с классом .name по кнопке
applyFontSizeBtn.addEventListener('click', () => {
  const newSize = fontSizeRange.value + 'px';
  document.querySelectorAll('.name').forEach(el => {
    el.style.fontSize = newSize;
  });
});

// Устанавливаем min, max и начальное значение (если не задано в HTML)
fontSizeAuthorRange.min = 1;
fontSizeAuthorRange.max = 120;
if (!fontSizeAuthorRange.value) fontSizeAuthorRange.value = 10;
fontSizeAuthorValue.textContent = fontSizeAuthorRange.value;

// При движении ползунка меняем размер шрифта в реальном времени
fontSizeAuthorRange.addEventListener('input', () => {
  const newSize = fontSizeAuthorRange.value + 'px';
  fontSizeAuthorValue.textContent = fontSizeAuthorRange.value;
  document.querySelectorAll('.author').forEach(el => {
    el.style.fontSize = newSize;
  });
});
