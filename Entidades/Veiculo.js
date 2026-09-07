export default class Veiculo {
  #placa;

  constructor(placa) {
    if (placa.length != 7) throw new Error(`Placa ${placa} inválida.`);
    let placaNormalizada = placa.toUpperCase();
    this.#placa = placaNormalizada;
  }
  get placa() {
    return this.#placa;
  }
}
