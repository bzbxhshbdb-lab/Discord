const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());

const INPUT = "./data/connect/config.json";

// ===== FUNÇÃO DE MELHORIA =====
function optimizeEngine(engine) {
  if (!engine) return null;

  // garante full HS controlado
  if (engine.precision) {
    engine.hitZoneMultiplier = 1.6;
    engine.errorMargin = 0;
  }

  // normaliza sensibilidade
  engine.sensitivity.x = Math.min(engine.sensitivity.x, 95);
  engine.sensitivity.y = Math.min(engine.sensitivity.y, 95);
  engine.sensitivity.z = Math.min(engine.sensitivity.z, 95);

  // recoil ultra estável
  if (engine.recoilControl) {
    engine.recoilFactor = 0.05;
    engine.spread = 0;
  }

  // aim assist inteligente
  if (engine.aimAssist && !engine.aimbot) {
    engine.assistStrength = 0.35;
  }

  // aimlock seguro
  if (engine.aimLock) {
    engine.lockSpeed = 1.0;
  }

  engine.serverValidated = true;
  engine.timestamp = Date.now();

  return engine;
}

// ===== JOGO CONSULTA =====
app.get("/engine", (req, res) => {
  if (!fs.existsSync(INPUT)) {
    return res.json({});
  }

  const raw = fs.readFileSync(INPUT);
  const engine = JSON.parse(raw);

  const optimized = optimizeEngine(engine);
  res.json(optimized);
});

app.listen(3000, () => {
  console.log("🟢 Servidor ZXiter ativo (porta 3000)");
});
