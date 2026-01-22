// ========================
// SCRIPT ZXITER – FIX FINAL
// ========================

document.addEventListener("DOMContentLoaded", () => {
  console.log("ZXITER SCRIPT OK");

  // ========================
  // ABAS (FIXADAS)
  // ========================
  const tabs = document.querySelectorAll(".tab");
  const contents = document.querySelectorAll(".content");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const targetId = tab.getAttribute("data-tab");

      // remove estados
      tabs.forEach(t => t.classList.remove("active"));
      contents.forEach(c => c.classList.remove("active"));

      // ativa aba
      tab.classList.add("active");

      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.add("active");
      } else {
        console.error("ABA NÃO ENCONTRADA:", targetId);
      }
    });
  });

  // ========================
  // APLICAR
  // ========================
  document.getElementById("apply").onclick = () => {
    saveConfig();
    alert("✅ Configurações aplicadas");
  };

  // ========================
  // RESET
  // ========================
  document.getElementById("reset").onclick = () => {
    document.querySelectorAll("input[type=checkbox]").forEach(c => c.checked = false);
    document.querySelectorAll("input[type=number]").forEach(n => n.value = 50);
    document.getElementById("target").value = "head";
    localStorage.removeItem("zxiter_config");
    alert("♻️ Painel resetado");
  };

  // ========================
  // EXPORTAR
  // ========================
  document.getElementById("export").onclick = () => {
    const config = collectConfig();
    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: "application/json"
    });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "zxiter-config.json";
    a.click();
  };

  // ========================
  // DOWNLOAD CONNECT
  // ========================
  document.getElementById("downloadData").onclick = async () => {
    if (typeof JSZip === "undefined") {
      alert("❌ JSZip não carregou");
      return;
    }

    const zip = new JSZip();
    zip.file("connect/readme.txt", "ZXiter Connect ativo");
    zip.file("connect/config.json", JSON.stringify(collectConfig(), null, 2));

    const content = await zip.generateAsync({ type: "blob" });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(content);
    a.download = "ZXiter-Connect.zip";
    a.click();
  };

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
  const config = {
    checks: {},
    sensitivity: {
      x: Number(document.getElementById("sensX").value),
      y: Number(document.getElementById("sensY").value),
      z: Number(document.getElementById("sensZ").value)
    },
    target: document.getElementById("target").value
  };

  document.querySelectorAll("input[type=checkbox]").forEach(c => {
    config.checks[c.dataset.key] = c.checked;
  });

  return config;
}

function saveConfig() {
  localStorage.setItem("zxiter_config", JSON.stringify(collectConfig()));
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
