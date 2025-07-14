import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { ChatModel } from '../../entities/chat-session.entity';

@InputType()
export class CreateChatSessionInput {
  @Field()
  @IsNotEmpty()
  title: string;

  @Field(() => ChatModel, { defaultValue: ChatModel.GPT_3_5_TURBO })
  @IsEnum(ChatModel)
  model: ChatModel;

  @Field({ nullable: true })
  @IsOptional()
  systemPrompt?: string;

  @Field(() => ID)
  @IsUUID()
  userId: string;
}
