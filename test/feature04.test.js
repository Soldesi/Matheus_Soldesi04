// Testes da Feature 04 – Conversor de temperatura
// Execute com: node --test test/feature04.test.js
const test = require("node:test");
const assert = require("node:assert/strict");
const feature = require("../src/features/feature04");

// 1) Caso típico
test("converte Celsius para Fahrenheit (25 °C → 77 °F)", () => {
  assert.equal(feature.execute({ valor: 25, origem: "C", destino: "F" }).resultado, 77);
});

test("converte Fahrenheit para Celsius (32 °F → 0 °C)", () => {
  assert.equal(feature.execute({ valor: 32, origem: "F", destino: "C" }).resultado, 0);
});

// 2) Limites / fronteira
test("aceita temperatura negativa (-40 °C = -40 °F)", () => {
  assert.equal(feature.execute({ valor: -40, origem: "C", destino: "F" }).resultado, -40);
  assert.equal(feature.execute({ valor: -40, origem: "F", destino: "C" }).resultado, -40);
});

test("aceita zero e arredonda a 2 casas", () => {
  assert.equal(feature.execute({ valor: 0, origem: "C", destino: "F" }).resultado, 32);
  assert.equal(feature.execute({ valor: 100, origem: "F", destino: "C" }).resultado, 37.78);
});

test("retorna objeto com a propriedade resultado e não altera a entrada", () => {
  const entrada = Object.freeze({ valor: 25, origem: "C", destino: "F" });
  const saida = feature.execute(entrada);
  assert.deepEqual(saida, { resultado: 77 });
});

// 3) Entradas inválidas
test("rejeita unidade inválida", () => {
  assert.throws(() => feature.execute({ valor: 20, origem: "X", destino: "F" }), { name: "Error" });
  assert.throws(() => feature.execute({ valor: 20, origem: "C", destino: "K" }), { name: "Error" });
});

test("rejeita origem igual ao destino", () => {
  assert.throws(() => feature.execute({ valor: 20, origem: "C", destino: "C" }), { name: "Error" });
});

test("rejeita valor textual, ausente ou não finito", () => {
  for (const input of [
    { valor: "20", origem: "C", destino: "F" },
    { origem: "C", destino: "F" },
    { valor: NaN, origem: "C", destino: "F" },
    { valor: Infinity, origem: "C", destino: "F" },
    { valor: null, origem: "C", destino: "F" }
  ]) {
    assert.throws(() => feature.execute(input), { name: "Error" });
  }
});

test("rejeita entrada ausente ou não objeto", () => {
  for (const input of [undefined, null, "25", 25]) {
    assert.throws(() => feature.execute(input), { name: "Error" });
  }
});
