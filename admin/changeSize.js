// Получаем элементы управления
const fontSizeRange = document.getElementById('fontSizeRange');
const fontSizeValue = document.getElementById('fontSizeValue');
const applyFontSizeBtn = document.getElementById('applyFontSizeBtn');

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
