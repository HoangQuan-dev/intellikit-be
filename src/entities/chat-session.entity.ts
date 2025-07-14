import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { User } from './user.entity';
import { ChatMessage } from './chat-message.entity';

export enum ChatModel {
  GPT_3_5_TURBO = 'gpt-3.5-turbo',
  GPT_4 = 'gpt-4',
  GPT_4_TURBO = 'gpt-4-turbo',
  GPT_4O = 'gpt-4o',
}

registerEnumType(ChatModel, {
  name: 'ChatModel',
  description: 'Available ChatGPT models',
});

@ObjectType()
@Entity('chat_sessions')
export class ChatSession {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  title: string;

  @Field(() => ChatModel)
  @Column({
    type: 'varchar',
    enum: ChatModel,
    default: ChatModel.GPT_3_5_TURBO,
  })
  model: ChatModel;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  systemPrompt?: string;

  @Field()
  @Column({ default: true })
  isActive: boolean;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => ID)
  @Column('uuid')
  userId: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.chatSessions)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Field(() => [ChatMessage])
  @OneToMany(() => ChatMessage, (message) => message.chatSession)
  messages: ChatMessage[];
}
