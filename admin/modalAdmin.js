const adminModal = document.getElementById('adminModal');
const buttons = document.querySelectorAll('.openAdminModal.player');
const closeBtn = document.getElementById('closeAdminModal');

function openAdminPanel() {
  adminModal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  // Фокусируем модал для доступности
  adminModal.setAttribute('tabindex', '-1');
  adminModal.focus();
}

function closeAdminPanel() {
  adminModal.style.display = 'none';
  document.body.style.overflow = '';
  // Снимаем tabindex и снимаем фокус
  adminModal.removeAttribute('tabindex');
}

// Открытие модалки по нажатию Enter или Space (для клавиатурной доступности)
buttons.forEach(button => {
  button.addEventListener('click', openAdminPanel);
  button.addEventListener('keydown', (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openAdminPanel();
    }
  });
});

// Закрытие при клике по кресту
closeBtn.addEventListener('click', closeAdminPanel);

// Закрытие при клике вне content
adminModal.addEventListener('click', e => {
  if (e.target === adminModal) {
    closeAdminPanel();
  }
});

// Закрытие по нажатию Escape
document.addEventListener('keydown', (e) => {
  if (e.key === "Escape" && adminModal.style.display === 'flex') {
    closeAdminPanel();
  }
});
