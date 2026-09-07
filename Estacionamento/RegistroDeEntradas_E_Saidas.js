import TicketEstacionamento from './TicketEstacionamento.js';

// mantem o historico de tickets de estacionamento
// e controle quais veiculos ainda estão no estacionamento
export default class RegistroDeEntradas_E_Saidas {
  #tickets = [];
  #ticketsAbertos = new Map();
  #cadastroClientes;

  constructor(cadastroClientes) {
    this.#cadastroClientes = cadastroClientes;
  }

  registrarEntrada(placa, entrada = new Date()) {
    placa = placa.toUpperCase();

    if (this.#ticketsAbertos.has(placa)) {
      throw new Error(
        `Já existe um veículo com a placa ${placa} dentro do estacionamento.`,
      );
    }

    const cliente = this.#cadastroClientes.buscarClientePorPlaca(placa);
    const tipoCliente = cliente ? cliente.tipo : 'Avulso';

    const ticket = new TicketEstacionamento(
      placa,
      tipoCliente,
      new Date(entrada),
    );

    this.#tickets.push(ticket);
    this.#ticketsAbertos.set(placa, ticket);
    return ticket;
  }

  buscarTicketAberto(placa) {
    return this.#ticketsAbertos.get(placa.toUpperCase()) ?? null;
  }

  estaEstacionado(placa) {
    return this.#ticketsAbertos.has(placa.toUpperCase());
  }

  // busca a quantidade de tickets abertos - cada ticket aberto = uma vaga ocupada
  get vagasOcupadas() {
    return this.#ticketsAbertos.size;
  }

  registrarSaida(placa, dadosCobranca) {
    const ticket = this.buscarTicketAberto(placa);
    if (!ticket) {
      throw new Error(`Nenhum ticket encontrado para a placa ${placa}.`);
    }

    ticket.registrarSaida(dadosCobranca);
    this.#ticketsAbertos.delete(placa.toUpperCase());
    return ticket;
  }

  // todos os tickets de uma placa
  listarPorPlaca(placa) {
    return this.#tickets.filter(
      (ticket) => ticket.placa === placa.toUpperCase(),
    );
  }

  // tickets por placa por periodo
  listarPorPlacaEPorPeriodo(placa, inicio, fim) {
    const dataInicio = new Date(inicio);
    const dataFim = new Date(fim);

    return this.#tickets.filter(
      (ticket) =>
        ticket.placa === placa.toUpperCase() &&
        ticket.entrada >= dataInicio &&
        ticket.entrada <= dataFim,
    );
  }

  listarPorPeriodo(inicio, fim) {
    const dataInicio = new Date(inicio);
    const dataFim = new Date(fim);

    return this.#tickets.filter(
      (ticket) => ticket.entrada >= dataInicio && ticket.entrada <= dataFim,
    );
  }

  // contar usos recentes por placa
  contarUsosRecentes(placa, dataReferencia, dias) {
    const referencia = new Date(dataReferencia);
    const limite = new Date(referencia);

    limite.setDate(limite.getDate() - dias);

    return this.#tickets.filter(
      (t) =>
        t.placa === placa.toUpperCase() &&
        t.entrada >= limite &&
        t.entrada <= referencia,
    ).length;
  }

  adicionarTicketCarregado(ticket) {
    this.#tickets.push(ticket);
    if (ticket.aberto) {
      this.#ticketsAbertos.set(ticket.placa, ticket);
    }
  }

  get todosTickets() {
    return [...this.#tickets];
  }
}
