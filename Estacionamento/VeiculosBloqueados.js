export default class VeiculosBloqueados {
  #veiculosBloqueados = new Set();

  listarVeiculosBloqueados() {
    return [...this.#veiculosBloqueados];
  }

  estaBloqueado(placa) {
    return this.#veiculosBloqueados.has(placa);
  }

  bloquearVeiculo(placa) {
    this.#veiculosBloqueados.add(placa);
  }
  desbloquearVeiculo(placa) {
    this.#veiculosBloqueados.delete(placa);
  }
}
