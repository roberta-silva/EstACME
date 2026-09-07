export default class RelatoriosGerenciais {
  constructor(registro, cadastro, listaBloqueio) {
    this.registro = registro;
    this.cadastro = cadastro;
    this.listaBloqueio = listaBloqueio;
  }

  // Relação dos clientes/placas impedidos de entrar no estacionamento
  clientesBloqueados() {
    return this.listaBloqueio.listarVeiculosBloqueados();
  }
}
