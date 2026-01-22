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
  sensitivity: { x: 50, y: 50, z: 50 },
  power: {
    snap: true,
    smoothing: 0.98,
    headBias: 1.0
  }
};

document.addEventListener("DOMContentLoaded", () => {

  const sensX = document.getElementById("sensX");
  const sensY = document.getElementById("sensY");
  const sensZ = document.getElementById("sensZ");
  const target = document.getElementById("target");

  /* ---------- ABAS ---------- */
  document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".content").forEach(c => c.classList.remove("active"));

      tab.classList.add("active");
      document.getElementById(tab.dataset.tab).classList.add("active");
    });
  });

  /* ---------- BOTÕES ---------- */
  document.getElementById("apply").onclick = applyConfig;
  document.getElementById("reset").onclick = resetConfig;
  document.getElementById("export").onclick = exportConfig;
  document.getElementById("downloadData").onclick = downloadConnect;

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

    Engine.target = target.value;
    Engine.sensitivity = {
      x: +sensX.value,
      y: +sensY.value,
      z: +sensZ.value
    };

    simulateEngine();
  }

  // ========================
  // SIMULAÇÃO “FORTE”
  // ========================
  function simulateEngine() {
    console.clear();
    console.log("🔥 ZXiter Engine ATIVO (SIMULADO)");
    console.table(Engine);

    if (Engine.aimAssist) console.log(`🎯 Aim Assist FORTE | Intensidade ${Engine.sensitivity.z}`);
    if (Engine.aimLock) console.log(`🔒 Aim Lock rígido em ${Engine.target}`);
    if (Engine.aimbot) console.log(`🤖 Aimbot lógico | Prioridade ${Engine.target}`);
    if (Engine.recoilControl) console.log("🧱 Recuo virtualmente zerado");
  }

  // ========================
  // RESET
  // ========================
  function resetConfig() {
    document.querySelectorAll("input").forEach(i => {
      if (i.type === "checkbox") i.checked = false;
      if (i.type === "number") i.value = 50;
    });
    target.value = "head";
    console.clear();
  }

  // ========================
  // EXPORTAR CONFIG (PARA SEU JOGO)
  // ========================
  function exportConfig() {
    const blob = new Blob(
      [JSON.stringify(Engine, null, 2)],
      { type: "application/json" }
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "zxiter-engine.json";
    a.click();
  }

  // ========================
  // DOWNLOAD CONNECT
  // ========================
  async function downloadConnect() {
    const zip = new JSZip();
    zip.file(
      "Android/data/seu.jogo/files/zxiter/engine.json",
      JSON.stringify(Engine, null, 2)
    );
    zip.file(
      "Android/data/seu.jogo/files/zxiter/readme.txt",
      "Arquivo para leitura via persistentDataPath"
    );

    const blob = await zip.generateAsync({ type: "blob" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
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

});
