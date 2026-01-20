const config = JSON.parse(localStorage.getItem("zxiterConfig")) || {};

document.querySelectorAll("input[type=checkbox]").forEach(box => {
  box.checked = config[box.dataset.key] || false;

  box.addEventListener("change", () => {
    config[box.dataset.key] = box.checked;
    save();
  });
});

document.getElementById("target").addEventListener("change", e => {
  config.target = e.target.value;
  save();
});

function save() {
  localStorage.setItem("zxiterConfig", JSON.stringify(config));
}

document.getElementById("apply").onclick = () => {
  console.log("ZXiter Config:", config);

  // 🔥 Conectar com o SEU jogo:
  // window.Unity.call(JSON.stringify(config));
  // fetch("http://localhost:3000/config", { method:"POST", body:JSON.stringify(config) })
};

// Tabs
document.querySelectorAll(".tab").forEach(tab => {
  tab.onclick = () => {
    document.querySelectorAll(".tab, .content").forEach(e => e.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
  };
});

// Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}