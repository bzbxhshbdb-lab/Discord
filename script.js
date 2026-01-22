document.addEventListener("DOMContentLoaded", () => {

  /* ========= ABAS ========= */
  document.querySelectorAll(".tab").forEach(tab => {
    tab.onclick = () => {
      document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".content").forEach(c => c.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById(tab.dataset.tab).classList.add("active");
    };
  });

  /* ========= COLETAR CONFIG (CONNECT REAL) ========= */
  function collectConfig() {
    const get = k => {
      const el = document.querySelector(`[data-key="${k}"]`);
      return el ? el.checked : false;
    };

    return {
      meta: {
        name: "ZXiterConnect",
        version: 1,
        platform: "ANDROID",
        engine: "UNITY"
      },

      aim: {
        enabled: get("aimAssist") || get("aimbot") || get("aimLock"),
        aimbot: get("aimbot"),
        aimLock: get("aimLock"),
        assist: get("aimAssist"),
        target: target.value, // head / neck / body
        headshotForce: 1.0,
        snap: true,
        smoothing: 0.95
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

  /* ========= APPLY (APENAS ESTADO LOCAL) ========= */
  apply.onclick = () => {
    const cfg = collectConfig();
    window.__ZXITER_STATE__ = cfg;
  };

  /* ========= RESET ========= */
  reset.onclick = () => {
    document.querySelectorAll("input").forEach(i => {
      if (i.type === "checkbox") i.checked = false;
      if (i.type === "number") i.value = 50;
    });
    target.value = "head";
  };

  /* ========= EXPORT JSON ========= */
  export.onclick = () => {
    const blob = new Blob(
      [JSON.stringify(collectConfig(), null, 2)],
      { type: "application/json" }
    );

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "zxiter.connect.json";
    a.click();
  };

  /* ========= DOWNLOAD CONNECT (FORMATO UNITY) ========= */
  downloadData.onclick = async () => {
    const zip = new JSZip();
    const config = collectConfig();

    zip.file(
      "Android/data/com.seujogo/files/zxiter/connect.json",
      JSON.stringify(config, null, 2)
    );

    zip.file(
      "Android/data/com.seujogo/files/zxiter/readme.txt",
      "Arquivo Connect para leitura direta no Unity (persistentDataPath)"
    );

    const blob = await zip.generateAsync({ type: "blob" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "ZXiter-Connect-Unity.zip";
    a.click();
  };

});
