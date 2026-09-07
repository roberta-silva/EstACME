import PromptSync from 'prompt-sync';
import App from '../App.js';
import Estudante from '../Entidades/Estudante.js';
import Professor from '../Entidades/Professor.js';
import Empresa from '../Entidades/Empresa.js';

const prompt = PromptSync();

export default class InterfaceUsuario {
  constructor(app = new App()) {
    this.app = app;
  }

  iniciar() {
    this.app.iniciar();
    let opcao;

    do {
      this.mostrarMenu();
      opcao = prompt('Escolha uma opção: ');

      try {
        switch (opcao) {
          case '1':
            this.cadastrarCliente();
            break;

          case '2':
            this.cadastrarPlaca();
            break;

          case '3':
            this.removerPlaca();
            break;

          case '4':
            this.registrarEntrada();
            break;

          case '5':
            this.registrarSaida();
            break;

          case '6':
            this.consultarCliente();
            break;

          case '7':
            this.mostrarRelatorios();
            break;

          case '0':
            this.app.salvar();
            console.log('Dados salvos. Sistema encerrado.');
            break;

          default:
            console.log('Opção inválida.');
        }
      } catch (erro) {
        console.log(`Erro: ${erro.message}`);
      }
    } while (opcao !== '0');
  }

  mostrarMenu() {
    console.log(`
=== EstACME ===

1 - Cadastrar cliente
2 - Cadastrar placa
3 - Remover placa
4 - Registrar entrada
5 - Registrar saída
6 - Consultar cliente
7 - Relatórios
0 - Sair
      `);
  }

  cadastrarCliente() {
    const tipo = prompt(
      'Informe o tipo de cliente(Estudante/Professor/Empresa): ',
    );

    const nome = prompt('Nome: ');
    const documento = prompt('Documento: ');

    let cliente;

    if (tipo.toLowerCase() === 'estudante') {
      cliente = new Estudante(nome, documento);

      const saldo = Number(prompt('Saldo inicial: '));
      if (saldo > 0) {
        cliente.carregarSaldo(saldo);
      }
    } else if (tipo.toLowerCase() === 'professor') {
      cliente = new Professor(nome, documento);
    } else if (tipo.toLowerCase() === 'empresa') {
      cliente = new Empresa(nome, documento);
    } else {
      throw new Error('Tipo de cliente inválido.');
    }
    this.app.cadastrarCliente(cliente);
    console.log('Cliente cadastrado com sucesso!');
  }

  cadastrarPlaca() {
    const documento = prompt('Documento do cliente: ');
    const placa = prompt('Placa: ');

    this.app.cadastrarPlaca(documento, placa);
    console.log('Placa cadastrada com sucesso!');
  }

  removerPlaca() {
    const documento = prompt('Documento do cliente: ');
    const placa = prompt('Placa: ');

    this.app.removerPlaca(documento, placa);
    console.log('Placa removida com sucesso!');
  }

  registrarEntrada() {
    const placa = prompt('Placa: ');
    const ticket = this.app.autorizarEntrada(placa);

    console.log(`Entrada registrada. Ticket #${ticket.id}`);
  }

  registrarSaida() {
    const placa = prompt('Placa: ');
    const pagou = prompt('O cliente pagou? (S/N): ').toLowerCase() === 's';

    const ticket = this.app.processarSaida(placa, { pagou });
    console.log(
      `Saida registrada. Valor pago R$ ${ticket.valorPago.toFixed(2)}`,
    );
  }

  consultarCliente() {
    const documento = prompt('Documento: ');
    const situacao = this.app.relatorios.situacaoCliente(documento);

    console.log('\nSituação do cliente:');
    console.table(situacao);
  }

  mostrarRelatorios() {
    console.log(`
=== RELATÓRIOS ===

1 - Valor arrecadado por período
2 - Registros de cliente cadastrado
3 - Registros de cliente avulso
4 - Veículos bloqueados
5 - Top 10 clientes mais frequentes
      `);

    const opcao = prompt('Escolha uma opção: ');

    switch (opcao) {
      case '1':
        this.relatorioArrecadacao();
        break;

      case '2':
        this.relatorioClienteCadastrado();
        break;

      case '3':
        this.relatorioClienteAvulso();
        break;

      case '4':
        this.relatorioBloqueados();
        break;

      case '5':
        this.relatorioMaisFrequentes();
        break;

      default:
        console.log('Opção inválida.');
    }
  }

  relatorioArrecadacao() {
    const inicio = prompt('Data inicial (AAAA-MM-DD): ');
    const fim = prompt('Data final (AAAA-MM-DD): ');
    const categoriasInput = prompt(
      'Filtrar por categoria(s) de cliente (Estudante, Professor, Empresa, Avulso)? ' +
        'Informe separadas por vírgula ou deixe em branco para todas: ',
    );

    const categorias =
      categoriasInput && categoriasInput.trim()
        ? categoriasInput.split(',').map((c) => c.trim())
        : null;

    const total = this.app.relatorios.valorTotalArrecadado(
      `${inicio}T00:00:00`,
      `${fim}T23:59:59`,
      categorias,
    );

    console.log(`Total arrecadado: R$ ${total.toFixed(2)}`);
  }

  relatorioClienteCadastrado() {
    const documento = prompt('Documento: ');
    const inicio = prompt('Data inicial (AAAA-MM-DD): ');
    const fim = prompt('Data final (AAAA-MM-DD): ');

    const registros = this.app.relatorios.registrosClienteCadastrado(
      documento,
      `${inicio}T00:00:00`,
      `${fim}T23:59:59`,
    );
    this.mostrarRegistros(registros);
  }

  relatorioClienteAvulso() {
    const inicio = prompt('Data inicial (AAAA-MM-DD): ');
    const fim = prompt('Data final (AAAA-MM-DD): ');
    const registros = this.app.relatorios.registrosClientesAvulsos(
      `${inicio}T00:00:00`,
      `${fim}T23:59:59`,
    );

    this.mostrarRegistros(registros);
  }

  relatorioBloqueados() {
    const bloqueados = this.app.relatorios.clientesBloqueados();

    console.log('\nVeiculos bloqueados: ');
    console.table(bloqueados);
  }

  relatorioMaisFrequentes() {
    const ano = prompt('Ano: ');
    const clientes = this.app.relatorios.dezClientesMaisFrequentes(ano);

    console.table(clientes);
  }

  mostrarRegistros(registros) {
    if (registros.length === 0) {
      console.log('Nenhum registro encontrado.');
      return;
    }

    console.table(
      registros.map((ticket) => ({
        placa: ticket.placa,
        tipo: ticket.tipoCliente,
        entrada: ticket.entrada.toLocaleString('pt-BR'),
        saida: ticket.saida
          ? ticket.saida.toLocaleString('pt-BR')
          : 'Em aberto',
        valorPago: ticket.valorPago,
      })),
    );
  }
}
