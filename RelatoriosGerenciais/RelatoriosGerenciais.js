export default class RelatoriosGerenciais {
  constructor(registro, cadastro, listaBloqueio) {
    this.registro = registro;
    this.cadastro = cadastro;
    this.listaBloqueio = listaBloqueio;
  }

  // Valor total arrecadado por período e/ou categoria de cliente;
  valorTotalArrecadado(inicio, fim, categorias = null) {
    const tickets = this.registro.listarPorPeriodo(inicio, fim);

    return tickets
      .filter(
        (ticket) => !categorias || categorias.includes(ticket.tipoCliente),
      )
      .reduce((total, ticket) => total + ticket.valorPago, 0);
  }

  // Situação de um cliente cadastrado;
  situacaoCliente(documento) {
    const cliente = this.cadastro.buscarCliente(documento);

    if (!cliente) {
      throw new Error('Cliente não encontrado.');
    }

    return {
      documento: cliente.documento,
      nome: cliente.nome,
      tipo: cliente.tipo,
      veiculos: cliente.veiculos,
      veiculosEstacionados: cliente.veiculos.filter((placa) =>
        this.registro.estaEstacionado(placa),
      ),
      saldo: cliente.tipo === 'Estudante' ? cliente.saldo : null,
      debito: cliente.tipo === 'Empresa' ? cliente.saldo : null,
      inadimplente: cliente.tipo === 'Empresa' ? cliente.inadimplente : false,
    };
  }

  // Registros de estacionamento de cliente cadastrado por período;
  registrosClienteCadastrados(documento, inicio, fim) {
    const cliente = this.cadastro.buscarCliente(documento);

    if (!cliente) {
      throw new Error('Cliente não encontrado.');
    }

    const placas = new Set(cliente.veiculos);
    return this.registro
      .listarPorPeriodo(inicio, fim)
      .filter((ticket) => placas.has(ticket.placa));
  }

  // Registros de estacionamento de cliente não cadastrado por período;
  registrosClientesAvulsos(inicio, fim) {
    return this.registro
      .listarPorPeriodo(inicio, fim)
      .filter((ticket) => ticket.tipoCliente === 'Avulso');
  }

  // Relação de clientes impedidos de entrar no estacionamento;
  clientesBloqueados() {
    return this.listaBloqueio.listarVeiculosBloqueados();
  }

  // Relação dos 10 clientes mais frequentes do ano.
  dezClientesMaisFrequentes(ano) {
    const inicio = new Date(`${ano}-01-01T00:00:00`);
    const fim = new Date(`${ano}-12-31T23:59:59`);

    const contagem = new Map();

    for (const ticket of this.registro.listarPorPeriodo(inicio, fim)) {
      let chave;
      let nome;

      const cliente = this.cadastro.buscarClientePorPlaca(ticket.placa);

      if (cliente) {
        chave = cliente.documento;
        nome = cliente.nome;
      } else {
        chave = `AVULSO:${ticket.placa}`;
        nome = `Avulso - ${ticket.placa}`;
      }

      contagem.set(chave, {
        documento: cliente ? cliente.documento : null,
        nome,
        quantidade: (contagem.get(chave)?.quantidade || 0) + 1,
      });
    }

    return [...contagem.values()]
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 10);
  }
}
