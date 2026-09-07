import {
  LIMITE_HORAS_CLIENTE_AVULSO,
  TARIFA_DIARIA,
  VALOR_HORA_CLIENTE_AVULSO,
} from '../Configs/Configs.js';
import { contarDias, contarHoras } from '../Utils/utils.js';
import Veiculo from './Veiculo.js';

export default class ClienteAvulso {
  #veiculo;

  constructor(placa) {
    this.#veiculo = placa instanceof Veiculo ? placa : new Veiculo(placa);
  }

  get placa() {
    return this.#veiculo.placa;
  }
  get veiculo() {
    return this.#veiculo;
  }
  get tipo() {
    return 'Avulso';
  }
  calcularCusto(dataHoraEntrada, dataHoraSaida) {
    const dias = contarDias(dataHoraEntrada, dataHoraSaida);
    // se for menos que um dia, então não passou da meia noite
    if (dias <= 1) {
      const horas = contarHoras(dataHoraEntrada, dataHoraSaida);
      // se for menos de 6 horas, valor por hora
      if (horas <= LIMITE_HORAS_CLIENTE_AVULSO) {
        return horas * VALOR_HORA_CLIENTE_AVULSO;
      }
      // >6 horas cobra a tarifa diaria
      return TARIFA_DIARIA;
    }
    return dias * TARIFA_DIARIA;
  }
}
