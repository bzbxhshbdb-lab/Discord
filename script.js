document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab");
  const contents = document.querySelectorAll(".content");

  if (!tabs.length || !contents.length) {
    console.error("Abas não encontradas no DOM");
    return;
  }

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const targetId = tab.getAttribute("data-tab");

      tabs.forEach(t => t.classList.remove("active"));
      contents.forEach(c => c.classList.remove("active"));

      tab.classList.add("active");

      const target = document.getElementById(targetId);
      if (target) {
        target.classList.add("active");
      } else {
        console.error("Conteúdo não encontrado:", targetId);
      }
    });
  });
});
