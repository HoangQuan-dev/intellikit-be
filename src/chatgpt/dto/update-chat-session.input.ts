import { InputType, Field, ID } from '@nestjs/graphql';
import { IsOptional, IsEnum, IsUUID, IsBoolean } from 'class-validator';
import { ChatModel } from '../../entities/chat-session.entity';

@InputType()
export class UpdateChatSessionInput {
  @Field(() => ID)
  @IsUUID()
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  title?: string;

  @Field(() => ChatModel, { nullable: true })
  @IsOptional()
  @IsEnum(ChatModel)
  model?: ChatModel;

  @Field({ nullable: true })
  @IsOptional()
  systemPrompt?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
