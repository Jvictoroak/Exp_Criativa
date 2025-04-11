//navbar
document.addEventListener("DOMContentLoaded", function () {
    const criar = document.getElementById('menu-criar');
    const component_criar = document.getElementById('criar');
    criar.addEventListener('click', () => {
        component_criar.classList.toggle('block');
    });

});


