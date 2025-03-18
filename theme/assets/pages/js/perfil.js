document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.getElementById("fileInput");
    const postsGrid = document.querySelector(".posts-grid");

    // Função para carregar imagens salvas no LocalStorage
    function loadImages() {
        const savedImages = JSON.parse(localStorage.getItem("savedPosts")) || [];
        savedImages.forEach(imageSrc => addImageToGrid(imageSrc));
    }

    // Função para adicionar imagem na grade e salvar no LocalStorage
    function addImageToGrid(imageSrc) {
        const newPost = document.createElement("div");
        newPost.classList.add("post");
        newPost.innerHTML = `<img src="${imageSrc}" alt="Post">`;

        // Insere antes do botão "+"
        postsGrid.insertBefore(newPost, document.querySelector(".add-post"));
    }

    // Evento ao selecionar um arquivo
    fileInput.addEventListener("change", function (event) {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = function (e) {
                const imageSrc = e.target.result;

                // Adiciona a imagem à grade
                addImageToGrid(imageSrc);

                // Salva no LocalStorage
                const savedImages = JSON.parse(localStorage.getItem("savedPosts")) || [];
                savedImages.push(imageSrc);
                localStorage.setItem("savedPosts", JSON.stringify(savedImages));
            };

            reader.readAsDataURL(file); // Converte a imagem para Base64
        }
    });

    // Carrega imagens ao iniciar a página
    loadImages();
});

document.addEventListener("DOMContentLoaded", function () {
    const username = document.getElementById("username");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const birthdate = document.getElementById("birthdate");
    const saveButton = document.getElementById("saveChanges");

    // Função para carregar os dados salvos
    function loadProfileData() {
        const savedData = JSON.parse(localStorage.getItem("profileData"));

        if (savedData) {
            username.textContent = savedData.username;
            email.textContent = savedData.email;
            password.textContent = savedData.password;
            birthdate.textContent = savedData.birthdate;
        }
    }

    // Função para salvar os dados no LocalStorage
    function saveProfileData() {
        const profileData = {
            username: username.textContent,
            email: email.textContent,
            password: password.textContent,
            birthdate: birthdate.textContent
        };

        localStorage.setItem("profileData", JSON.stringify(profileData));
        alert("Dados salvos com sucesso!");
    }

    // Evento para salvar os dados ao clicar no botão "Salvar"
    saveButton.addEventListener("click", saveProfileData);

    // Carrega os dados ao iniciar a página
    loadProfileData();
});

document.addEventListener("DOMContentLoaded", function () {
    const profileImage = document.getElementById("profileImage");
    const profileInput = document.getElementById("profileInput");

    // Definir imagem padrão
    const defaultImage = "default-profile.png"; 

    // Carregar imagem salva no LocalStorage ou manter a padrão
    function loadProfileImage() {
        const savedImage = localStorage.getItem("profileImage");
        profileImage.src = savedImage ? savedImage : defaultImage;
    }

    // Trocar imagem ao selecionar arquivo
    profileInput.addEventListener("change", function (event) {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = function (e) {
                const imageSrc = e.target.result;
                profileImage.src = imageSrc;

                // Salvar no LocalStorage
                localStorage.setItem("profileImage", imageSrc);
            };

            reader.readAsDataURL(file); // Converte a imagem para Base64
        }
    });

    // Carregar imagem ao iniciar a página
    loadProfileImage();
});
