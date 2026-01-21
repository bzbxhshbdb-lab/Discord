// ---------- ABAS ----------
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".content").forEach(c => c.classList.remove("active"));

    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
  });
});

// ---------- APLICAR ----------
const applyBtn = document.getElementById("apply");
if (applyBtn) {
  applyBtn.addEventListener("click", () => {
    alert("✅ Configurações aplicadas com sucesso!");
  });
}

// ---------- RESET ----------
const resetBtn = document.getElementById("reset");
if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    document.querySelectorAll("input[type='checkbox']").forEach(c => c.checked = false);
    document.querySelectorAll("input[type='number']").forEach(n => n.value = 50);
    document.getElementById("target").value = "head";
    alert("♻️ Painel resetado!");
  });
}

// ---------- EXPORTAR CONFIG ----------
const exportBtn = document.getElementById("export");
if (exportBtn) {
  exportBtn.addEventListener("click", () => {
    const config = {
      checks: {},
      sensitivity: {
        x: sensX.value,
        y: sensY.value,
        z: sensZ.value
      },
      target: target.value
    };

    document.querySelectorAll("input[type='checkbox']").forEach(c => {
      config.checks[c.dataset.key] = c.checked;
    });

    const blob = new Blob(
      [JSON.stringify(config, null, 2)],
      { type: "application/json" }
    );

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "zxiter-config.json";
    a.click();

    alert("📦 Configuração exportada!");
  });
}

// ---------- DOWNLOAD CONNECT ----------
const downloadBtn = document.getElementById("downloadData");
if (downloadBtn) {
  downloadBtn.addEventListener("click", async () => {
    const zip = new JSZip();

    zip.file("connect/readme.txt", "ZXiter Trick - Connect ativo");
    zip.file("connect/config.txt", "Configuração base aplicada");

    const content = await zip.generateAsync({ type: "blob" });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(content);
    a.download = "ZXiter-Connect.zip";
    a.click();

    alert("⬇️ Connect baixado com sucesso!");
  });
}
