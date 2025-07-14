import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatSession } from '../../entities/chat-session.entity';
import { ChatMessage, MessageRole } from '../../entities/chat-message.entity';
import { SystemPrompt } from '../../entities/system-prompt.entity';
import { User } from '../../entities/user.entity';
import { GeminiService } from './gemini.service';
import { CreateChatSessionInput } from '../dto/create-chat-session.input';
import { UpdateChatSessionInput } from '../dto/update-chat-session.input';
import { SendMessageInput } from '../dto/send-message.input';
import { ChatResponse } from '../dto/chat-response.dto';
import { CreateSystemPromptInput } from '../dto/create-system-prompt.input';

@Injectable()
export class ChatGptService {
  constructor(
    @InjectRepository(ChatSession)
    private chatSessionRepository: Repository<ChatSession>,
    @InjectRepository(ChatMessage)
    private chatMessageRepository: Repository<ChatMessage>,
    @InjectRepository(SystemPrompt)
    private systemPromptRepository: Repository<SystemPrompt>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private geminiService: GeminiService,
  ) {}

  async createChatSession(input: CreateChatSessionInput): Promise<ChatSession> {
    const user = await this.userRepository.findOne({
      where: { id: input.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const chatSession = this.chatSessionRepository.create({
      title: input.title,
      model: input.model,
      systemPrompt: input.systemPrompt,
      userId: input.userId,
    });

    return await this.chatSessionRepository.save(chatSession);
  }

  async getChatSession(id: string): Promise<ChatSession> {
    const chatSession = await this.chatSessionRepository.findOne({
      where: { id },
      relations: ['user', 'messages'],
    });

    if (!chatSession) {
      throw new NotFoundException('Chat session not found');
    }

    return chatSession;
  }

  async getChatSessions(userId: string): Promise<ChatSession[]> {
    return await this.chatSessionRepository.find({
      where: { userId, isActive: true },
      relations: ['messages'],
      order: { updatedAt: 'DESC' },
    });
  }

  async updateChatSession(input: UpdateChatSessionInput): Promise<ChatSession> {
    const chatSession = await this.chatSessionRepository.findOne({
      where: { id: input.id },
    });

    if (!chatSession) {
      throw new NotFoundException('Chat session not found');
    }

    Object.assign(chatSession, input);
    return await this.chatSessionRepository.save(chatSession);
  }

  async deleteChatSession(id: string): Promise<boolean> {
    const chatSession = await this.chatSessionRepository.findOne({
      where: { id },
    });

    if (!chatSession) {
      throw new NotFoundException('Chat session not found');
    }

    chatSession.isActive = false;
    await this.chatSessionRepository.save(chatSession);
    return true;
  }

  async sendMessage(input: SendMessageInput): Promise<ChatResponse> {
    const chatSession = await this.chatSessionRepository.findOne({
      where: { id: input.chatSessionId },
      relations: ['messages'],
    });

    if (!chatSession) {
      throw new NotFoundException('Chat session not found');
    }

    // Create user message
    const userMessage = this.chatMessageRepository.create({
      role: MessageRole.USER,
      content: input.message,
      chatSessionId: input.chatSessionId,
    });

    const savedUserMessage = await this.chatMessageRepository.save(userMessage);

    // Prepare messages for OpenAI
    const messages = (chatSession.messages ?? [])
      .sort(
        (a: ChatMessage, b: ChatMessage) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      )
      .map((msg: ChatMessage) => ({
        role: msg.role,
        content: msg.content,
      }));

    // Add system prompt if exists
    if (chatSession.systemPrompt) {
      messages.unshift({
        role: MessageRole.SYSTEM,
        content: chatSession.systemPrompt,
      });
    }

    // Add current user message
    messages.push({
      role: MessageRole.USER,
      content: input.message,
    });

    // Get response from Gemini
    const geminiMessages = this.geminiService.convertToOpenAIMessages(messages);
    const aiResponse = await this.geminiService.createChatCompletion(
      geminiMessages,
      chatSession.model,
    );

    // Create assistant message
    const assistantMessage = this.chatMessageRepository.create({
      role: MessageRole.ASSISTANT,
      content: aiResponse.content,
      chatSessionId: input.chatSessionId,
      tokenCount: aiResponse.completionTokens,
    });

    const savedAssistantMessage =
      await this.chatMessageRepository.save(assistantMessage);

    // Update user message with token count
    savedUserMessage.tokenCount = aiResponse.promptTokens;
    await this.chatMessageRepository.save(savedUserMessage);

    return {
      chatSessionId: input.chatSessionId,
      userMessage: savedUserMessage,
      assistantMessage: savedAssistantMessage,
      totalTokens: aiResponse.totalTokens,
      promptTokens: aiResponse.promptTokens,
      completionTokens: aiResponse.completionTokens,
    };
  }

  async createSystemPrompt(
    input: CreateSystemPromptInput,
  ): Promise<SystemPrompt> {
    const user = await this.userRepository.findOne({
      where: { id: input.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const systemPrompt = this.systemPromptRepository.create({
      name: input.name,
      prompt: input.prompt,
      description: input.description,
      userId: input.userId,
    });

    return await this.systemPromptRepository.save(systemPrompt);
  }

  async getSystemPrompts(userId: string): Promise<SystemPrompt[]> {
    return await this.systemPromptRepository.find({
      where: { userId, isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async deleteSystemPrompt(id: string): Promise<boolean> {
    const systemPrompt = await this.systemPromptRepository.findOne({
      where: { id },
    });

    if (!systemPrompt) {
      throw new NotFoundException('System prompt not found');
    }

    systemPrompt.isActive = false;
    await this.systemPromptRepository.save(systemPrompt);
    return true;
  }
}
