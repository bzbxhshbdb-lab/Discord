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
