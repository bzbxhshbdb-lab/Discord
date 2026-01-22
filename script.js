document.addEventListener("DOMContentLoaded", () => {

  /* ---------- ABAS ---------- */
  document.querySelectorAll(".tab").forEach(tab => {
    tab.onclick = () => {
      document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".content").forEach(c => c.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById(tab.dataset.tab).classList.add("active");
    };
  });

  /* ---------- COLETAR CONFIG ---------- */
  function collectConfig() {
    const checks = {};
    document.querySelectorAll("input[type=checkbox]").forEach(c => {
      checks[c.dataset.key] = c.checked;
    });

    return {
      version: "1.0",
      aim: {
        mode: "HEAD_ONLY",
        aimbot: checks.aimbot,
        aimLock: checks.aimLock,
        assist: checks.aimAssist,
        headWeight: 1.0,
        smoothing: 0.95,
        snap: true
      },
      recoil: {
        enabled: checks.recoilZero,
        strength: 0.0
      },
      sensitivity: {
        x: Number(sensX.value),
        y: Number(sensY.value),
        z: Number(sensZ.value)
      },
      system: {
        fpsBoost: checks.fpsBoost,
        antilag: checks.antilag,
        lowLatency: checks.lowLatency,
        debug: checks.debug
      },
      target: target.value
    };
  }

  /* ---------- APPLY ---------- */
  apply.onclick = () => {
    const cfg = collectConfig();
    localStorage.setItem("zxiter_config", JSON.stringify(cfg));
    alert("✅ Config aplicada");
  };

  /* ---------- RESET ---------- */
  reset.onclick = () => {
    document.querySelectorAll("input").forEach(i => {
      if (i.type === "checkbox") i.checked = false;
      if (i.type === "number") i.value = 50;
    });
    target.value = "head";
    localStorage.removeItem("zxiter_config");
    alert("♻️ Resetado");
  };

  /* ---------- EXPORT ---------- */
  export.onclick = () => {
    const blob = new Blob(
      [JSON.stringify(collectConfig(), null, 2)],
      { type: "application/json" }
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "zxiter-config.json";
    a.click();
  };

  /* ---------- DOWNLOAD CONNECT ---------- */
  downloadData.onclick = async () => {
    const zip = new JSZip();
    zip.file("data/connect/config.json", JSON.stringify(collectConfig(), null, 2));
    zip.file("data/connect/readme.txt", "ZXiter Connect - Unity");

    const blob = await zip.generateAsync({ type: "blob" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "ZXiter-Connect.zip";
    a.click();
  };

  /* ---------- LOAD ---------- */
  const saved = localStorage.getItem("zxiter_config");
  if (saved) {
    const cfg = JSON.parse(saved);
    Object.keys(cfg.system || {}).forEach(k => {
      const el = document.querySelector(`[data-key="${k}"]`);
      if (el) el.checked = cfg.system[k];
    });
    sensX.value = cfg.sensitivity.x;
    sensY.value = cfg.sensitivity.y;
    sensZ.value = cfg.sensitivity.z;
    target.value = cfg.target;
  }

});
