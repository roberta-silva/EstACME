import { validate } from 'bycontract';

export default class Desconto {
  #identificador;

  constructor(identificador) {
    validate(identificador, 'String');
    this.#identificador = identificador;
  }

  get identificador() {
    return this.#identificador;
  }
}
