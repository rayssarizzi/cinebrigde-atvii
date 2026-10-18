import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Profissional } from './Profissional';
import { Competencia } from './Competencia';

@Entity('perfis_competencia')
export class PerfilCompetencia {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Profissional, (profissional) => profissional.perfilCompetencias, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'profissional_id' })
  profissional!: Profissional;

  @ManyToOne(() => Competencia, (competencia) => competencia.perfis, { eager: true })
  @JoinColumn({ name: 'competencia_id' })
  competencia!: Competencia;

  @Column('decimal', { precision: 4, scale: 3, default: 0 })
  nivel!: number;
}
