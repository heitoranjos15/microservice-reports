import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sample')
export class Sample {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({name: 'created_at'})
  createdAt: Date;

}
