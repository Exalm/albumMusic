// Функция проверки формата mm:ss и ограничений минут и секунд
function isValidTimeFormat(value) {
  const timePattern = /^(\d{1,2}):(\d{1,2})$/;
  const match = value.match(timePattern);
  if (!match) return false;

  const minutes = Number(match[1]);
  const seconds = Number(match[2]);

  if (minutes < 0 || minutes > 59) return false;
  if (seconds < 0 || seconds > 59) return false;

  return true;
}

// Восстановление значений из localStorage при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  const timeElements = document.querySelectorAll('div.time');
  timeElements.forEach((el, idx) => {
    const savedValue = localStorage.getItem('time_' + idx);
    if (savedValue && isValidTimeFormat(savedValue)) {
      el.textContent = savedValue;
    }
  });
});

document.getElementById('changeTimeBtn').addEventListener('click', function() {
  const timeElements = document.querySelectorAll('div.time');

  timeElements.forEach((el, idx) => {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = el.textContent.trim();
    input.className = 'time-input';

    // Ограничиваем ввод - допустим ввод только цифр и двоеточия
    input.addEventListener('input', () => {
      // Убираем все символы кроме цифр и двоеточия
      input.value = input.value.replace(/[^\d:]/g, '');

      // Ограничиваем количество двоеточий одним
      const parts = input.value.split(':');
      if (parts.length > 2) {
        input.value = parts[0] + ':' + parts[1];
      }
    });

    input.addEventListener('keydown', function(event) {
      if (event.key === 'Enter' || event.key === 'Escape') {
        if (isValidTimeFormat(input.value)) {
          const newDiv = document.createElement('div');
          newDiv.className = 'time';
          newDiv.textContent = input.value;

          localStorage.setItem('time_' + idx, input.value);

          input.replaceWith(newDiv);
        } else {
          // Если неверный формат - можно подсветить ошибку или отменить закрытие
          alert('Время должно быть в формате мм:сс, где минуты и секунды от 0 до 60');
          event.preventDefault();
        }
      }
    });

    // Сохраняем значение при уходе с поля, если правильно
    input.addEventListener('blur', () => {
      if (isValidTimeFormat(input.value)) {
        localStorage.setItem('time_' + idx, input.value);
      }
    });

    el.replaceWith(input);
    input.focus();
  });
});