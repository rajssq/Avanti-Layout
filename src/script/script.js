document.addEventListener("DOMContentLoaded", () => {
  // Busca
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");
  const searchMessage = document.getElementById("searchMessage");

  const showSearchMessage = (term) => {
    searchMessage.innerHTML = "Você buscou por: ";
    const spanTerm = document.createElement("span");
    spanTerm.textContent = term;
    spanTerm.className = "text-blue";
    searchMessage.appendChild(spanTerm);
  };

  const handleSearch = () => {
    const term = searchInput.value.trim();
    searchMessage.textContent = term ? "" : searchMessage.textContent;
    term && showSearchMessage(term);
  };

  searchButton.addEventListener("click", handleSearch);
  searchInput.addEventListener(
    "keydown",
    (e) => e.key === "Enter" && handleSearch()
  );

  // Carrossel
  const productContainers = document.querySelectorAll(".product-container");

  const getCardsToShow = () => (window.innerWidth >= 1280 ? 5 : 2);

  const setupCardEvents = (card) => {
    const selectors = [
      ".buttonBuy",
      ".buttonQuantity",
      ".buttonAdd",
      ".buttonRemove",
      ".quantity",
    ];
    const [buttonBuy, buttonQuantity, buttonAdd, buttonRemove, quantity] =
      selectors.map((sel) => card.querySelector(sel));

    buttonBuy.classList.remove("hidden");
    buttonQuantity.classList.replace("flex", "hidden");
    quantity.textContent = "1";

    buttonBuy.onclick = () => {
      buttonBuy.classList.add("hidden");
      buttonQuantity.classList.replace("hidden", "flex");
    };

    buttonAdd.onclick = () =>
      (quantity.textContent = parseInt(quantity.textContent) + 1);
    buttonRemove.onclick = () => {
      let current = parseInt(quantity.textContent);
      if (current > 1) {
        quantity.textContent = current - 1;
      } else {
        buttonBuy.classList.remove("hidden");
        buttonQuantity.classList.replace("flex", "hidden");
        quantity.textContent = "1";
      }
    };
  };

  const renderProducts = (container) => {
    const cards = container.querySelectorAll(".product-card");
    const baseCard = cards[0];
    const cardsToShow = getCardsToShow();

    cards.forEach((card, i) => i && card.remove());

    for (let i = 1; i < cardsToShow; i++) {
      const clone = baseCard.cloneNode(true);
      setupCardEvents(clone);
      container.appendChild(clone);
    }
  };

  const renderAllProductContainers = () =>
    productContainers.forEach(renderProducts);

  const initSlider = (container) => {
    const prev = container.querySelector('[data-action="prev"]');
    const next = container.querySelector('[data-action="next"]');
    const dots = container.parentElement.querySelectorAll("[data-slide]");
    let current = 0;
    const total = dots.length;

    const renderSlide = (index) => {
      const cards = container.querySelectorAll(".product-card");
      const baseCard = cards[0];
      const cardsToShow = getCardsToShow();

      setupCardEvents(baseCard);
      container.classList.add("fade-out");

      setTimeout(() => {
        cards.forEach((card, i) => i && card.remove());
        for (let i = 1; i < cardsToShow; i++) {
          const clone = baseCard.cloneNode(true);
          setupCardEvents(clone);
          container.appendChild(clone);
        }
        container.classList.replace("fade-out", "fade-in");
        setTimeout(() => container.classList.remove("fade-in"), 300);
      }, 300);

      dots.forEach((dot, i) => {
        dot.classList.toggle("bg-gray-darkness", i === index);
        dot.classList.toggle("bg-gray-medium", i !== index);
      });
    };

    prev?.addEventListener("click", () =>
      renderSlide((current = (current - 1 + total) % total))
    );
    next?.addEventListener("click", () =>
      renderSlide((current = (current + 1) % total))
    );
    dots.forEach((dot, i) =>
      dot.addEventListener("click", () => renderSlide((current = i)))
    );

    let touchStartX = 0;
    container.addEventListener(
      "touchstart",
      (e) => (touchStartX = e.changedTouches[0].screenX)
    );
    container.addEventListener("touchend", (e) => {
      const deltaX = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(deltaX) > 50 && window.innerWidth < 1280) {
        renderSlide(
          (current = (current + (deltaX < 0 ? 1 : -1) + total) % total)
        );
      }
    });

    renderSlide(current);
  };

  renderAllProductContainers();
  productContainers.forEach(initSlider);

  window.addEventListener("resize", () => {
    clearTimeout(window.resizeTimer);
    window.resizeTimer = setTimeout(renderAllProductContainers, 200);
  });

  document.querySelectorAll(".product-card").forEach(setupCardEvents);

  // Formulário
  const form = document.querySelector("form");
  const [inputName, inputEmail, inputCheckbox] = [
    "#inputName",
    "#inputEmail",
    "#inputCheckbox",
  ].map((id) => document.querySelector(id));
  const errorName = inputName.nextElementSibling;
  const errorEmail = inputEmail.nextElementSibling;
  const errorCheckbox = inputCheckbox.closest("div").querySelector("p");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;

    const validateField = (input, error, condition) => {
      if (condition) {
        input.classList.add("border", "border-red-500");
        error.classList.remove("hidden");
        valid = false;
      } else {
        input.classList.remove("border", "border-red-500");
        error.classList.add("hidden");
      }
    };

    validateField(inputName, errorName, !inputName.value.trim());
    validateField(
      inputEmail,
      errorEmail,
      !inputEmail.value.trim() || !inputEmail.checkValidity()
    );

    if (!inputCheckbox.checked) {
      errorCheckbox.classList.remove("hidden");
      valid = false;
    } else {
      errorCheckbox.classList.add("hidden");
    }

    if (valid) {
      alert("Cadastro realizado com sucesso!");
      form.reset();
    }
  });

  // Menus institucionais
  const menuToggles = [
    ["#buttonInstitutional", "#institutional"],
    ["#buttonFAQ", "#faq"],
    ["#buttonContacts", "#contacts"],
  ];

  const toggleMenus = () => {
    const visible = window.innerWidth >= 1280;
    menuToggles.forEach(([, id]) => {
      document.querySelector(id).style.display = visible ? "block" : "none";
    });
    document
      .querySelectorAll(".arrow")
      .forEach((el) => (el.style.transform = "rotate(0deg)"));
  };

  menuToggles.forEach(([btnId, contentId]) => {
    const btn = document.querySelector(btnId);
    const content = document.querySelector(contentId);
    const arrow = btn.querySelector(".arrow");

    btn.addEventListener("click", () => {
      if (window.innerWidth < 1280) {
        const isVisible = content.style.display === "block";
        toggleMenus();
        if (!isVisible) {
          content.style.display = "block";
          arrow.style.transform = "rotate(180deg)";
        }
      }
    });
  });

  window.addEventListener("resize", toggleMenus);
  toggleMenus();

  // Scroll to top
  const scrollToTopButton = document.getElementById("scrollToTopButton");

  scrollToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", () => {
    const visible = window.scrollY > 200;
    scrollToTopButton.classList.toggle("hidden", !visible);
  });
});
