import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PerfilCompetencia } from './PerfilCompetencia';

@Entity('competencias')
export class Competencia {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  nome!: string;

  @Column({ nullable: true })
  categoria?: string;

  @OneToMany(() => PerfilCompetencia, (perfil) => perfil.competencia)
  perfis!: PerfilCompetencia[];
}
