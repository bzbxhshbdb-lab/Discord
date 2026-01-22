// =======================
// ABAS (FUNCIONA COM DEFER)
// =======================
const tabs = document.querySelectorAll(".tab");
const contents = document.querySelectorAll(".content");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    contents.forEach(c => c.classList.remove("active"));

    tab.classList.add("active");
    const target = document.getElementById(tab.dataset.tab);
    if (target) target.classList.add("active");
  });
});

// =======================
// BOTÕES
// =======================
document.getElementById("apply").onclick = () => {
  alert("✅ Configurações aplicadas!");
};

document.getElementById("reset").onclick = () => {
  document.querySelectorAll("input[type=checkbox]").forEach(c => c.checked = false);
  document.querySelectorAll("input[type=number]").forEach(n => n.value = 50);
  document.getElementById("target").value = "head";
  alert("♻️ Resetado!");
};

document.getElementById("export").onclick = () => {
  const config = { ok: true };
  const blob = new Blob([JSON.stringify(config)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "config.json";
  a.click();
};

document.getElementById("downloadData").onclick = async () => {
  const zip = new JSZip();
  zip.file("connect/readme.txt", "ZXiter Connect OK");

  const blob = await zip.generateAsync({ type: "blob" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "ZXiter-Connect.zip";
  a.click();
};
