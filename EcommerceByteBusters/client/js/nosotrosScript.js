const btnMenu = document.getElementById('menu');
const nav = document.getElementById('lista-nav')


btnMenu.addEventListener('click', () => {
    if (nav.style.display === 'none' || nav.style.display === '') {
        nav.style.display = 'flex';
    } else {
        nav.style.display = 'none';
    }
});