document.addEventListener("DOMContentLoaded", () => {

  // BOTÕES
  const applyBtn = document.getElementById("apply");
  const downloadBtn = document.getElementById("downloadData");
  const exportBtn = document.getElementById("export");
  const resetBtn = document.getElementById("reset");

  if (!applyBtn || !downloadBtn || !exportBtn || !resetBtn) {
    console.error("❌ Erro: Botões não encontrados");
    return;
  }

  // APLICAR CONFIG
  applyBtn.addEventListener("click", () => {
    alert("✅ Configurações aplicadas com sucesso!");
  });

  // DOWNLOAD CONNECT
  downloadBtn.addEventListener("click", () => {
    const content = "ZXiter Connect\nStatus: Ativo";
    const blob = new Blob([content], { type: "text/plain" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "connect.txt";
    link.click();

    URL.revokeObjectURL(link.href);
  });

  // EXPORTAR CONFIG
  exportBtn.addEventListener("click", () => {
    const config = {};

    document.querySelectorAll("input[type='checkbox']").forEach(cb => {
      config[cb.dataset.key] = cb.checked;
    });

    config.sensX = document.getElementById("sensX").value;
    config.sensY = document.getElementById("sensY").value;
    config.sensZ = document.getElementById("sensZ").value;
    config.target = document.getElementById("target").value;

    const blob = new Blob(
      [JSON.stringify(config, null, 2)],
      { type: "application/json" }
    );

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "config.json";
    link.click();

    URL.revokeObjectURL(link.href);
  });

  // RESETAR PAINEL
  resetBtn.addEventListener("click", () => {
    document.querySelectorAll("input").forEach(input => {
      if (input.type === "checkbox") input.checked = false;
      if (input.type === "number") input.value = 50;
    });

    document.getElementById("target").value = "head";
    alert("♻️ Painel resetado");
  });

  // ABAS
  document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".content").forEach(c => c.classList.remove("active"));

      tab.classList.add("active");
      document.getElementById(tab.dataset.tab).classList.add("active");
    });
  });

});
