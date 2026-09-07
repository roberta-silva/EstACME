import { validate } from 'bycontract';
import Cliente from './Cliente.js';
import { LIMITE_VEICULOS_PROFESSOR } from '../Configs/Configs.js';

export default class Professor extends Cliente {

  constructor(nome, cpf) {
    validate(arguments, ['String', 'String']);
    super(nome, cpf, 'Professor');

  }

  get cpf() {
    return this.documento;
  }

  limiteVeiculos() {
    return LIMITE_VEICULOS_PROFESSOR;
  }

  calcularCusto(dataHoraEntrada, dataHoraSaida) {
    return 0;
  }
}
