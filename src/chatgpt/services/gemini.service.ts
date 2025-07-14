import { Injectable } from '@nestjs/common';
import { ChatModel } from '../../entities/chat-session.entity';
import { MessageRole } from '../../entities/chat-message.entity';

export interface ChatCompletionMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatCompletionResponse {
  content: string;
  totalTokens: number;
  promptTokens: number;
  completionTokens: number;
}

export interface GeminiErrorResponse {
  error?: {
    message: string;
  };
}

export interface GeminiCompletionResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
  usageMetadata?: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
}

@Injectable()
export class GeminiService {
  private readonly apiKey: string;
  private readonly baseUrl =
    'https://generativelanguage.googleapis.com/v1beta/models';

  constructor() {
    this.apiKey = process.env.NEST_PUBLIC_GEMINI_API_KEY || '';
    if (!this.apiKey) {
      throw new Error(
        'NEST_PUBLIC_GEMINI_API_KEY environment variable is required',
      );
    }
  }

  async createChatCompletion(
    messages: ChatCompletionMessage[],
    model: ChatModel = ChatModel.GEMINI_2_0_FLASH,
  ): Promise<ChatCompletionResponse> {
    // Map OpenAI models to Gemini models
    const geminiModel = this.mapToGeminiModel(model);
    console.log(geminiModel);
    // Convert messages to Gemini format
    const geminiMessages = this.convertToGeminiMessages(messages);
    console.log(geminiMessages);
    const response = await fetch(
      `${this.baseUrl}/${geminiModel}:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: geminiMessages,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2000,
          },
        }),
      },
    );

    if (!response.ok) {
      const error = (await response.json()) as GeminiErrorResponse;
      throw new Error(
        `Gemini API error: ${error.error?.message || 'Unknown error'}`,
      );
    }

    const data = (await response.json()) as GeminiCompletionResponse;
    const candidate = data.candidates[0];
    const content = candidate.content.parts[0].text;
    console.log(content);
    // Extract token usage if available
    const usage = data.usageMetadata || {
      promptTokenCount: 0,
      candidatesTokenCount: 0,
      totalTokenCount: 0,
    };

    return {
      content,
      totalTokens: usage.totalTokenCount,
      promptTokens: usage.promptTokenCount,
      completionTokens: usage.candidatesTokenCount,
    };
  }

  convertToOpenAIMessages(
    messages: Array<{ role: MessageRole; content: string }>,
  ): ChatCompletionMessage[] {
    return messages.map((msg) => ({
      role: msg.role as 'user' | 'assistant' | 'system',
      content: msg.content,
    }));
  }

  private mapToGeminiModel(geminiModel: ChatModel): string {
    console.log(geminiModel);
    switch (geminiModel) {
      case ChatModel.GEMINI_1_5_PRO:
        return 'gemini-1.5-pro';
      case ChatModel.GEMINI_2_0_FLASH:
      default:
        return 'gemini-2.0-flash';
    }
  }

  private convertToGeminiMessages(messages: ChatCompletionMessage[]): Array<{
    role: 'user' | 'model';
    parts: Array<{ text: string }>;
  }> {
    const geminiMessages: Array<{
      role: 'user' | 'model';
      parts: Array<{ text: string }>;
    }> = [];
    console.log(messages);
    for (const message of messages) {
      if (message.role === 'system') {
        // For system messages, we'll prepend them to the first user message
        // or create a separate user message with the system content
        continue;
      }
      console.log(message);
      geminiMessages.push({
        role: message.role === 'user' ? 'user' : 'model',
        parts: [{ text: message.content }],
      });
    }

    // Handle system messages by prepending to the first user message
    const systemMessages = messages.filter((msg) => msg.role === 'system');
    if (systemMessages.length > 0 && geminiMessages.length > 0) {
      const firstUserMessage = geminiMessages.find(
        (msg) => msg.role === 'user',
      );
      if (firstUserMessage) {
        const systemContent = systemMessages
          .map((msg) => msg.content)
          .join('\n');
        firstUserMessage.parts[0].text = `${systemContent}\n\n${firstUserMessage.parts[0].text}`;
      }
    }

    return geminiMessages;
  }
}
