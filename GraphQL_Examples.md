# ChatGPT Tool GraphQL Examples

This document contains comprehensive examples for testing the ChatGPT tool queries and mutations.

## Prerequisites

1. Make sure you have a user created in the database
2. Set the `OPENAI_API_KEY` environment variable
3. Database should be running and connected

## Environment Variables

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=1433
DB_USERNAME=sa
DB_PASSWORD=your_password
DB_NAME=intellikit

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
```

## 1. System Prompt Operations

### Create System Prompt

```graphql
mutation CreateSystemPrompt {
  createSystemPrompt(input: {
    name: "Code Assistant"
    prompt: "You are a helpful coding assistant. Always provide clean, well-commented code and explain your solutions clearly."
    description: "A system prompt for helping with coding tasks"
    userId: "your-user-id-here"
  }) {
    id
    name
    prompt
    description
    isActive
    createdAt
    updatedAt
  }
}
```

### Get User's System Prompts

```graphql
query GetSystemPrompts {
  systemPrompts(userId: "your-user-id-here") {
    id
    name
    prompt
    description
    isActive
    isDefault
    createdAt
    updatedAt
  }
}
```

### Delete System Prompt

```graphql
mutation DeleteSystemPrompt {
  deleteSystemPrompt(id: "system-prompt-id-here")
}
```

## 2. Chat Session Operations

### Create Chat Session (with GPT-3.5)

```graphql
mutation CreateChatSession {
  createChatSession(input: {
    title: "General Chat"
    model: GPT_3_5_TURBO
    userId: "your-user-id-here"
  }) {
    id
    title
    model
    systemPrompt
    isActive
    createdAt
    updatedAt
    userId
  }
}
```

### Create Chat Session (with GPT-4 and System Prompt)

```graphql
mutation CreateChatSessionWithSystemPrompt {
  createChatSession(input: {
    title: "Code Review Session"
    model: GPT_4
    systemPrompt: "You are a senior software engineer conducting a code review. Provide constructive feedback and suggest improvements."
    userId: "your-user-id-here"
  }) {
    id
    title
    model
    systemPrompt
    isActive
    createdAt
    updatedAt
    userId
  }
}
```

### Get Chat Session

```graphql
query GetChatSession {
  chatSession(id: "chat-session-id-here") {
    id
    title
    model
    systemPrompt
    isActive
    createdAt
    updatedAt
    user {
      id
      email
      firstName
      lastName
    }
    messages {
      id
      role
      content
      tokenCount
      createdAt
    }
  }
}
```

### Get User's Chat Sessions

```graphql
query GetChatSessions {
  chatSessions(userId: "your-user-id-here") {
    id
    title
    model
    systemPrompt
    isActive
    createdAt
    updatedAt
    messages {
      id
      role
      content
      tokenCount
      createdAt
    }
  }
}
```

### Update Chat Session

```graphql
mutation UpdateChatSession {
  updateChatSession(input: {
    id: "chat-session-id-here"
    title: "Updated Chat Title"
    model: GPT_4
    systemPrompt: "Updated system prompt"
  }) {
    id
    title
    model
    systemPrompt
    isActive
    updatedAt
  }
}
```

### Delete Chat Session

```graphql
mutation DeleteChatSession {
  deleteChatSession(id: "chat-session-id-here")
}
```

## 3. Chat Message Operations

### Send Message

```graphql
mutation SendMessage {
  sendMessage(input: {
    chatSessionId: "chat-session-id-here"
    message: "Hello! Can you help me write a Python function to calculate the factorial of a number?"
  }) {
    chatSessionId
    userMessage {
      id
      role
      content
      tokenCount
      createdAt
    }
    assistantMessage {
      id
      role
      content
      tokenCount
      createdAt
    }
    totalTokens
    promptTokens
    completionTokens
  }
}
```

### Send Follow-up Message

```graphql
mutation SendFollowupMessage {
  sendMessage(input: {
    chatSessionId: "chat-session-id-here"
    message: "Can you also add error handling to the factorial function?"
  }) {
    chatSessionId
    userMessage {
      id
      role
      content
      tokenCount
      createdAt
    }
    assistantMessage {
      id
      role
      content
      tokenCount
      createdAt
    }
    totalTokens
    promptTokens
    completionTokens
  }
}
```

## 4. Complete Example Workflow

Here's a complete example workflow for testing the ChatGPT tool:

### Step 1: Create a System Prompt

```graphql
mutation {
  createSystemPrompt(input: {
    name: "JavaScript Expert"
    prompt: "You are a JavaScript expert. Provide modern ES6+ solutions with explanations."
    description: "Expert JavaScript assistant"
    userId: "user-123"
  }) {
    id
    name
  }
}
```

### Step 2: Create a Chat Session

```graphql
mutation {
  createChatSession(input: {
    title: "JavaScript Help Session"
    model: GPT_4
    systemPrompt: "You are a JavaScript expert. Provide modern ES6+ solutions with explanations."
    userId: "user-123"
  }) {
    id
    title
    model
  }
}
```

### Step 3: Send Messages

```graphql
mutation {
  sendMessage(input: {
    chatSessionId: "session-456"
    message: "How do I use async/await with fetch API?"
  }) {
    userMessage {
      content
      createdAt
    }
    assistantMessage {
      content
      createdAt
    }
    totalTokens
  }
}
```

### Step 4: Continue Conversation

```graphql
mutation {
  sendMessage(input: {
    chatSessionId: "session-456"
    message: "Can you show me error handling for this?"
  }) {
    assistantMessage {
      content
    }
    totalTokens
  }
}
```

### Step 5: Get Chat History

```graphql
query {
  chatSession(id: "session-456") {
    title
    model
    messages {
      role
      content
      createdAt
    }
  }
}
```

## 5. Testing with GraphQL Playground

1. Start your application: `npm run start:dev`
2. Open GraphQL Playground: `http://localhost:8080/graphql`
3. Use the examples above to test functionality

