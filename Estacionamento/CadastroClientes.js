export default class CadastroClientes {
  #clientes = new Map();
  #proprietarioPorPlaca = new Map();
  #placasCadastradas = new Set();

  cadastrarCliente(cliente) {
    if (this.#clientes.has(cliente.documento)) {
      throw new Error('Já existe um cliente cadastrado com esse documento.');
    }
    for (const placa of cliente.veiculos) {
      if (this.#placasCadastradas.has(placa)) {
        throw new Error(`A placa ${placa} já está cadastrada.`);
      }
    }
    this.#clientes.set(cliente.documento, cliente);
    for (const placa of cliente.veiculos) {
      this.#placasCadastradas.add(placa);
      this.#proprietarioPorPlaca.set(placa, cliente.documento);
    }
    return cliente;
  }

  buscarCliente(documento) {
    return this.#clientes.get(documento) ?? null;
  }

  buscarClientePorPlaca(placa) {
    const documento = this.#proprietarioPorPlaca.get(placa.toUpperCase());
    return documento ? this.#clientes.get(documento) : null;
  }

  isPreCadastrado(placa) {
    return this.#proprietarioPorPlaca.has(placa.toUpperCase());
  }

  cadastrarPlaca(documento, placa) {
    const cliente = this.buscarCliente(documento);
    if (!cliente) throw new Error('Cliente não encontrado!');

    placa = placa.toUpperCase();
    if (this.#placasCadastradas.has(placa))
      throw new Error(`Placa ${placa} já cadastrada no sistema.`);

    cliente.cadastrarVeiculo(placa);
    this.#placasCadastradas.add(placa);
    this.#proprietarioPorPlaca.set(placa, documento);
  }

  removerPlaca(documento, placa) {
    const cliente = this.buscarCliente(documento);
    if (!cliente) throw new Error('Cliente não encontrado!');

    placa = placa.toUpperCase();
    cliente.removerVeiculo(placa);
    this.#placasCadastradas.delete(placa);
    this.#proprietarioPorPlaca.delete(placa);
  }

  listarClientes() {
    return [...this.#clientes.values()];
  }
}
