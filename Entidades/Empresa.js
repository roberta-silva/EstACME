import { validate } from 'bycontract';
import Cliente from './Cliente.js';
import {
  LIMITE_DEBITO_EMPRESA,
  LIMITE_VEICULOS_EMPRESA,
  MULTA_DIARIA_EMPRESA,
  TARIFA_DIARIA,
} from '../Configs/Configs.js';
import { contarDias } from '../Utils/utils.js';

export default class Empresa extends Cliente {
  #debitos;
  #inadimplente;

  constructor(nome, cnpj) {
    validate(arguments, ['String', 'String']);
    super(nome, cnpj, 'Empresa');

    this.#debitos = 0;
    this.#inadimplente = false;
  }

  get cnpj() {
    return this.documento;
  }
  get inadimplente() {
    return this.#inadimplente;
  }
  get debitos() {
    return this.#debitos;
  }

  limiteVeiculos() {
    return LIMITE_VEICULOS_EMPRESA;
  }

  acumularDebito(valor) {
    validate(valor, 'Number');
    if (valor <= 0) throw new Error('Valor precisa ser maior que zero.');
    this.#debitos += valor;
    if (this.#debitos >= LIMITE_DEBITO_EMPRESA) {
      this.tornarInadimplente();
    }
    return this.#debitos;
  }

  pagarDebito(valor) {
    validate(valor, 'Number');
    if (valor <= 0) throw new Error('Valor precisa ser maior que zero.');
    this.#debitos -= valor;
    if (this.#debitos <= LIMITE_DEBITO_EMPRESA) {
      this.tornarAdimplente();
    }
    return this.#debitos;
  }

  tornarInadimplente() {
    this.#inadimplente = true;
  }

  tornarAdimplente() {
    this.#inadimplente = false;
  }

  podeEntrar() {
    return !this.#inadimplente;
  }

  calcularCusto(dataHoraEntrada, dataHoraSaida) {
    const dias = contarDias(dataHoraEntrada, dataHoraSaida);
    if (dias > 1) {
      // multa adicional por dia, caso permanece depois da meia noite
      return dias * TARIFA_DIARIA + (dias - 1) * MULTA_DIARIA_EMPRESA;
    }
    return TARIFA_DIARIA;
  }
}
