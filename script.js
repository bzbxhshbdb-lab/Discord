const CONFIG_KEY = "zxiter_trick_config_v2";

/* ---------- TABS ---------- */
function openTab(id) {
  document.querySelectorAll(".tab").forEach(tab => {
    tab.classList.remove("active");
  });
  document.getElementById(id).classList.add("active");
}
openTab("aim");

/* ---------- CHECKBOX ---------- */
function isChecked(id) {
  return document.getElementById(id).checked;
}

/* ---------- CÁLCULOS BASE (APENAS PARÂMETROS) ---------- */
function calculateAimAssist(enabled) {
  if (!enabled) {
    return {
      enabled: false
    };
  }

  return {
    enabled: true,
    assistStrength: 0.65,
    slowdownNearTarget: 0.4,
    magnetism: 0.3,
    dynamicAdjustment: true
  };
}

function calculateAimLock(enabled) {
  return {
    enabled,
    lockStrength: enabled ? 0.8 : 0,
    releaseDelayMs: 120
  };
}

function calculateAimbot(enabled) {
  // ⚠️ APENAS FLAG DE ESTUDO / JOGO PRÓPRIO
  return {
    enabled,
    mode: "logical", // sem mover câmera
    prediction: false,
    smoothing: 0.9
  };
}

/* ---------- CONFIG ---------- */
function getConfig() {
  const aimAssist = isChecked("aimAssist");
  const aimLock = isChecked("aimLock");
  const aimbot = isChecked("aimbot");

  return {
    app: "ZXiter Trick",
    type: "Aim Configuration",
    usage: "own_game_study_only",

    aimAssistant: {
      enabled: aimAssist || aimLock || aimbot,
      aimAssist: calculateAimAssist(aimAssist),
      aimLock: calculateAimLock(aimLock),
      aimbot: calculateAimbot(aimbot)
    },

    timestamp: Date.now()
  };
}

/* ---------- SALVAR ---------- */
function saveConfig() {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(getConfig()));
  alert("Configuração salva com sucesso");
}

/* ---------- EXPORTAR ---------- */
function exportConfig() {
  const data = JSON.stringify(getConfig(), null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "aim_assistant_config.json";
  a.click();

  URL.revokeObjectURL(url);
}

/* ---------- LOAD ---------- */
window.addEventListener("load", () => {
  const saved = localStorage.getItem(CONFIG_KEY);
  if (!saved) return;

  const cfg = JSON.parse(saved);

  document.getElementById("aimAssist").checked =
    cfg.aimAssistant?.aimAssist?.enabled || false;

  document.getElementById("aimLock").checked =
    cfg.aimAssistant?.aimLock?.enabled || false;

  document.getElementById("aimbot").checked =
    cfg.aimAssistant?.aimbot?.enabled || false;
});
