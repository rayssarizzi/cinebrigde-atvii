import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Recomendacao } from './Recomendacao';
import { Profissional } from './Profissional';
import type { Papel, StatusConvite } from '../domain/tipos';

@Entity('convites')
export class Convite {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Recomendacao, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recomendacao_id' })
  recomendacao!: Recomendacao;

  @ManyToOne(() => Profissional, { eager: true })
  @JoinColumn({ name: 'profissional_id' })
  profissional!: Profissional;

  @Column()
  papel!: Papel;

  @Column({ default: 'pendente' })
  status!: StatusConvite;

  @CreateDateColumn({ name: 'enviado_em' })
  enviadoEm!: Date;

  @UpdateDateColumn({ name: 'respondido_em', nullable: true })
  respondidoEm?: Date;
}
