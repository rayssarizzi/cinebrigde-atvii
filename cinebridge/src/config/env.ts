import 'dotenv/config';

function obrigatoria(nome: string, padrao?: string): string {
  const valor = process.env[nome] ?? padrao;
  if (valor === undefined) {
    throw new Error(`variavel de ambiente ausente: ${nome}`);
  }
  return valor;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  porta: Number(process.env.PORT ?? 3000),
  db: {
    host: obrigatoria('DB_HOST', 'localhost'),
    port: Number(process.env.DB_PORT ?? 5432),
    usuario: obrigatoria('DB_USER', 'cinebridge'),
    senha: obrigatoria('DB_PASSWORD', 'cinebridge'),
    banco: obrigatoria('DB_NAME', 'cinebridge_recomendacao'),
  },
  circuitBreaker: {
    maxFalhas: Number(process.env.REPO_PROFISSIONAIS_MAX_FALHAS ?? 3),
    resetMs: Number(process.env.REPO_PROFISSIONAIS_RESET_MS ?? 15000),
  },
};
