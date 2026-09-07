export function contarDias(dataHoraEntrada, dataHoraSaida) {
  const entrada = new Date(dataHoraEntrada);
  const saida = new Date(dataHoraSaida);

  const dias =
    Math.round(
      (new Date(saida.toDateString()) - new Date(entrada.toDateString())) /
        (1000 * 60 * 60 * 24),
    ) + 1;
  return dias;
}

// contarDias('2026-06-08T17:58', '2026-06-08T19:00');

export function contarHoras(dataHoraEntrada, dataHoraSaida) {
  const entrada = new Date(dataHoraEntrada);
  const saida = new Date(dataHoraSaida);

  const horas = Math.ceil((saida - entrada) / (1000 * 60 * 60));

  return horas;
}

// console.log(contarHoras('2026-06-08T19:58', '2026-06-09T21:00'));
