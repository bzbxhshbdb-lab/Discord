const CONFIG_KEY = "zxiter_trick_config_v1";

function openTab(id) {
  document.querySelectorAll(".tab").forEach(tab => {
    tab.classList.remove("active");
  });
  document.getElementById(id).classList.add("active");
}
openTab("precision");

function getRange(id) {
  return parseInt(document.getElementById(id).value, 10) / 100;
}

function lerp(min, max, t) {
  return min + (max - min) * t;
}

function calculatePrecision(level) {
  return {
    baseSpread: lerp(1.2, 0.05, level),
    aimMultiplier: lerp(0.6, 0.25, level),
    movementPenalty: lerp(1.6, 1.05, level),
    distancePenalty: lerp(0.03, 0.005, level),
    dynamicAssist: lerp(0.85, 0.6, level)
  };
}

function calculateStability(level) {
  return {
    aimStability: lerp(0.5, 0.95, level),
    smoothing: lerp(0.2, 0.85, level),
    stickiness: lerp(0.1, 0.7, level),
    swayReduction: lerp(0.0, 0.9, level)
  };
}

function calculateRecoil(level) {
  return {
    verticalRecoil: lerp(1.0, 0.08, level),
    horizontalRecoil: lerp(0.6, 0.05, level),
    recoverySpeed: lerp(6, 20, level),
    recoilSmoothing: lerp(0.2, 0.9, level)
  };
}

function getConfig() {
  const p = getRange("precisionValue");
  const s = getRange("stabilityValue");
  const r = getRange("recoilValue");

  return {
    app: "ZXiter Trick",
    game: "Free Tire",
    package: "com.dts.freefiremax",
    precision: calculatePrecision(p),
    stability: calculateStability(s),
    recoil: calculateRecoil(r),
    raw: { p, s, r },
    timestamp: Date.now()
  };
}

function saveConfig() {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(getConfig()));
  alert("Configuração salva");
}

function exportConfig() {
  const data = JSON.stringify(getConfig(), null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "zxiter_trick_free_tire_config.json";
  a.click();

  URL.revokeObjectURL(url);
}

window.addEventListener("load", () => {
  const saved = localStorage.getItem(CONFIG_KEY);
  if (!saved) return;
  const cfg = JSON.parse(saved);
  document.getElementById("precisionValue").value = cfg.raw.p * 100;
  document.getElementById("stabilityValue").value = cfg.raw.s * 100;
  document.getElementById("recoilValue").value = cfg.raw.r * 100;
});
