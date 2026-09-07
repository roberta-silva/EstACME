import Desconto from './Descontos.js';

export default class ClienteFrequente extends Desconto {
  static NOME = 'ClienteFrequente';
  static PERCENTUAL_DESCONTO = 0.2;
  static USO_MINIMO = 3;
  static JANELA_DIAS = 5;

  constructor() {
    super(ClienteFrequente.NOME);
  }

  elegivel({ placa, registro, dataReferencia }) {
    const usos = registro.contarUsosRecentes(
      placa,
      dataReferencia,
      ClienteFrequente.JANELA_DIAS,
    );
    return usos >= ClienteFrequente.USO_MINIMO;
  }

  aplicar(valor) {
    const valorDesconto = Number(
      (valor * ClienteFrequente.PERCENTUAL_DESCONTO).toFixed(2),
    );
    const valorFinal = Number((valor - valorDesconto).toFixed(2));
    return { identificador: this.identificador, valorDesconto, valorFinal };
  }
}
