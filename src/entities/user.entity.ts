import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ChatSession } from './chat-session.entity';
import { SystemPrompt } from './system-prompt.entity';

@ObjectType()
@Entity('users')
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  @Column({ default: true })
  isActive: boolean;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => [ChatSession])
  @OneToMany(() => ChatSession, (chatSession) => chatSession.user)
  chatSessions: ChatSession[];

  @Field(() => [SystemPrompt])
  @OneToMany(() => SystemPrompt, (systemPrompt) => systemPrompt.user)
  systemPrompts: SystemPrompt[];
}
