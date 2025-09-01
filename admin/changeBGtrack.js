document.getElementById('changeBackgroundTrackBtn').addEventListener('click', () => {
  const menu = document.getElementById('backgroundTrackColorMenu');
  menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
});

const colorInput = document.getElementById('bgColorPickerTrack');

colorInput.addEventListener('input', () => {
  const color = colorInput.value;
  const musicContainers = document.querySelectorAll('.music__container');
  musicContainers.forEach(container => {
    container.style.background = color;
  });
  
  // Сохраняем цвет сразу при изменении
  localStorage.setItem('musicContainerBgColor', color);
});

// При загрузке страницы восстанавливаем цвет из localStorage
window.addEventListener('DOMContentLoaded', () => {
  const savedColor = localStorage.getItem('musicContainerBgColor');
  if (savedColor) {
    const musicContainers = document.querySelectorAll('.music__container');
    musicContainers.forEach(container => {
      container.style.background = savedColor;
    });
    if (colorInput) colorInput.value = savedColor;
  }
});
