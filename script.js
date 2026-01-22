document.addEventListener("DOMContentLoaded", () => {

  /* ===== REFERÊNCIAS SEGURAS ===== */
  const btnApply = document.getElementById("apply");
  const btnReset = document.getElementById("reset");
  const btnExport = document.getElementById("export");
  const btnDownload = document.getElementById("downloadData");

  const sensX = document.getElementById("sensX");
  const sensY = document.getElementById("sensY");
  const sensZ = document.getElementById("sensZ");
  const target = document.getElementById("target");

  /* ===== ABAS (AGORA NÃO QUEBRA MAIS) ===== */
  document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".content").forEach(c => c.classList.remove("active"));

      tab.classList.add("active");
      document.getElementById(tab.dataset.tab).classList.add("active");
    });
  });

  /* ===== COLETAR CONFIG ===== */
  function collectConfig() {
    const get = key => {
      const el = document.querySelector(`input[data-key="${key}"]`);
      return el ? el.checked : false;
    };

    return {
      meta: {
        engine: "UNITY",
        platform: "ANDROID",
        version: 1
      },
      aim: {
        aimbot: get("aimbot"),
        aimLock: get("aimLock"),
        assist: get("aimAssist"),
        target: target.value,
        headshotForce: 1.0,
        smoothing: 0.95,
        snap: true
      },
      recoil: {
        enabled: get("recoilZero"),
        value: 0.0
      },
      sensitivity: {
        x: Number(sensX.value),
        y: Number(sensY.value),
        z: Number(sensZ.value)
      },
      system: {
        fpsBoost: get("fpsBoost"),
        antilag: get("antilag"),
        lowLatency: get("lowLatency"),
        debug: get("debug")
      }
    };
  }

  /* ===== APPLY ===== */
  btnApply.addEventListener("click", () => {
    window.__ZXITER_ENGINE__ = collectConfig();
    console.log("ZXiter aplicado", window.__ZXITER_ENGINE__);
  });

  /* ===== RESET ===== */
  btnReset.addEventListener("click", () => {
    document.querySelectorAll("input").forEach(i => {
      if (i.type === "checkbox") i.checked = false;
      if (i.type === "number") i.value = 50;
    });
    target.value = "head";
    console.clear();
  });

  /* ===== EXPORT ===== */
  btnExport.addEventListener("click", () => {
    const blob = new Blob(
      [JSON.stringify(collectConfig(), null, 2)],
      { type: "application/json" }
    );

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "zxiter.connect.json";
    a.click();
  });

  /* ===== DOWNLOAD CONNECT ===== */
  btnDownload.addEventListener("click", async () => {
    const zip = new JSZip();

    zip.file(
      "Android/data/com.seujogo/files/zxiter/connect.json",
      JSON.stringify(collectConfig(), null, 2)
    );

    zip.file(
      "Android/data/com.seujogo/files/zxiter/readme.txt",
      "Connect para leitura via persistentDataPath"
    );

    const blob = await zip.generateAsync({ type: "blob" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "ZXiter-Connect.zip";
    a.click();
  });

});
