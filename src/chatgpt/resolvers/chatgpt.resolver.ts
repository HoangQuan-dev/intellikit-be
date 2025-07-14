import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ChatGptService } from '../services/chatgpt.service';
import { ChatSession } from '../../entities/chat-session.entity';
import { SystemPrompt } from '../../entities/system-prompt.entity';
import { CreateChatSessionInput } from '../dto/create-chat-session.input';
import { UpdateChatSessionInput } from '../dto/update-chat-session.input';
import { SendMessageInput } from '../dto/send-message.input';
import { CreateSystemPromptInput } from '../dto/create-system-prompt.input';
import { ChatResponse } from '../dto/chat-response.dto';

@Resolver(() => ChatSession)
export class ChatGptResolver {
  constructor(private readonly chatGptService: ChatGptService) {}

  // Chat Session Queries
  @Query(() => ChatSession, { name: 'chatSession' })
  async getChatSession(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<ChatSession> {
    return await this.chatGptService.getChatSession(id);
  }

  @Query(() => [ChatSession], { name: 'chatSessions' })
  async getChatSessions(
    @Args('userId', { type: () => ID }) userId: string,
  ): Promise<ChatSession[]> {
    return await this.chatGptService.getChatSessions(userId);
  }

  @Query(() => [SystemPrompt], { name: 'systemPrompts' })
  async getSystemPrompts(
    @Args('userId', { type: () => ID }) userId: string,
  ): Promise<SystemPrompt[]> {
    return await this.chatGptService.getSystemPrompts(userId);
  }

  // Chat Session Mutations
  @Mutation(() => ChatSession, { name: 'createChatSession' })
  async createChatSession(
    @Args('input') input: CreateChatSessionInput,
  ): Promise<ChatSession> {
    return await this.chatGptService.createChatSession(input);
  }

  @Mutation(() => ChatSession, { name: 'updateChatSession' })
  async updateChatSession(
    @Args('input') input: UpdateChatSessionInput,
  ): Promise<ChatSession> {
    return await this.chatGptService.updateChatSession(input);
  }

  @Mutation(() => Boolean, { name: 'deleteChatSession' })
  async deleteChatSession(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return await this.chatGptService.deleteChatSession(id);
  }

  // Chat Message Mutations
  @Mutation(() => ChatResponse, { name: 'sendMessage' })
  async sendMessage(
    @Args('input') input: SendMessageInput,
  ): Promise<ChatResponse> {
    return await this.chatGptService.sendMessage(input);
  }

  // System Prompt Mutations
  @Mutation(() => SystemPrompt, { name: 'createSystemPrompt' })
  async createSystemPrompt(
    @Args('input') input: CreateSystemPromptInput,
  ): Promise<SystemPrompt> {
    return await this.chatGptService.createSystemPrompt(input);
  }

  @Mutation(() => Boolean, { name: 'deleteSystemPrompt' })
  async deleteSystemPrompt(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return await this.chatGptService.deleteSystemPrompt(id);
  }
}
