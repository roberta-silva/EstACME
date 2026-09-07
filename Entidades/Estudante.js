import { validate } from 'bycontract';
import Cliente from './Cliente.js';
import { contarDias } from '../Utils/utils.js';
import {
  CUSTO_FIXO_ESTUDANTE,
  LIMITE_VEICULOS_ESTUDANTE,
} from '../Configs/Configs.js';

export default class Estudante extends Cliente {
  #saldo;

  constructor(nome, cpf) {
    validate(arguments, ['String', 'String']);
    super(nome, cpf, 'Estudante');
    this.#saldo = 0;
  }

  get cpf() {
    return this.documento;
  }
  get saldo() {
    return this.#saldo;
  }

  limiteVeiculos() {
    return LIMITE_VEICULOS_ESTUDANTE;
  }

  carregarSaldo(valor) {
    validate(valor, 'Number');
    if (valor <= 0) throw new Error('Valor precisa ser maior que zero.');
    this.#saldo += valor;
    return this.#saldo;
  }

  debitarSaldo(valor) {
    validate(valor, 'Number');
    if (valor <= 0) throw new Error('Valor precisa ser maior que zero.');
    this.#saldo -= valor;
    return this.#saldo;
  }

  podeEntrar() {
    return this.#saldo >= 0;
  }

  calcularCusto(dataHoraEntrada, dataHoraSaida) {
    const dias = contarDias(dataHoraEntrada, dataHoraSaida);
    return dias * CUSTO_FIXO_ESTUDANTE;
  }
}
