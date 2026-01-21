// ========================
// ABAS
// ========================
document.addEventListener("DOMContentLoaded", () => {

  const tabs = document.querySelectorAll(".tab");
  const contents = document.querySelectorAll(".content");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      contents.forEach(c => c.classList.remove("active"));

      tab.classList.add("active");
      document.getElementById(tab.dataset.tab).classList.add("active");
    });
  });

  // ========================
  // APLICAR CONFIG
  // ========================
  document.getElementById("apply").addEventListener("click", () => {
    const config = collectConfig();
    localStorage.setItem("zxiter_config", JSON.stringify(config));
    alert("✅ Configurações aplicadas!");
  });

  // ========================
  // RESET
  // ========================
  document.getElementById("reset").addEventListener("click", () => {
    document.querySelectorAll("input[type=checkbox]").forEach(c => c.checked = false);
    document.querySelectorAll("input[type=number]").forEach(n => n.value = 50);
    document.getElementById("target").value = "head";
    localStorage.removeItem("zxiter_config");
    alert("♻️ Painel resetado!");
  });

  // ========================
  // EXPORTAR CONFIG
  // ========================
  document.getElementById("export").addEventListener("click", () => {
    const config = collectConfig();
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "zxiter-config.json";
    a.click();
  });

  // ========================
  // DOWNLOAD CONNECT
  // ========================
  document.getElementById("downloadData").addEventListener("click", async () => {
    const zip = new JSZip();

    zip.file("connect/readme.txt", "ZXiter Connect - Jogo Próprio Unity");
    zip.file("connect/config.json", JSON.stringify(collectConfig(), null, 2));

    const content = await zip.generateAsync({ type: "blob" });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(content);
    a.download = "ZXiter-Connect.zip";
    a.click();
  });

  // ========================
  // LOAD CONFIG
  // ========================
  const saved = localStorage.getItem("zxiter_config");
  if (saved) applySavedConfig(JSON.parse(saved));
});

// ========================
// FUNÇÕES
// ========================
function collectConfig() {
  const config = { checks: {}, sensitivity: {}, target: "" };

  document.querySelectorAll("input[type=checkbox]").forEach(c => {
    config.checks[c.dataset.key] = c.checked;
  });

  config.sensitivity = {
    x: Number(document.getElementById("sensX").value),
    y: Number(document.getElementById("sensY").value),
    z: Number(document.getElementById("sensZ").value)
  };

  config.target = document.getElementById("target").value;
  return config;
}

function applySavedConfig(cfg) {
  document.querySelectorAll("input[type=checkbox]").forEach(c => {
    c.checked = !!cfg.checks[c.dataset.key];
  });

  document.getElementById("sensX").value = cfg.sensitivity.x;
  document.getElementById("sensY").value = cfg.sensitivity.y;
  document.getElementById("sensZ").value = cfg.sensitivity.z;
  document.getElementById("target").value = cfg.target;
}
