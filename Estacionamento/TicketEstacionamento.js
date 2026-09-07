export default class TicketEstacionamento {
  #id;
  #veiculo;
  #tipoCliente;
  #entrada;
  #saida = null;
  #custo = 0;
  #descontoId = 'nenhum';
  #valorDesconto = 0;
  #valorDevido = 0;
  #valorPago = 0;

  static idGen = 0;

  constructor(placa, tipoCliente, entrada = new Date()) {
    this.#veiculo = placa;
    this.#tipoCliente = tipoCliente;
    this.#entrada = entrada;

    TicketEstacionamento.idGen++;
    this.#id = TicketEstacionamento.idGen;
  }

  get veiculo() {
    return this.#veiculo;
  }
  get placa() {
    return this.#veiculo;
  }
  get tipoCliente() {
    return this.#tipoCliente;
  }
  get entrada() {
    return this.#entrada;
  }
  get saida() {
    return this.#saida;
  }
  get custo() {
    return this.#custo;
  }
  get descontoId() {
    return this.#descontoId;
  }
  get valorDesconto() {
    return this.#valorDesconto;
  }
  get valorDevido() {
    return this.#valorDevido;
  }
  get valorPago() {
    return this.#valorPago;
  }

  // ticket aberto = veiculo ainda está estacionado
  get aberto() {
    return this.#saida === null;
  }

  // registra os dados de saída e cobrança do veículo
  registrarSaida({
    saida,
    custo,
    descontoId,
    valorDesconto,
    valorDevido,
    valorPago,
  }) {
    if (!this.aberto) {
      throw new Error(`Ticket #${this.#id} já possui saída registrada.`);
    }
    this.#saida = saida;
    this.#custo = custo;
    this.#descontoId = descontoId;
    this.#valorDesconto = valorDesconto;
    this.#valorDevido = valorDevido;
    this.#valorPago = valorPago;
  }
}
