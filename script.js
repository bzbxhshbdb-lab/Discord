console.log("ZXITER SCRIPT CARREGADO");

window.addEventListener("load", () => {

  const $ = id => document.getElementById(id);

  const applyBtn = $("apply");
  const resetBtn = $("reset");
  const exportBtn = $("export");
  const downloadBtn = $("downloadData");

  if (!applyBtn || !resetBtn || !exportBtn || !downloadBtn) {
    alert("❌ ERRO: Botões não encontrados no DOM");
    return;
  }

  function collectConfig() {
    const checks = {};
    document.querySelectorAll("input[type=checkbox]").forEach(c => {
      checks[c.dataset.key] = c.checked;
    });

    return {
      checks,
      sensitivity: {
        x: Number($("sensX").value),
        y: Number($("sensY").value),
        z: Number($("sensZ").value)
      },
      target: $("target").value
    };
  }

  applyBtn.onclick = () => {
    localStorage.setItem("zxiter_config", JSON.stringify(collectConfig()));
    alert("✅ Configurações aplicadas");
  };

  resetBtn.onclick = () => {
    document.querySelectorAll("input[type=checkbox]").forEach(c => c.checked = false);
    $("sensX").value = 50;
    $("sensY").value = 50;
    $("sensZ").value = 50;
    $("target").value = "head";
    localStorage.removeItem("zxiter_config");
    alert("♻️ Resetado");
  };

  exportBtn.onclick = () => {
    const blob = new Blob(
      [JSON.stringify(collectConfig(), null, 2)],
      { type: "application/json" }
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "zxiter-config.json";
    a.click();
  };

  downloadBtn.onclick = async () => {
    const zip = new JSZip();
    zip.file("config.json", JSON.stringify(collectConfig(), null, 2));
    zip.file("readme.txt", "ZXiter Connect");

    const content = await zip.generateAsync({ type: "blob" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(content);
    a.download = "ZXiter-Connect.zip";
    a.click();
  };

});
