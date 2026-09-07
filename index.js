//  Ponto de entrada do sistema EstACME
//  Demonstra o funcionamento básico: cadastro de clientes, controle de
//  entrada/saída de veículos e cálculo de cobrança conforme o tipo de cliente.

import App from './App.js';
import Estudante from './Entidades/Estudante.js';
import Professor from './Entidades/Professor.js';
import Empresa from './Entidades/Empresa.js';

const app = new App();

// Cadastro de clientes pré-cadastrados
const estudante = new Estudante('João Silva', '12345678901');
estudante.carregarSaldo(100);
estudante.cadastrarVeiculo('ABC1D23');
app.cadastrarCliente(estudante);

const professor = new Professor('Ana Costa', '45678901234');
professor.cadastrarVeiculo('MNO5H67');
app.cadastrarCliente(professor);

const empresa = new Empresa('Empresa Brasil', '56789012345000');
empresa.cadastrarVeiculo('STU7J89');
app.cadastrarCliente(empresa);

console.log(
  'Clientes cadastrados:',
  app.cadastroClientes.listarClientes().length,
);

// Estudante: entrada e saída no mesmo dia
app.autorizarEntrada('ABC1D23', new Date('2026-08-20T08:00:00'));
const ticketEstudante = app.processarSaida('ABC1D23', {
  saida: new Date('2026-08-20T10:00:00'),
});
console.log(
  'Estudante - custo:',
  ticketEstudante.custo,
  '| saldo restante:',
  estudante.saldo,
);

// Professor: entrada gratuita
app.autorizarEntrada('MNO5H67', new Date('2026-08-20T08:00:00'));
const ticketProfessor = app.processarSaida('MNO5H67', {
  saida: new Date('2026-08-20T12:00:00'),
});
console.log('Professor - custo:', ticketProfessor.custo);

// Empresa: permanência de 2 dias (cruza a meia-noite -> multa)
app.autorizarEntrada('STU7J89', new Date('2026-08-20T08:00:00'));
const ticketEmpresa = app.processarSaida('STU7J89', {
  saida: new Date('2026-08-21T18:00:00'),
});
console.log('Empresa - custo:', ticketEmpresa.custo);

// Cliente avulso: cobrança por hora
app.autorizarEntrada('XYZ9K88', new Date('2026-08-22T08:00:00'));
const ticketAvulso = app.processarSaida('XYZ9K88', {
  saida: new Date('2026-08-22T11:00:00'),
});
console.log('Avulso - custo:', ticketAvulso.custo);

// Cliente avulso que recusa pagar -> bloqueado
app.autorizarEntrada('WWW1122', new Date('2026-08-22T08:00:00'));
app.processarSaida('WWW1122', {
  saida: new Date('2026-08-22T09:00:00'),
  pagou: false,
});
console.log('Placas bloqueadas:', app.relatorios.clientesBloqueados());
