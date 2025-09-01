document.querySelectorAll('.dwn').forEach(button => {
  button.addEventListener('click', () => {
    // Начинаем анимацию затухания
    button.style.transition = 'opacity 0.5s ease';
    button.style.opacity = '0';

    // По окончании анимации затухания меняем содержимое на gif и показываем с эффектом появления
    setTimeout(() => {
      button.innerHTML = '<img src="./images/download_animation.gif" alt="loading animation" style="width:24px; height:24px;">';
      button.style.opacity = '1';

      // Через 3 секунды вернуть исходный svg с анимацией появления
      setTimeout(() => {
        button.style.opacity = '0';
        setTimeout(() => {
          button.innerHTML = `
            <svg fill="#000000" width="24px" height="24px" viewBox="0 0 512 512"
                 data-name="Layer 1" id="Layer_1" xmlns="http://www.w3.org/2000/svg">
              <path d="M256,409.7,152.05,305.75,173.5,284.3l67.33,67.32V34h30.34V351.62L338.5,284.3,360,305.75ZM445.92,351v93.22a3.61,3.61,0,0,1-3.47,3.48H69.15a3.3,3.3,0,0,1-3.07-3.48V351H35.74v93.22A33.66,33.66,0,0,0,69.15,478h373.3a33.85,33.85,0,0,0,33.81-33.82V351Z"/>
            </svg>`;
          button.style.opacity = '1';
        }, 500); // время плавного скрытия svg
      }, 3000);
    }, 500); // время затухания перед сменой на gif
  });
});

