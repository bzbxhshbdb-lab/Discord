/* =========================
   ABAS
   ========================= */
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

/* =========================
   COLETAR CONFIGURAÇÃO
   ========================= */
function collectSettings() {
  const config = {};
  
  // Checkboxes
  document.querySelectorAll("input[type=checkbox]").forEach(cb => {
    config[cb.dataset.key] = cb.checked;
  });

  // Hitbox alvo
  config.target = document.getElementById("target").value;

  return config;
}

/* =========================
   AIM ASSIST AVANÇADO
   ========================= */
function buildAimAssist(settings) {
  if (!settings.aimAssist && !settings.aimLock && !settings.aimbot) {
    return { enabled: false };
  }

  return {
    enabled: settings.aimAssist || settings.aimLock || settings.aimbot,

    // 🔥 Magnetismo suave
    magnetism: settings.aimAssist ? 0.85 : 0.0,

    // 🔥 Redução de sensibilidade (quando habilitado)
    slowdown: settings.aimAssist ? 0.5 : 0.0,

    // 🔥 Correção angular suave (não gira sozinho)
    correction: settings.aimAssist ? 0.8 : 0.0,

    // 🔥 Cone de mira
    baseFov: 8.0,
    minFov: 4.0,
    dynamicFov: true,

    // 🎯 Prioridade de hitbox
    priority: settings.target || "head",

    // ❌ nunca automático
    autoRotate: false,
    snap: false,

    // 🔒 Aim Lock
    aimLock: settings.aimLock ? { enabled: true, strength: 0.8, releaseDelayMs: 120 } : { enabled: false },

    // 🎯 Aimbot (apenas flag para estudo)
    aimbot: settings.aimbot ? { enabled: true, mode: "logical", smoothing: 0.9 } : { enabled: false }
  };
}

/* =========================
   GAMEPLAY EXTREMO
   ========================= */
function buildGameplay(settings) {
  return {
    precision: settings.dynamicPrecision ? 1.0 : 0.9,
    stability: settings.weaponStability ? 1.0 : 0.9,
    recoil: settings.recoilControl ? 0.01 : 0.2,
    aimAssist: buildAimAssist(settings)
  };
}

/* =========================
   APLICAR CONFIGURAÇÃO
   ========================= */
document.getElementById("apply").addEventListener("click", () => {
  const settings = collectSettings();

  const finalConfig = {
    app: "ZXiter Trick",
    displayName: "Free Fire Max",
    package: "com.dts.freefiremax",

    performance: {
      antilag: settings.antilag,
      pingBoost: settings.pingBoost,
      fpsBoost: settings.fpsBoost,
      reduceDelay: settings.reduceDelay,
      lowLatency: settings.lowLatency
    },

    gameplay: buildGameplay(settings),

    system: {
      advancedSync: settings.advancedSync,
      smartCache: settings.smartCache,
      processPriority: settings.processPriority,
      debugMode: settings.debugMode
    }
  };

  // Comunicação direta com Unity (se existir)
  if (window.Unity) {
    window.Unity.call(JSON.stringify(finalConfig));
  }

  // Salvar local
  localStorage.setItem("zxiter_config", JSON.stringify(finalConfig));
  alert("Assistência de mira avançada aplicada.");
});

/* =========================
   EXPORTAR CONFIGURAÇÃO
   ========================= */
function exportConfig() {
  const config = localStorage.getItem("zxiter_config");
  if (!config) {
    alert("Nenhuma configuração salva para exportar.");
    return;
  }

  const blob = new Blob([config], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "zxiter_aim_config.json";
  a.click();

  URL.revokeObjectURL(url);
}

/* =========================
   LOAD CONFIGURAÇÃO SALVA
   ========================= */
window.addEventListener("load", () => {
  const saved = localStorage.getItem("zxiter_config");
  if (!saved) return;

  const cfg = JSON.parse(saved);
  const aim = cfg.gameplay?.aimAssist || {};

  // Restaurar checkboxes
  document.querySelectorAll("input[type=checkbox]").forEach(cb => {
    const key = cb.dataset.key;
    cb.checked = !!cfg.performance[key] || !!cfg.system[key] || !!aim[key];
  });

  // Restaurar hitbox alvo
  document.getElementById("target").value = aim.priority || "head";
});
