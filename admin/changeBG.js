document.getElementById('changeBackgroundBtn').addEventListener('click', () => {
  const menu = document.getElementById('backgroundColorMenu');
  // Показываем/скрываем меню выбора цвета по клику на кнопку
  if (menu.style.display === 'none') {
    menu.style.display = 'block';
  } else {
    menu.style.display = 'none';
  }
});

// Обработчик применения выбранного цвета
document.getElementById('applyBgColorBtn').addEventListener('click', () => {
  const color = document.getElementById('bgColorPicker').value;
  const musicBox = document.querySelector('.music__box');
  musicBox.style.background = color;

  // Сохраняем цвет в localStorage
  localStorage.setItem('musicBoxBgColor', color);
});

// При загрузке страницы восстанавливаем цвет из localStorage
window.addEventListener('DOMContentLoaded', () => {
  const savedColor = localStorage.getItem('musicBoxBgColor');
  if (savedColor) {
    const musicBox = document.querySelector('.music__box');
    musicBox.style.background = savedColor;
    // Также устанавливаем значение в пипер для визуальной синхронизации
    const picker = document.getElementById('bgColorPicker');
    if (picker) picker.value = savedColor;
  }
});
