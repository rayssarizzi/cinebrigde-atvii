import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Projeto } from './Projeto';
import type { Papel } from '../domain/tipos';

@Entity('papeis_requisito')
export class PapelRequisito {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Projeto, (projeto) => projeto.papeisRequisito, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projeto_id' })
  projeto!: Projeto;

  @Column()
  papel!: Papel;

  @Column('decimal', { precision: 4, scale: 3 })
  peso!: number;

  @Column('jsonb', { default: {} })
  requisitosCompetencia!: Record<string, number>;
}
