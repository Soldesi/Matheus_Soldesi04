// Smoke test real: sobe o servidor, consulta /health, /api/features e a Feature 04.
const { spawn } = require("node:child_process");
const assert = require("node:assert/strict");

const PORT = process.env.SMOKE_PORT || "3100";
const BASE = `http://localhost:${PORT}`;

async function esperarServidor(tentativas = 30) {
  for (let i = 0; i < tentativas; i++) {
    try {
      const r = await fetch(`${BASE}/health`);
      if (r.ok) return;
    } catch { /* servidor ainda subindo */ }
    await new Promise((res) => setTimeout(res, 200));
  }
  throw new Error("Servidor não respondeu em /health.");
}

async function main() {
  const servidor = spawn(process.execPath, ["src/server.js"], {
    env: { ...process.env, PORT },
    stdio: "ignore"
  });
  try {
    await esperarServidor();

    const health = await (await fetch(`${BASE}/health`)).json();
    assert.equal(health.status, "ok");

    const lista = await (await fetch(`${BASE}/api/features`)).json();
    const itens = lista.items;
    const f04 = itens.find((f) => f.id === 4);
    assert.ok(f04, "Feature 04 não listada");
    assert.equal(f04.implemented, true);

    const ok = await fetch(`${BASE}/api/features/4`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ valor: 25, origem: "C", destino: "F" })
    });
    assert.equal(ok.status, 200);
    assert.equal((await ok.json()).result.resultado, 77);

    const ruim = await fetch(`${BASE}/api/features/4`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ valor: 25, origem: "C", destino: "C" })
    });
    assert.equal(ruim.status, 400);

    console.log("Smoke test OK");
  } finally {
    servidor.kill();
  }
}

main().catch((e) => { console.error("Smoke test FALHOU:", e.message); process.exit(1); });
