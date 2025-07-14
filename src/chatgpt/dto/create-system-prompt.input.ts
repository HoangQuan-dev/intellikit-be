import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

@InputType()
export class CreateSystemPromptInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsNotEmpty()
  prompt: string;

  @Field({ nullable: true })
  @IsOptional()
  description?: string;

  @Field(() => ID)
  @IsUUID()
  userId: string;
}
