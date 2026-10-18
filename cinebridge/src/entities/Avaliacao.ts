import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Profissional } from './Profissional';

@Entity('avaliacoes')
export class Avaliacao {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Profissional, (profissional) => profissional.avaliacoes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'profissional_id' })
  profissional!: Profissional;

  @Column()
  projetoId!: string;

  @Column('decimal', { precision: 3, scale: 2 })
  nota!: number;

  @Column({ nullable: true, type: 'text' })
  comentario?: string;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm!: Date;
}
