import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { ChatMessage } from '../../entities/chat-message.entity';

@ObjectType()
export class ChatResponse {
  @Field(() => ID)
  chatSessionId: string;

  @Field(() => ChatMessage)
  userMessage: ChatMessage;

  @Field(() => ChatMessage)
  assistantMessage: ChatMessage;

  @Field(() => Int)
  totalTokens: number;

  @Field(() => Int)
  promptTokens: number;

  @Field(() => Int)
  completionTokens: number;
}
