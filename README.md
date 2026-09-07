# Estacme

Sistema de Controle de Estacionamento desenvolvido como projeto prático da disciplina de **Programação Orientada a Objetos (POO)** do curso de **Análise e Desenvolvimento de Sistemas (ADS)**.

O projeto foi desenvolvido em **JavaScript** e dividido em duas fases, acompanhando a evolução da aplicação desde a modelagem e implementação do núcleo do sistema até a inclusão de persistência de dados, interface e relatórios gerenciais.

## Fases do projeto

### Fase 1 — Modelagem e implementação básica

Na primeira fase, o foco foi a construção do núcleo do sistema e a aplicação dos principais conceitos de **Programação Orientada a Objetos**.

Foram desenvolvidos:

* Modelagem do domínio e diagrama de classes;
* Classes de clientes: Avulso, Professor, Estudante e Empresa;
* Classes relacionadas a veículos, placas e registros de estacionamento;
* Herança, encapsulamento e polimorfismo;
* Mecanismo de descontos;
* Controle de entrada e saída de veículos;
* Registro de data e hora;
* Cálculo de cobranças;
* Tratamento de bloqueios, inadimplência e exceções;
* Organização do código em classes e módulos.

### Fase 2 — Funcionalidades avançadas e persistência

Na segunda fase, o sistema foi ampliado com funcionalidades voltadas à persistência dos dados, interação com o usuário e geração de informações gerenciais.

Foram implementados:

* Persistência de dados utilizando arquivos **CSV**;
* Leitura e atualização dos dados durante a execução;
* Interface para interação com o sistema;
* Cadastro de clientes;
* Controle de entrada e saída de veículos;
* Consultas e relatórios gerenciais;
* Relatório de valores arrecadados;
* Consulta da situação de clientes;
* Consulta de registros de estacionamento por período;
* Relação de clientes impedidos de entrar;
* Ranking dos 10 clientes mais frequentes do ano;
* Uso de `Set` para controle de placas e bloqueios;
* Uso de `Map` para associação e gerenciamento dos dados.

## Tecnologias utilizadas

* **JavaScript**
* **Node.js**
* **Programação Orientada a Objetos**
* **CSV** para persistência de dados

## Objetivo

O projeto teve como objetivo aplicar, de forma prática, os conceitos de **Programação Orientada a Objetos**, desenvolvendo um sistema completo e evolutivo para controle de um estacionamento, desde sua modelagem até a implementação de funcionalidades de persistência, interface e relatórios.
