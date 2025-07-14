<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ yarn install
```

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Run tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ yarn install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

# IntelliKit Backend

A NestJS backend application with GraphQL API for ChatGPT integration and user management.

## Features

- **GraphQL API** with Apollo Server
- **Gemini Integration** with Google Gemini API
- **User Management** with authentication
- **Chat Sessions** with message history
- **System Prompts** management
- **PostgreSQL Database** with TypeORM

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- Google Gemini API Key

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd intellikit-be
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up PostgreSQL:**
   ```bash
   # Create database
   createdb intellikit
   
   # Or using psql
   psql -U postgres
   CREATE DATABASE intellikit;
   \q
   ```

4. **Environment Configuration:**
   Create a `.env` file in the root directory:
   ```bash
   # Database Configuration (PostgreSQL)
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_NAME=intellikit
   
   # Gemini Configuration
NEST_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
   
   # Application
   NODE_ENV=development
   PORT=8080
   ```

## Running the Application

### Development
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm run start:prod
```

## API Documentation

### GraphQL Playground
Access the GraphQL playground at: `http://localhost:8080/graphql`

### Available Operations

#### Queries:
- `chatSession(id: ID!)` - Get a specific chat session
- `chatSessions(userId: ID!)` - Get all chat sessions for a user
- `systemPrompts(userId: ID!)` - Get all system prompts for a user
- `user(id: String!)` - Get a specific user

#### Mutations:
- `createChatSession(input: CreateChatSessionInput!)` - Create a new chat session
- `updateChatSession(input: UpdateChatSessionInput!)` - Update a chat session
- `deleteChatSession(id: ID!)` - Delete a chat session
- `sendMessage(input: SendMessageInput!)` - Send a message and get AI response
- `createSystemPrompt(input: CreateSystemPromptInput!)` - Create a system prompt
- `deleteSystemPrompt(id: ID!)` - Delete a system prompt
- `createUser(email: String!, firstName: String!, lastName: String!)` - Create a user
- `createTestUser()` - Create a test user

## Database Schema

The application uses PostgreSQL with the following main entities:
- **Users** - User accounts and profiles
- **ChatSessions** - Chat conversation sessions
- **ChatMessages** - Individual messages in conversations
- **SystemPrompts** - Custom system prompts for AI behavior

## Testing

```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Deployment

### Docker (Recommended)
```bash
# Build the image
docker build -t intellikit-be .

# Run with environment variables
docker run -p 8080:8080 \
  -e DB_HOST=your_db_host \
  -e DB_PORT=5432 \
  -e DB_USERNAME=your_db_user \
  -e DB_PASSWORD=your_db_password \
  -e DB_NAME=intellikit \
  -e NEST_PUBLIC_GEMINI_API_KEY=your_gemini_key \
  intellikit-be
```

### Cloud Platforms
This application is optimized for deployment on:
- **Heroku** - Easy PostgreSQL integration
- **Railway** - Built-in PostgreSQL support
- **Render** - PostgreSQL add-on available
- **DigitalOcean** - Managed PostgreSQL databases
- **AWS RDS** - PostgreSQL service

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.
