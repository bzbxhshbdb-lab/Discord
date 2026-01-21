// =========================
// UNITY BRIDGE (SIMULADO)
// =========================
if (!window.Unity) {
  window.Unity = {
    call: function (data) {
      console.log("Config enviada para Unity:", data);
    }
  };
}

// =========================
// ABAS
// =========================
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

// =========================
// COLETAR CONFIGURAÇÕES
// =========================
function collectSettings() {
  const cfg = {};

  document.querySelectorAll("input[type=checkbox]").forEach(cb => {
    cfg[cb.dataset.key] = cb.checked;
  });

  cfg.target = document.getElementById("target").value;

  cfg.sensitivity = {
    x: Number(document.getElementById("sensX").value),
    y: Number(document.getElementById("sensY").value),
    z: Number(document.getElementById("sensZ").value)
  };

  return cfg;
}

// =========================
// AIM ASSIST
// =========================
function buildAimAssist(s) {
  if (!s.aimAssist && !s.aimLock && !s.aimbot) return { enabled: false };

  return {
    enabled: true,
    magnetism: s.aimAssist ? 0.85 : 0,
    slowdown: s.aimAssist ? 0.5 : 0,
    correction: s.aimAssist ? 0.8 : 0,
    priority: s.target,
    aimLock: s.aimLock,
    aimbot: s.aimbot,
    autoRotate: false
  };
}

// =========================
// APLICAR CONFIG
// =========================
document.getElementById("apply").addEventListener("click", () => {
  const s = collectSettings();

  const finalConfig = {
    app: "ZXiter Trick",
    engine: "Unity",
    gameplay: {
      aimAssist: buildAimAssist(s),
      precision: s.dynamicPrecision,
      stability: s.weaponStability,
      recoil: s.recoilControl,
      sensitivity: s.sensitivity
    },
    system: {
      antilag: s.antilag,
      fpsBoost: s.fpsBoost,
      pingBoost: s.pingBoost,
      lowLatency: s.lowLatency
    }
  };

  localStorage.setItem("zxiter_config", JSON.stringify(finalConfig));
  Unity.call(JSON.stringify(finalConfig));
  alert("Configurações aplicadas com sucesso.");
});

// =========================
// DOWNLOAD CONNECT (ZIP)
// =========================
document.getElementById("downloadData").addEventListener("click", async () => {
  const zip = new JSZip();
  const folder = zip.folder("files/data");

  for (let i = 1; i <= 20; i++) {
    folder.file(
      `connect_${i}.json`,
      JSON.stringify({
        id: i,
        type: "unity-connect",
        path: "files/data",
        createdAt: new Date().toISOString()
      }, null, 2)
    );
  }

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "connect_files_data.zip";
  a.click();

  URL.revokeObjectURL(url);
});

// =========================
// EXPORTAR CONFIG
// =========================
document.getElementById("export").addEventListener("click", () => {
  const data = localStorage.getItem("zxiter_config");
  if (!data) return alert("Nenhuma config salva.");

  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "zxiter_config.json";
  a.click();

  URL.revokeObjectURL(url);
});

// =========================
// RESET
// =========================
document.getElementById("reset").addEventListener("click", () => {
  localStorage.removeItem("zxiter_config");
  document.querySelectorAll("input").forEach(i => {
    if (i.type === "checkbox") i.checked = false;
    if (i.type === "number") i.value = 50;
  });
  document.getElementById("target").value = "head";
  alert("Painel resetado.");
});

// =========================
// LOAD AUTOMÁTICO
// =========================
window.addEventListener("load", () => {
  const saved = localStorage.getItem("zxiter_config");
  if (!saved) return;

  const cfg = JSON.parse(saved);
  const g = cfg.gameplay || {};

  document.getElementById("sensX").value = g.sensitivity?.x ?? 50;
  document.getElementById("sensY").value = g.sensitivity?.y ?? 50;
  document.getElementById("sensZ").value = g.sensitivity?.z ?? 50;
});
