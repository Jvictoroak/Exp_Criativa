//criar
document.addEventListener("DOMContentLoaded", function () { 
    const fechar = document.getElementById('fechar-criar');
    const component_criar = document.getElementById('criar');
    
    fechar.addEventListener('click', () => {
        component_criar.classList.toggle('block');
    });
});

