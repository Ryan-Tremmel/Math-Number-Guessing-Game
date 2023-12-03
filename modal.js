export function closeModal() {
  document.querySelector('.overlay').classList.add('hidden');
  document.getElementById('modal').classList.add('hidden');
  document.getElementById('app').style.opacity = '1';
}

export function showModal() {
  document.querySelector('.overlay').classList.remove('hidden');
  document.getElementById('modal').classList.remove('hidden');
  document.getElementById('app').style.opacity = '.15';
}
