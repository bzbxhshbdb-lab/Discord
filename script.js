
// ========================
// ESTADO DO SISTEMA
// ========================
const Engine = {
  aimAssist: false,
  aimLock: false,
  aimbot: false,
  recoilControl: false,
  stability: false,
  precision: false,
  target: "head",
  sensitivity: { x: 50, y: 50, z: 50 }
};

let sensX, sensY, sensZ, target;

// ========================
// DOM READY
// ========================
document.addEventListener("DOMContentLoaded", () => {

  // Inputs
  sensX = document.getElementById("sensX");
  sensY = document.getElementById("sensY");
  sensZ = document.getElementById("sensZ");
  target = document.getElementById("target");

  // -------- ABAS --------
  document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".content").forEach(c => c.classList.remove("active"));

      tab.classList.add("active");
      document.getElementById(tab.dataset.tab).classList.add("active");
    });
  function getCheck(key) {
  const el = document.querySelector(`[data-key="${key}"]`);
  return el ? el.checked : false;
  }

  // -------- BOTÕES --------
  document.getElementById("apply").addEventListener("click", applyConfig);
  document.getElementById("reset").addEventListener("click", resetConfig);
  document.getElementById("export").addEventListener("click", exportConfig);
  document.getElementById("downloadData").addEventListener("click", downloadConnect);
});
function applyConfig() {
  Engine.aimAssist = getCheck("aimAssist");
  Engine.aimLock = getCheck("aimLock");
  Engine.aimbot = getCheck("aimbot");
  Engine.recoilControl = getCheck("recoilControl");
  Engine.stability = getCheck("weaponStability");
  Engine.precision = getCheck("dynamicPrecision");

  Engine.target = target.value;

  Engine.sensitivity.x = Number(sensX.value);
  Engine.sensitivity.y = Number(sensY.value);
  Engine.sensitivity.z = Number(sensZ.value);

  updateMeters();

  console.clear();
  console.table(Engine);
  alert("✅ Configurações aplicadas");
}
// ========================
// RESET
// ========================
function resetConfig() {
  document.querySelectorAll("input[type=checkbox]").forEach(c => c.checked = false);
  document.querySelectorAll("input[type=number]").forEach(n => n.value = 50);
  document.getElementById("target").value = "head";

  console.clear();
  alert("♻️ Painel resetado");
}

// ========================
// EXPORTAR
// ========================
function exportConfig() {
  const blob = new Blob(
    [JSON.stringify(Engine, null, 2)],
    { type: "application/json" }
  );

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "zxiter-config.json";
  a.click();
}

// ========================
// DOWNLOAD CONNECT
// ========================
async function downloadConnect() {
  const zip = new JSZip();
  zip.file("data/connect/config.json", JSON.stringify(Engine, null, 2));
  zip.file("data/connect/readme.txt", "ZXiter Engine");

  const content = await zip.generateAsync({ type: "blob" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(content);
  a.download = "ZXiter-Connect.zip";
  a.click();
}

function updateMeters() {
  let hs = 0;
  let opt = 0;
  let sens = 0;

  // ===== HS =====
  if (Engine.aimbot) hs += 40;
  if (Engine.aimLock) hs += 30;
  if (Engine.aimAssist) hs += 20;
  if (Engine.target === "head") hs += 10;
  hs = Math.min(hs, 100);

  // ===== OTIMIZAÇÃO =====
  if (getCheck("fpsBoost")) opt += 25;
  if (getCheck("antilag")) opt += 20;
  if (getCheck("lowLatency")) opt += 20;
  if (getCheck("reduceDelay")) opt += 20;
  if (getCheck("pingBoost")) opt += 15;
  opt = Math.min(opt, 100);

  // ===== SENSIBILIDADE =====
  sens = Math.round(
    (Engine.sensitivity.x +
     Engine.sensitivity.y +
     Engine.sensitivity.z) / 3
  );

  function preset(mode) {
  const map = {
    safe: { aimAssist: true, aimLock: false, aimbot: false, sens: 45 },
    pro: { aimAssist: true, aimLock: true, aimbot: false, sens: 65 },
    insane: { aimAssist: true, aimLock: true, aimbot: true, sens: 90 }
  };

  const p = map[mode];

  document.querySelector('[data-key="aimAssist"]').checked = p.aimAssist;
  document.querySelector('[data-key="aimLock"]').checked = p.aimLock;
  document.querySelector('[data-key="aimbot"]').checked = p.aimbot;

  sensX.value = sensY.value = sensZ.value = p.sens;
  target.value = "head";

  applyConfig();
  }
function runAimbot(player, enemy) {
  if (!Engine.aimbot || !enemy) return;

  const targetPos = getTargetPoint(enemy);
  const delta = {
    x: targetPos.x - player.aim.x,
    y: targetPos.y - player.aim.y
  };

  const strength = Engine.precision ? 1.0 : 0.85;

  player.aim.x += delta.x * strength;
  player.aim.y += delta.y * strength;
}
  function runAimAssist(player, enemy) {
  if (!Engine.aimAssist || !enemy) return;

  const targetPos = getTargetPoint(enemy);
  const assist = 0.15 + (Engine.stability ? 0.1 : 0);

  player.aim.x += (targetPos.x - player.aim.x) * assist;
  player.aim.y += (targetPos.y - player.aim.y) * assist;
  }
  function runAimLock(player, enemy) {
  if (!Engine.aimLock || !enemy) return;

  const lockPoint = getTargetPoint(enemy);
  player.aim.x = lockPoint.x;
  player.aim.y = lockPoint.y;
  }
  function applyRecoilControl(weapon) {
  if (!Engine.recoilControl) return;

  weapon.recoil.x *= 0.05;
  weapon.recoil.y *= 0.05;

  if (Engine.precision) {
    weapon.spread = 0;
  }
  }
  function applyStability(player) {
  if (!Engine.stability) return;

  player.shake *= 0.1;
  player.sway  *= 0.1;
  }
  function applyPrecision(player) {
  if (!Engine.precision) return;

  player.errorMargin = 0;

  if (Engine.target === "head") {
    player.hitZoneMultiplier = 1.5;
  } else if (Engine.target === "neck") {
    player.hitZoneMultiplier = 1.3;
  }
    }
  function getTargetPoint(enemy) {
  if (Engine.target === "head") return enemy.bones.head;
  if (Engine.target === "neck") return enemy.bones.neck;
  return enemy.center;
  }
  function gameTick(player, enemy, weapon) {
  runAimAssist(player, enemy);
  runAimbot(player, enemy);
  runAimLock(player, enemy);

  applyRecoilControl(weapon);
  applyStability(player);
  applyPrecision(player);
  }
