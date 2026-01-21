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
// COLETAR CONFIGURAÇÃO
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
// AIM ASSIST (LÓGICO)
// =========================
function buildAimAssist(s) {
  if (!s.aimAssist && !s.aimLock && !s.aimbot) {
    return { enabled: false };
  }

  return {
    enabled: true,
    magnetism: s.aimAssist ? 0.85 : 0,
    slowdown: s.aimAssist ? 0.5 : 0,
    correction: s.aimAssist ? 0.8 : 0,
    fov: 8,
    priority: s.target || "head",
    aimLock: !!s.aimLock,
    aimbot: !!s.aimbot
  };
}

// =========================
// APLICAR CONFIGURAÇÃO
// =========================
document.getElementById("apply").addEventListener("click", () => {
  const s = collectSettings();

  const finalConfig = {
    app: "ZXiter Trick",
    gameplay: {
      precision: s.dynamicPrecision || false,
      stability: s.weaponStability || false,
      recoil: s.recoilControl || false,
      aimAssist: buildAimAssist(s),
      sensitivity: s.sensitivity
    },
    performance: {
      antilag: s.antilag,
      pingBoost: s.pingBoost,
      fpsBoost: s.fpsBoost,
      reduceDelay: s.reduceDelay,
      lowLatency: s.lowLatency
    },
    system: {
      advancedSync: s.advancedSync,
      smartCache: s.smartCache,
      processPriority: s.processPriority,
      debugMode: s.debugMode
    },
    timestamp: Date.now()
  };

  localStorage.setItem("zxiter_config", JSON.stringify(finalConfig));
  alert("Configuração aplicada e salva.");
});

// =========================
// EXPORTAR CONFIG (JSON)
// =========================
document.getElementById("export").addEventListener("click", () => {
  const cfg = localStorage.getItem("zxiter_config");
  if (!cfg) return alert("Nenhuma configuração salva.");

  const blob = new Blob([cfg], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "zxiter_config.json";
  a.click();
  URL.revokeObjectURL(a.href);
});

// =========================
// DOWNLOAD ZIP (DATA + 20 FILES)
// REQUER JSZIP NO HTML
// =========================
document.getElementById("downloadData").addEventListener("click", async () => {
  if (typeof JSZip === "undefined") {
    alert("JSZip não carregado");
    return;
  }

  const zip = new JSZip();
  const folder = zip.folder("data");

  const sensitivity = {
    x: Number(document.getElementById("sensX").value),
    y: Number(document.getElementById("sensY").value),
    z: Number(document.getElementById("sensZ").value)
  };

  for (let i = 1; i <= 20; i++) {
    folder.file(
      `connection_${i}.json`,
      JSON.stringify({
        id: i,
        type: "game_connection",
        sensitivity,
        createdAt: Date.now()
      }, null, 2)
    );
  }

  const blob = await zip.generateAsync({ type: "blob" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "data_connections.zip";
  a.click();
  URL.revokeObjectURL(a.href);
});

// =========================
// RESETAR PAINEL
// =========================
document.getElementById("reset").addEventListener("click", () => {
  document.querySelectorAll("input").forEach(el => {
    if (el.type === "checkbox") el.checked = false;
    if (el.type === "number") el.value = 50;
  });

  document.getElementById("target").value = "head";
  localStorage.removeItem("zxiter_config");
  alert("Painel resetado.");
});

// =========================
// LOAD CONFIGURAÇÃO SALVA
// =========================
window.addEventListener("load", () => {
  const saved = localStorage.getItem("zxiter_config");
  if (!saved) return;

  const cfg = JSON.parse(saved);

  document.querySelectorAll("input[type=checkbox]").forEach(cb => {
    const key = cb.dataset.key;
    cb.checked = !!cfg.performance?.[key] || !!cfg.system?.[key] || false;
  });

  if (cfg.gameplay?.aimAssist?.priority) {
    document.getElementById("target").value = cfg.gameplay.aimAssist.priority;
  }

  if (cfg.gameplay?.sensitivity) {
    document.getElementById("sensX").value = cfg.gameplay.sensitivity.x;
    document.getElementById("sensY").value = cfg.gameplay.sensitivity.y;
    document.getElementById("sensZ").value = cfg.gameplay.sensitivity.z;
  }
});
// =========================
// DOWNLOAD CONNECT (FILES/DATA)
// =========================
document.getElementById("downloadData").addEventListener("click", () => {
  const files = [];
  
  for (let i = 1; i <= 20; i++) {
    files.push(
      `connect_${i}.json:\n` +
      JSON.stringify({
        id: i,
        type: "external-connect",
        path: "files/data",
        timestamp: Date.now()
      }, null, 2)
    );
  }

  const blob = new Blob([files.join("\n\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "connect_files_data.txt";
  a.click();

  URL.revokeObjectURL(url);
});
