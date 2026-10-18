import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PerfilCompetencia } from './PerfilCompetencia';
import { Avaliacao } from './Avaliacao';
import type { Papel } from '../domain/tipos';

@Entity('profissionais')
export class Profissional {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  nome!: string;

  @Column('simple-array', { default: '' })
  especialidades!: Papel[];

  @Column('decimal', { precision: 10, scale: 2 })
  precoMinimo!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  precoMaximo!: number;

  @Column()
  localizacao!: string;

  @Column({ default: true })
  ativo!: boolean;

  @Column('jsonb', { default: [] })
  bloqueiosAgenda!: { inicio: string; fim: string }[];

  @Column('int', { default: 0 })
  projetosConcluidos!: number;

  @OneToMany(() => PerfilCompetencia, (perfil) => perfil.profissional, { cascade: true })
  perfilCompetencias!: PerfilCompetencia[];

  @OneToMany(() => Avaliacao, (avaliacao) => avaliacao.profissional)
  avaliacoes!: Avaliacao[];

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm!: Date;

  vetorCompetencias?: Record<string, number>;

  mediaAvaliacoes(): number {
    if (!this.avaliacoes || this.avaliacoes.length === 0) return 0;
    const soma = this.avaliacoes.reduce((acc, a) => acc + Number(a.nota), 0);
    return soma / this.avaliacoes.length;
  }

  estaDisponivelEntre(inicio: Date, fim: Date): boolean {
    return !this.bloqueiosAgenda.some((bloqueio) => {
      const bInicio = new Date(bloqueio.inicio);
      const bFim = new Date(bloqueio.fim);
      return inicio <= bFim && fim >= bInicio;
    });
  }
}
