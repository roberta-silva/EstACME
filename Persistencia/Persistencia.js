import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import nReadlines from 'n-readlines';
import Estudante from '../Entidades/Estudante.js';
import Professor from '../Entidades/Professor.js';
import Empresa from '../Entidades/Empresa.js';
import TicketEstacionamento from '../Estacionamento/TicketEstacionamento.js';

// Diretorio deste arquivo (Persistencia/), usado para montar caminhos
// absolutos, independentes de onde o comando "node" for executado (cwd)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default class Persistencia {
  constructor(cadastroClientes, registro, veiculosBloqueados) {
    this.cadastroClientes = cadastroClientes;
    this.registro = registro;
    this.veiculosBloqueados = veiculosBloqueados;

    this.pastaDados = path.join(__dirname, '..', 'dados');
    this.arquivoClientes = path.join(this.pastaDados, 'clientes.csv');
    this.arquivoRegistros = path.join(this.pastaDados, 'registros.csv');
    this.arquivoBloqueados = path.join(this.pastaDados, 'bloqueados.csv');
  }

  inicializarArquivos() {
    fs.mkdirSync(this.pastaDados, { recursive: true });

    if (!fs.existsSync(this.arquivoClientes)) {
      fs.writeFileSync(this.arquivoClientes, '');
    }

    if (!fs.existsSync(this.arquivoRegistros)) {
      fs.writeFileSync(this.arquivoRegistros, '');
    }

    if (!fs.existsSync(this.arquivoBloqueados)) {
      fs.writeFileSync(this.arquivoBloqueados, '');
    }
  }

  carregarTudo() {
    this.inicializarArquivos();
    this.carregarClientes();
    this.carregarRegistros();
    this.carregarBloqueados();
  }

  carregarClientes() {
    const arquivo = new nReadlines(this.arquivoClientes);

    let linha;
    while ((linha = arquivo.next())) {
      const dados = linha.toString().trim().split(',');

      if (dados.length < 3) continue;

      const documento = dados[0];
      const nome = dados[1];
      const terceiroCampo = dados[2];

      const ehNumero = terceiroCampo !== '' && !isNaN(Number(terceiroCampo));

      let tipo;
      let valorExtra = 0;
      let placas;

      if (ehNumero) {
        tipo = dados[3];
        valorExtra = Number(terceiroCampo);
        placas = dados.slice(4);
      } else {
        tipo = terceiroCampo;
        placas = dados.slice(3);
      }

      let cliente;

      if (tipo === 'Estudante') {
        cliente = new Estudante(nome, documento);

        if (valorExtra > 0) {
          cliente.carregarSaldo(valorExtra);
        }
      }

      if (tipo === 'Professor') {
        cliente = new Professor(nome, documento);
      }

      if (tipo === 'Empresa') {
        cliente = new Empresa(nome, documento);

        if (valorExtra > 0) {
          cliente.acumularDebito(valorExtra);
        }
      }

      if (!cliente) continue;

      for (const placa of placas) {
        cliente.cadastrarVeiculo(placa);
      }

      this.cadastroClientes.cadastrarCliente(cliente);
    }
  }

  carregarRegistros() {
    const arquivo = new nReadlines(this.arquivoRegistros);
    let linha;

    while ((linha = arquivo.next())) {
      const dados = linha.toString().trim().split(',');

      if (dados.length < 2) continue;

      const placa = dados[0];
      const entrada = dados[1];
      const saida = dados[2];
      const custo = dados[3];
      const valorDesconto = dados[4];
      const valorPago = dados[5];

      const cliente = this.cadastroClientes.buscarClientePorPlaca(placa);
      const tipoCliente = cliente ? cliente.tipo : 'Avulso';

      const ticket = new TicketEstacionamento(
        placa,
        tipoCliente,
        new Date(entrada),
      );

      if (saida) {
        ticket.registrarSaida({
          saida: new Date(saida),
          custo: Number(custo),
          valorDesconto: Number(valorDesconto),
          valorPago: Number(valorPago),
        });
      }
      this.registro.adicionarTicketCarregado(ticket);
    }
  }

  carregarBloqueados() {
    const arquivo = new nReadlines(this.arquivoBloqueados);
    let linha;

    while ((linha = arquivo.next())) {
      const placa = linha.toString().trim();

      if (placa) {
        this.veiculosBloqueados.bloquearVeiculo(placa);
      }
    }
  }

  salvarTudo() {
    this.inicializarArquivos();
    this.salvarClientes();
    this.salvarRegistros();
    this.salvarBloqueados();
  }

  salvarClientes() {
    const linhas = [];

    for (const cliente of this.cadastroClientes.listarClientes()) {
      let colunas;

      if (cliente.tipo === 'Estudante') {
        colunas = [
          cliente.documento,
          cliente.nome,
          cliente.saldo,
          cliente.tipo,
          ...cliente.veiculos,
        ];
      } else if (cliente.tipo === 'Empresa') {
        colunas = [
          cliente.documento,
          cliente.nome,
          cliente.debitos,
          cliente.tipo,
          ...cliente.veiculos,
        ];
      } else {
        colunas = [
          cliente.documento,
          cliente.nome,
          cliente.tipo,
          ...cliente.veiculos,
        ];
      }

      linhas.push(colunas.join(','));
    }
    fs.writeFileSync(this.arquivoClientes, linhas.join('\n'));
  }

  salvarRegistros() {
    const linhas = [];

    for (const ticket of this.registro.todosTickets) {
      const linha = [
        ticket.placa,
        ticket.entrada.toISOString(),
        ticket.saida ? ticket.saida.toISOString() : '',
        ticket.saida ? ticket.custo : '',
        ticket.saida ? ticket.valorDesconto : '',
        ticket.saida ? ticket.valorPago : '',
      ].join(',');

      linhas.push(linha);
    }
    fs.writeFileSync(this.arquivoRegistros, linhas.join('\n'));
  }

  salvarBloqueados() {
    const placas = this.veiculosBloqueados.listarVeiculosBloqueados();

    fs.writeFileSync(this.arquivoBloqueados, placas.join('\n'));
  }
}
