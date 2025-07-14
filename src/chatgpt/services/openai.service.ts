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

interface OpenAIErrorResponse {
  error?: {
    message?: string;
  };
}

interface OpenAICompletionResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  usage: {
    total_tokens: number;
    prompt_tokens: number;
    completion_tokens: number;
  };
}

@Injectable()
export class OpenAIService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.openai.com/v1/chat/completions';

  constructor() {
    this.apiKey = process.env.NEST_PUBLIC_OPENAI_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }
  }

  async createChatCompletion(
    messages: ChatCompletionMessage[],
    model: ChatModel = ChatModel.GPT_3_5_TURBO,
  ): Promise<ChatCompletionResponse> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = (await response.json()) as OpenAIErrorResponse;
      throw new Error(
        `OpenAI API error: ${error.error?.message || 'Unknown error'}`,
      );
    }

    const data = (await response.json()) as OpenAICompletionResponse;
    const choice = data.choices[0];

    return {
      content: choice.message.content,
      totalTokens: data.usage.total_tokens,
      promptTokens: data.usage.prompt_tokens,
      completionTokens: data.usage.completion_tokens,
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
}
