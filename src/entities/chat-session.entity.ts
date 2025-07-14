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
  GEMINI_1_5_PRO = 'gemini-1.5-pro',
  GEMINI_2_0_FLASH = 'gemini-2.0-flash',
}

registerEnumType(ChatModel, {
  name: 'ChatModel',
  description: 'Available Gemini models',
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
    default: ChatModel.GEMINI_2_0_FLASH,
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
