// Funcionalidade 04: Conversor de temperatura.
// Objetivo: Converte Celsius para Fahrenheit e Fahrenheit para Celsius.
// Exemplo de entrada: { valor: 25, origem: 'C', destino: 'F' }
//
// Decisões técnicas:
// - Unidades aceitas: 'C' e 'F' (exatamente, maiúsculas). Origem e destino devem ser diferentes.
// - Sem limite físico (ex.: zero absoluto), pois o enunciado não pede.
// - Arredondamento: resultado com 2 casas decimais (toFixed(2)).

const implemented = true;

const UNIDADES = ["C", "F"];

function execute(input) {
  if (input === null || typeof input !== "object") {
    throw new Error("Informe um objeto com valor, origem e destino.");
  }

  const { valor, origem, destino } = input;

  if (typeof valor !== "number" || !Number.isFinite(valor)) {
    throw new Error("O campo valor deve ser um número finito.");
  }
  if (!UNIDADES.includes(origem) || !UNIDADES.includes(destino)) {
    throw new Error("Origem e destino devem ser 'C' ou 'F'.");
  }
  if (origem === destino) {
    throw new Error("Origem e destino devem ser unidades diferentes.");
  }

  const resultado = origem === "C" ? (valor * 9) / 5 + 32 : ((valor - 32) * 5) / 9;

  // Number(...) remove o "-0" e mantém o retorno como número serializável.
  return { resultado: Number(resultado.toFixed(2)) + 0 };
}

// Mantém o contrato de integração utilizado pela API central.
module.exports = {
  id: 4,
  name: "Conversor de temperatura",
  description: "Converte Celsius para Fahrenheit e Fahrenheit para Celsius.",
  implemented,
  execute
};
