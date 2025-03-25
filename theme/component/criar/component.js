document.addEventListener("DOMContentLoaded", function () {
    // Pega o conteúdo do header.html
    fetch("../../theme/component/criar/component.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("criar").innerHTML = data;

            // Cria um elemento <link> para importar o CSS
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = "../../theme/component/criar/component.css"; // Caminho do CSS
            document.head.appendChild(link); 
        })
        .catch(error => console.error("Erro ao carregar o criar:", error));
    });

