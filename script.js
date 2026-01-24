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

// ========================
// DOM READY
// ========================
document.addEventListener("DOMContentLoaded", () => {

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
// APLICAR CONFIG
// ========================
function applyConfig() {
  Engine.aimAssist = getCheck("aimAssist");
  Engine.aimLock = getCheck("aimLock");
  Engine.aimbot = getCheck("aimbot");
  Engine.recoilControl = getCheck("recoilControl");
  Engine.stability = getCheck("weaponStability");
  Engine.precision = getCheck("dynamicPrecision");

  Engine.target = document.getElementById("target").value;

  Engine.sensitivity.x = Number(sensX.value);
  Engine.sensitivity.y = Number(sensY.value);
  Engine.sensitivity.z = Number(sensZ.value);

  console.clear();
  console.log("🔥 ZXiter Engine Ativo");
  console.table(Engine);

  if (Engine.aimAssist) console.log(`🎯 Aim Assist ativo | Força ${Engine.sensitivity.z}`);
  if (Engine.aimLock) console.log(`🔒 Aim Lock travado em ${Engine.target}`);
  if (Engine.aimbot) console.log(`🤖 Aimbot ativo (${Engine.target})`);
  if (Engine.recoilControl) console.log("🧱 Recuo zerado");

  updateMeters();

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

// ========================
// HELPER
// ========================
function getCheck(key) {
  const el = document.querySelector(`input[data-key="${key}"]`);
  return el ? el.checked : false;
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
  if (hs > 100) hs = 100;

  // ===== OTIMIZAÇÃO =====
  if (getCheck("fpsBoost")) opt += 30;
  if (getCheck("antilag")) opt += 25;
  if (getCheck("lowLatency")) opt += 25;
  if (getCheck("reduceDelay")) opt += 20;
  if (opt > 100) opt = 100;

  // ===== SENSIBILIDADE =====
  sens = Math.round(
    (Engine.sensitivity.x +
     Engine.sensitivity.y +
     Engine.sensitivity.z) / 3
  );

  // Aplicar visual
  hsMeter.style.width = hs + "%";
  optMeter.style.width = opt + "%";
  sensMeter.style.width = sens + "%";

  hsValue.innerText = hs + "%";
  optValue.innerText = opt + "%";
  sensValue.innerText = sens + "%";
}
