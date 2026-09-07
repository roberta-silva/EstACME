import { validate } from 'bycontract';
import Veiculo from './Veiculo.js';

export default class Cliente {
  #nome;
  #documento;
  #veiculos;
  #tipo;

  constructor(nome, documento, tipo) {
    validate(arguments, ['String', 'String']);
    this.#nome = nome;
    this.#documento = documento;
    this.#tipo = tipo;
    this.#veiculos = new Map();
  }

  get nome() {
    return this.#nome;
  }
  get documento() {
    return this.#documento;
  }
  get tipo() {
    return this.#tipo;
  }
  get veiculos() {
    return [...this.#veiculos.keys()];
  }
  get qtdeVeiculos() {
    return this.#veiculos.size;
  }

  possuiVeiculo(placa) {
    return this.#veiculos.has(placa);
  }

  limiteVeiculos() {
    return 2;
  }

  cadastrarVeiculo(placa) {
    const veiculo = placa instanceof Veiculo ? placa : new Veiculo(placa);

    // verifica se a placa já está cadastrada
    if (this.#veiculos.has(veiculo.placa))
      throw new Error(`Placa ${placa} já cadastrada!`);

    // verifica se o limite de veiculos ainda não foi atingido
    if (this.#veiculos.size >= this.limiteVeiculos())
      throw new Error(`Limite de veículos atingido para ${this.tipo}`);

    this.#veiculos.set(veiculo.placa, veiculo);
    return `Veiculo ${veiculo.placa} cadastrada com sucesso!`;
  }

  removerVeiculo(placa) {
    if (!this.#veiculos.has(placa)) throw new Error(`Veículo não cadastrado!`);
    this.#veiculos.delete(placa);
  }

  podeEntrar() {
    return true;
  }
  calcularCusto(dataHoraEntrada, dataHoraSaida) {
    throw new Error(`calcularCusto() Deve ser implementado pela subclasse.`);
  }
}
