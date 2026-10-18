type Nivel = 'info' | 'warn' | 'error' | 'audit';

interface RegistroLog {
  nivel: Nivel;
  mensagem: string;
  contexto?: Record<string, unknown>;
  timestamp: string;
}

function registrar(nivel: Nivel, mensagem: string, contexto?: Record<string, unknown>) {
  const linha: RegistroLog = {
    nivel,
    mensagem,
    contexto,
    timestamp: new Date().toISOString(),
  };
  const saida = JSON.stringify(linha);
  if (nivel === 'error') {
    console.error(saida);
  } else {
    console.log(saida);
  }
}

export const logger = {
  info: (mensagem: string, contexto?: Record<string, unknown>) => registrar('info', mensagem, contexto),
  warn: (mensagem: string, contexto?: Record<string, unknown>) => registrar('warn', mensagem, contexto),
  error: (mensagem: string, contexto?: Record<string, unknown>) => registrar('error', mensagem, contexto),
  audit: (mensagem: string, contexto?: Record<string, unknown>) => registrar('audit', mensagem, contexto),
};
