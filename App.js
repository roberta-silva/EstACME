import CadastroClientes from './Estacionamento/CadastroClientes.js';
import RegistroDeEntrada_E_Saidas from '././Estacionamento/RegistroDeEntradas_E_Saidas.js';
import VeiculosBloqueados from '././Estacionamento/VeiculosBloqueados.js';
import RelatoriosGerenciais from './RelatoriosGerenciais/RelatoriosGerenciais.js';
import Professor from './Entidades/Professor.js';
import Estudante from './Entidades/Estudante.js';
import Empresa from './Entidades/Empresa.js';
import ClienteAvulso from './Entidades/ClienteAvulso.js';
import ClienteFrequente from '././Descontos/ClienteFrequente.js';
import { CAPACIDADE_TOTAL } from './Configs/Configs.js';

export default class App {
  constructor() {
    this.cadastroClientes = new CadastroClientes();
    this.registro = new RegistroDeEntrada_E_Saidas(this.cadastroClientes);
    this.veiculosBloqueados = new VeiculosBloqueados();
    this.relatorios = new RelatoriosGerenciais(
      this.registro,
      this.cadastroClientes,
      this.veiculosBloqueados,
    );

    // descontos
    this.clienteFrequente = new ClienteFrequente();
  }

  cadastrarCliente(cliente) {
    return this.cadastroClientes.cadastrarCliente(cliente);
  }

  cadastrarPlaca(documento, placa) {
    return this.cadastroClientes.cadastrarPlaca(documento, placa);
  }

  removerPlaca(documento, placa) {
    return this.cadastroClientes.removerPlaca(documento, placa);
  }

  autorizarEntrada(placa, entrada = new Date()) {
    if (this.registro.vagasOcupadas >= CAPACIDADE_TOTAL) {
      throw new Error(
        'Entrada negada. Capacidade máxima do estacionamento atingida.',
      );
    }
    if (this.veiculosBloqueados.estaBloqueado(placa)) {
      throw new Error(`Entrada negada. A placa ${placa} está bloqueada.`);
    }

    const cliente = this.cadastroClientes.buscarClientePorPlaca(placa);

    if (cliente) {
      if (!cliente.podeEntrar()) {
        throw new Error(
          `Entrada negada. ${cliente.tipo} ${cliente.nome} não apto a entrar.`,
        );
      }
      if (cliente instanceof Professor) {
        const outroVeiculoEstacionado = [...cliente.veiculos].some(
          (p) => p !== placa && this.registro.estaEstacionado(p),
        );
        if (outroVeiculoEstacionado) {
          throw new Error(
            `Entrada negada. O professor ${cliente.nome} já possui outro veículo estacionado.`,
          );
        }
      }
    }
    return this.registro.registrarEntrada(placa, entrada);
  }

  processarSaida(placa, opcoes = {}) {
    const ticket = this.registro.buscarTicketAberto(placa);
    if (!ticket)
      throw new Error(`Nenhum veículo com a placa ${placa} está estacionado.`);

    const saida = opcoes.saida ?? new Date();
    const cliente = this.cadastroClientes.buscarClientePorPlaca(placa);

    const sujeitoCalculo = cliente ?? new ClienteAvulso(placa);
    const custo = sujeitoCalculo.calcularCusto(ticket.entrada, saida);

    // desconto só se aplica a avulso, e só se elegível
    let resultadoDesconto = {
      identificador: 'nenhum',
      valorDesconto: 0,
      valorFinal: custo,
    };

    if (
      !cliente &&
      this.clienteFrequente.elegivel({
        placa,
        registro: this.registro,
        dataReferencia: saida,
      })
    ) {
      resultadoDesconto = this.clienteFrequente.aplicar(custo);
    }

    const valorDevido = resultadoDesconto.valorFinal;
    let valorPago;

    if (!cliente) {
      const recusouPagar = opcoes.pagou === false;
      if (recusouPagar) {
        valorPago = 0;
        this.veiculosBloqueados.bloquearVeiculo(placa);
      } else {
        valorPago = valorDevido;
      }
    } else if (cliente instanceof Estudante) {
      cliente.debitarSaldo(valorDevido);
      valorPago = valorDevido;
    } else if (cliente instanceof Empresa) {
      cliente.acumularDebito(valorDevido);
      valorPago = 0; // empresa não paga na hora, acumula débito
    } else if (cliente instanceof Professor) {
      valorPago = 0; // entrada gratuita
    }

    this.registro.registrarSaida(placa, {
      saida,
      custo,
      descontoId: resultadoDesconto.identificador,
      valorDesconto: resultadoDesconto.valorDesconto,
      valorDevido,
      valorPago,
    });

    return this.registro.listarPorPlaca(placa).at(-1);
  }
}

//
