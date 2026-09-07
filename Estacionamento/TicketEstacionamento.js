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

  constructor(placa, tipoCliente, entrada = new Date(), id = null) {
    this.#veiculo = placa.toUpperCase();
    this.#tipoCliente = tipoCliente;
    this.#entrada = new Date(entrada);

    if (id !== null) {
      this.#id = Number(id);
      TicketEstacionamento.idGen = Math.max(
        TicketEstacionamento.idGen,
        this.#id,
      );
    } else {
      TicketEstacionamento.idGen++;
      this.#id = TicketEstacionamento.idGen;
    }

    // TicketEstacionamento.idGen++;
    // this.#id = TicketEstacionamento.idGen;
  }

  get id() {
    return this.#id;
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
    descontoId = 'nenhum',
    valorDesconto = 0,
    valorDevido = 0,
    valorPago = 0,
  }) {
    if (!this.aberto) {
      throw new Error(`Ticket #${this.#id} já possui saída registrada.`);
    }
    this.#saida = new Date(saida);
    this.#custo = Number(custo);
    this.#descontoId = descontoId;
    this.#valorDesconto = Number(valorDesconto);
    this.#valorDevido = Number(valorDevido);
    this.#valorPago = Number(valorPago);
  }

  carregarDadosSaida(dados) {
    if (!this.aberto) {
      throw new Error(`Ticket #${this.id} já possui saída registrada.`);
    }
    this.registrarSaida(dados);
  }
}
