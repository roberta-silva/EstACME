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
    if (this.#ticketsAbertos.has(placa)) {
      throw new Error(
        `Já existe um veículo com a placa ${placa} dentro do estacionamento.`,
      );
    }

    const cliente = this.#cadastroClientes.buscarClientePorPlaca(placa);
    const tipoCliente = cliente ? cliente.tipo : 'Avulso';

    const ticket = new TicketEstacionamento(placa, tipoCliente, entrada);

    this.#tickets.push(ticket);
    this.#ticketsAbertos.set(placa, ticket);
    return ticket;
  }

  buscarTicketAberto(placa) {
    return this.#ticketsAbertos.get(placa) ?? null;
  }

  estaEstacionado(placa) {
    return this.#ticketsAbertos.has(placa);
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
    this.#ticketsAbertos.delete(placa);
    return ticket;
  }

  // todos os tickets de uma placa
  listarPorPlaca(placa) {
    return this.#tickets.filter((ticket) => ticket.placa === placa);
  }

  // tickets por placa por periodo
  listarPorPlacaEPorPeriodo(placa, inicio, fim) {
    return this.#tickets.filter(
      (ticket) =>
        ticket.placa === placa &&
        ticket.entrada >= inicio &&
        ticket.entrada <= fim,
    );
  }

  // contar usos recentes por placa
  contarUsosRecentes(placa, dataReferencia, dias) {
    const limite = new Date(dataReferencia);

    limite.setDate(limite.getDate() - dias);
    return this.#tickets.filter(
      (t) =>
        t.placa === placa && t.entrada >= limite && t.entrada <= dataReferencia,
    ).length;
  }

  get todosTickets() {
    return [...this.#tickets];
  }
}
