import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType()
export class SendMessageInput {
  @Field(() => ID)
  @IsUUID()
  chatSessionId: string;

  @Field()
  @IsNotEmpty()
  message: string;
}