## 6. Common Use Cases

### Create a Code Review Session

```graphql
mutation {
  createChatSession(input: {
    title: "Code Review"
    model: GPT_4
    systemPrompt: "You are a senior software engineer. Review code for best practices, security, and performance."
    userId: "user-123"
  }) {
    id
  }
}
```

### Create a Creative Writing Session

```graphql
mutation {
  createChatSession(input: {
    title: "Creative Writing"
    model: GPT_4
    systemPrompt: "You are a creative writing assistant. Help with storytelling, character development, and narrative structure."
    userId: "user-123"
  }) {
    id
  }
}
```

### Create a Technical Documentation Session

```graphql
mutation {
  createChatSession(input: {
    title: "Documentation Help"
    model: GPT_3_5_TURBO
    systemPrompt: "You are a technical writing expert. Help create clear, comprehensive documentation."
    userId: "user-123"
  }) {
    id
  }
}
```

## 7. Error Handling Examples

### Invalid User ID

```graphql
mutation {
  createChatSession(input: {
    title: "Test Session"
    model: GPT_3_5_TURBO
    userId: "invalid-user-id"
  }) {
    id
  }
}
```

Expected Response:
```json
{
  "errors": [
    {
      "message": "User not found",
      "extensions": {
        "code": "NOT_FOUND"
      }
    }
  ]
}
```

### Invalid Chat Session ID

```graphql
mutation {
  sendMessage(input: {
    chatSessionId: "invalid-session-id"
    message: "Hello"
  }) {
    assistantMessage {
      content
    }
  }
}
```

Expected Response:
```json
{
  "errors": [
    {
      "message": "Chat session not found",
      "extensions": {
        "code": "NOT_FOUND"
      }
    }
  ]
}
```

## 8. Performance Testing

### Multiple Messages in Sequence

```graphql
mutation Message1 {
  sendMessage(input: {
    chatSessionId: "session-id"
    message: "What is React?"
  }) {
    totalTokens
  }
}

mutation Message2 {
  sendMessage(input: {
    chatSessionId: "session-id"
    message: "How does useState work?"
  }) {
    totalTokens
  }
}

mutation Message3 {
  sendMessage(input: {
    chatSessionId: "session-id"
    message: "Explain useEffect"
  }) {
    totalTokens
  }
}
```

## 9. Advanced Queries

### Get Chat Sessions with Message Count

```graphql
query {
  chatSessions(userId: "user-123") {
    id
    title
    model
    createdAt
    messages {
      id
    }
  }
}
```

### Get Full Chat History with Token Usage

```graphql
query {
  chatSession(id: "session-id") {
    title
    model
    systemPrompt
    messages {
      role
      content
      tokenCount
      createdAt
    }
  }
}
```

This comprehensive set of examples covers all the major functionality of the ChatGPT tool and provides a solid foundation for testing and using the API. 