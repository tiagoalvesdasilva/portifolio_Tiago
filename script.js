document.addEventListener("DOMContentLoaded", function () {
    // Efeito de digitação (sem "flash" do texto original)
    const text = "Desenvolvedor Front-End";
    const target = document.getElementById("typed-role");
    let index = 0;

    function typeEffect() {
        if (index < text.length) {
            target.textContent += text[index];
            index++;
            setTimeout(typeEffect, 90);
        }
    }
    typeEffect();

    // Ano dinâmico no rodapé
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // AOS
    AOS.init({
        duration: 1000,
        easing: "ease-in-out",
        once: false,
        offset: 150,
    });

    // Menu mobile
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");
    const links = document.querySelectorAll(".nav-links a");

    menuToggle.addEventListener("click", () => {
        menuToggle.classList.toggle("active");
        navLinks.classList.toggle("active");
    });

    links.forEach(link => {
        link.addEventListener("click", () => {
            menuToggle.classList.remove("active");
            navLinks.classList.remove("active");
        });
    });

    document.querySelectorAll(".project-item").forEach(card => {
    card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform = "perspective(800px) rotateX(0) rotateY(0) translateY(0)";
    });
});
});