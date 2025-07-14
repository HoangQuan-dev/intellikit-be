import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { ChatSession } from './chat-session.entity';

export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
}

registerEnumType(MessageRole, {
  name: 'MessageRole',
  description: 'Role of the message sender',
});

@ObjectType()
@Entity('chat_messages')
export class ChatMessage {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => MessageRole)
  @Column({
    type: 'varchar',
    enum: MessageRole,
  })
  role: MessageRole;

  @Field()
  @Column({ type: 'text' })
  content: string;

  @Field({ nullable: true })
  @Column({ type: 'int', nullable: true })
  tokenCount?: number;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => ID)
  @Column('uuid')
  chatSessionId: string;

  @Field(() => ChatSession)
  @ManyToOne(() => ChatSession, (chatSession) => chatSession.messages)
  @JoinColumn({ name: 'chatSessionId' })
  chatSession: ChatSession;
}
