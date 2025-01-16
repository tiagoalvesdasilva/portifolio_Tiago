document.addEventListener("DOMContentLoaded", function () {
    const links = document.querySelectorAll('.nav-links a'); 
    // Seleciona todos os links do menu

    links.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault(); 
            // Evita o comportamento padrão de pular diretamente para o elemento
            const targetId = this.getAttribute('href').substring(1); // Obtém o ID do destino (remove o #)
            const targetElement = document.getElementById(targetId); // Seleciona o elemento correspondente

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth' // Rola suavemente até o elemento
                });
            }
        });
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const text = "Desenvolvedor Front-End";
    const target = document.querySelector(".about-content p:nth-of-type(2)"); // Seleciona o segundo <p>
    let index = 0;

    function typeEffect() {
        if (index < text.length) {
            target.textContent += text[index];
            index++;
            setTimeout(typeEffect, 100);
        }
    }

    target.textContent = "";
    typeEffect();
});

document.addEventListener("DOMContentLoaded", function () {
    AOS.init({
        duration: 1200, // Duração da animação em milissegundos
        easing: 'ease-in-out', // Estilo da animação
        once: false, // A animação acontece apenas uma vez ao rolar a página
        offset: 200, // Distância em pixels para disparar a animação
    });
});
