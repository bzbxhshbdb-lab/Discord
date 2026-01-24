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
  try {
    Engine.aimAssist = getCheck("aimAssist");
    Engine.aimLock = getCheck("aimLock");
    Engine.aimbot = getCheck("aimbot");
    Engine.recoilControl = getCheck("recoilControl");
    Engine.stability = getCheck("weaponStability");
    Engine.precision = getCheck("dynamicPrecision");

    Engine.target = document.getElementById("target")?.value || "neck";

    Engine.sensitivity.x = Number(sensX?.value || 0);
    Engine.sensitivity.y = Number(sensY?.value || 0);
    Engine.sensitivity.z = Number(sensZ?.value || 0);

    console.clear();
    console.log("🔥 ZXiter Engine Ativo");
    console.table(Engine);

    alert("✅ Configurações aplicadas");
  } catch (e) {
    console.error("❌ Erro no Apply:", e);
    alert("Erro ao aplicar config (veja o console)");
  }
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

  // ===== ATUALIZAR UI =====
  setMeter("hsMeter", "hsValue", hs);
  setMeter("optMeter", "optValue", opt);
  setMeter("sensMeter", "sensValue", sens);
}
function setMeter(barId, textId, value) {
  const bar = document.getElementById(barId);
  const text = document.getElementById(textId);

  bar.style.width = value + "%";
  text.innerText = value + "%";

  bar.classList.remove("low", "mid", "high");
  if (value < 40) bar.classList.add("low");
  else if (value < 75) bar.classList.add("mid");
  else bar.classList.add("high");
}
function preset(mode) {
  const map = {
    safe: {
      aimAssist: true,
      aimLock: false,
      aimbot: false,
      sens: 45
    },
    pro: {
      aimAssist: true,
      aimLock: true,
      aimbot: false,
      sens: 65
    },
    insane: {
      aimAssist: true,
      aimLock: true,
      aimbot: true,
      sens: 90
    }
  };

  const p = map[mode];

  document.querySelector('[data-key="aimAssist"]').checked = p.aimAssist;
  document.querySelector('[data-key="aimLock"]').checked = p.aimLock;
  document.querySelector('[data-key="aimbot"]').checked = p.aimbot;

  sensX.value = sensY.value = sensZ.value = p.sens;
  target.value = "head";

  applyConfig();
}
