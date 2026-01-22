document.addEventListener("DOMContentLoaded", () => {

  /* ========================
     REFERÊNCIAS
  ======================== */
  const applyBtn = document.getElementById("apply");
  const resetBtn = document.getElementById("reset");
  const exportBtn = document.getElementById("export");
  const downloadBtn = document.getElementById("downloadData");

  const sensX = document.getElementById("sensX");
  const sensY = document.getElementById("sensY");
  const sensZ = document.getElementById("sensZ");
  const target = document.getElementById("target");

  /* ========================
     ABAS
  ======================== */
  document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".content").forEach(c => c.classList.remove("active"));

      tab.classList.add("active");
      document.getElementById(tab.dataset.tab).classList.add("active");
    });
  });

  /* ========================
     COLETAR CONFIG
  ======================== */
  function collectConfig() {
    const checks = {};

    document.querySelectorAll("input[type=checkbox]").forEach(c => {
      checks[c.dataset.key] = c.checked;
    });

    return {
      version: "1.1",
      aim: {
        mode: "FULL_HEADSHOT",
        target: "head",
        aimbot: checks.aimbot || false,
        aimLock: checks.aimLock || false,
        assist: checks.aimAssist || false,
        snap: true,
        smoothing: 1.0,
        headWeight: 1.0
      },
      recoil: {
        enabled: checks.recoilZero || false,
        strength: 0
      },
      sensitivity: {
        x: Number(sensX.value),
        y: Number(sensY.value),
        z: Number(sensZ.value)
      },
      system: {
        fpsBoost: checks.fpsBoost || false,
        antilag: checks.antilag || false,
        lowLatency: checks.lowLatency || false,
        debug: checks.debug || false
      }
    };
  }

  /* ========================
     APPLY
  ======================== */
  applyBtn.addEventListener("click", () => {
    const cfg = collectConfig();
    localStorage.setItem("zxiter_config", JSON.stringify(cfg));
    alert("✅ Configurações aplicadas");
  });

  /* ========================
     RESET
  ======================== */
  resetBtn.addEventListener("click", () => {
    document.querySelectorAll("input[type=checkbox]").forEach(c => c.checked = false);
    sensX.value = 50;
    sensY.value = 50;
    sensZ.value = 50;
    target.value = "head";
    localStorage.removeItem("zxiter_config");
    alert("♻️ Painel resetado");
  });

  /* ========================
     EXPORTAR CONFIG
  ======================== */
  exportBtn.addEventListener("click", () => {
    const blob = new Blob(
      [JSON.stringify(collectConfig(), null, 2)],
      { type: "application/json" }
    );

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "zxiter-config.json";
    a.click();
  });

  /* ========================
     DOWNLOAD CONNECT
  ======================== */
  downloadBtn.addEventListener("click", async () => {
    const zip = new JSZip();
    zip.file("connect/config.json", JSON.stringify(collectConfig(), null, 2));
    zip.file("connect/readme.txt", "ZXiter Connect - Unity Engine");

    const content = await zip.generateAsync({ type: "blob" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(content);
    a.download = "ZXiter-Connect.zip";
    a.click();
  });

  /* ========================
     LOAD CONFIG
  ======================== */
  const saved = localStorage.getItem("zxiter_config");
  if (saved) {
    const cfg = JSON.parse(saved);

    document.querySelectorAll("input[type=checkbox]").forEach(c => {
      c.checked = cfg.system?.[c.dataset.key] || false;
    });

    sensX.value = cfg.sensitivity.x;
    sensY.value = cfg.sensitivity.y;
    sensZ.value = cfg.sensitivity.z;
    target.value = "head";
  }

});
