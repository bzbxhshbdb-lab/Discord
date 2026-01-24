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
  });

  // -------- BOTÕES --------
  document.getElementById("apply").addEventListener("click", applyConfig);
  document.getElementById("reset").addEventListener("click", resetConfig);
  document.getElementById("export").addEventListener("click", exportConfig);
  document.getElementById("downloadData").addEventListener("click", downloadConnect);
});

// ========================
// HELPERS
// ========================
function getCheck(key) {
  const el = document.querySelector(`[data-key="${key}"]`);
  return el ? el.checked : false;
}

// ========================
// APPLY
// ========================
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
  target.value = "head";

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

// ========================
// METERS
// ========================
function updateMeters() {
  let hs = 0;

  if (Engine.aimbot) hs += 40;
  if (Engine.aimLock) hs += 30;
  if (Engine.aimAssist) hs += 20;
  if (Engine.target === "head") hs += 10;

  hs = Math.min(hs, 100);

  document.getElementById("hsMeter").style.width = hs + "%";
}

// ========================
// PRESETS
// ========================
function preset(mode) {
  const map = {
    safe: { aimAssist: true, aimLock: false, aimbot: false, sens: 45 },
    pro: { aimAssist: true, aimLock: true, aimbot: false, sens: 65 },
    insane: { aimAssist: true, aimLock: true, aimbot: true, sens: 90 }
  };

  const p = map[mode];
  if (!p) return;

  document.querySelector('[data-key="aimAssist"]').checked = p.aimAssist;
  document.querySelector('[data-key="aimLock"]').checked = p.aimLock;
  document.querySelector('[data-key="aimbot"]').checked = p.aimbot;

  sensX.value = sensY.value = sensZ.value = p.sens;
  target.value = "head";

  applyConfig();
}
// ========================
// MOTOR DE COMBATE
// ========================

// ===== TARGET =====
function getTargetPoint(enemy) {
  if (!enemy) return null;

  if (Engine.target === "head" && enemy.bones?.head) return enemy.bones.head;
  if (Engine.target === "neck" && enemy.bones?.neck) return enemy.bones.neck;

  return enemy.center;
}

// ===== AIM ASSIST =====
function runAimAssist(player, enemy) {
  if (!Engine.aimAssist || !enemy) return;

  const target = getTargetPoint(enemy);
  if (!target) return;

  const assist = Engine.stability ? 0.35 : 0.25;

  player.aim.x += (target.x - player.aim.x) * assist;
  player.aim.y += (target.y - player.aim.y) * assist;
}

// ===== AIMBOT =====
function runAimbot(player, enemy) {
  if (!Engine.aimbot || !enemy) return;

  const target = getTargetPoint(enemy);
  if (!target) return;

  const dx = target.x - player.aim.x;
  const dy = target.y - player.aim.y;

  const strength = Engine.precision ? 1.0 : 0.9;

  player.aim.x += dx * strength;
  player.aim.y += dy * strength;
}

// ===== AIM LOCK =====
function runAimLock(player, enemy) {
  if (!Engine.aimLock || !enemy) return;

  const target = getTargetPoint(enemy);
  if (!target) return;

  player.aim.x = target.x;
  player.aim.y = target.y;
}

// ===== CONTROLE DE RECUO =====
function applyRecoilControl(weapon) {
  if (!Engine.recoilControl || !weapon) return;

  weapon.recoil.x *= 0.05;
  weapon.recoil.y *= 0.05;

  if (Engine.precision) {
    weapon.spread = 0;
  }
}

// ===== ESTABILIDADE =====
function applyStability(player) {
  if (!Engine.stability) return;

  player.shake *= 0.1;
  player.sway  *= 0.1;
}

// ===== PRECISÃO / FULL HS =====
function applyPrecision(player) {
  if (!Engine.precision) return;

  player.errorMargin = 0;

  if (Engine.target === "head") {
    player.hitZoneMultiplier = 1.6; // HS quase garantido
  } else if (Engine.target === "neck") {
    player.hitZoneMultiplier = 1.4;
  }
}

// ===== GAME LOOP =====
function gameTick(player, enemy, weapon) {
  runAimAssist(player, enemy);
  runAimbot(player, enemy);
  runAimLock(player, enemy);

  applyRecoilControl(weapon);
  applyStability(player);
  applyPrecision(player);
}
