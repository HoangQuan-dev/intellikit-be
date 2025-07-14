import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatSession } from '../entities/chat-session.entity';
import { ChatMessage } from '../entities/chat-message.entity';
import { SystemPrompt } from '../entities/system-prompt.entity';
import { User } from '../entities/user.entity';
import { ChatGptService } from './services/chatgpt.service';
import { OpenAIService } from './services/openai.service';
import { ChatGptResolver } from './resolvers/chatgpt.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatSession, ChatMessage, SystemPrompt, User]),
  ],
  providers: [ChatGptService, OpenAIService, ChatGptResolver],
  exports: [ChatGptService],
})
export class ChatGptModule {}
