import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatSession } from '../entities/chat-session.entity';
import { ChatMessage } from '../entities/chat-message.entity';
import { SystemPrompt } from '../entities/system-prompt.entity';
import { User } from '../entities/user.entity';
import { ChatGptService } from './services/chatgpt.service';
import { GeminiService } from './services/gemini.service';
import { ChatGptResolver } from './resolvers/chatgpt.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatSession, ChatMessage, SystemPrompt, User]),
  ],
  providers: [ChatGptService, GeminiService, ChatGptResolver],
  exports: [ChatGptService],
})
export class ChatGptModule {}
