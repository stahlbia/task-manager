# Projeto de Engenharia de Software: Arquitetura e Padrões

## Objetivo

Desenvolver uma API para um sistema de Gestão de Tarefas Colaborativas, permitindo que usuários criem, editem, atribuam e concluam tarefas. A API seguirá uma arquitetura MVC, garantindo boas práticas.

## Pre-requisitos

- [node](https://nodejs.org/en/download)
- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

### Instalação alternativa

Instalar o [nvm](https://github.com/nvm-sh/nvm)

``` sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
```

Instalar o node e o npm através do nvm:

``` sh
nvm install node
```

## Inicializando

Clonar o repositório

``` sh
git clone <github url>
```

Instalar dependencias

``` sh
cd <project_name>
npm install
```

Build and run

``` sh
npm start
```

## Arquitetura: MVC

``` md
project-root/
│
├── src/
│   ├── controllers/           # Lógica dos endpoints HTTP
│   │   ├── auth.controller.ts
│   │   ├── task.controller.ts
│   │   └── user.controller.ts
│
│   ├── routes/                # Registro das rotas no Fastify
│   │   ├── auth.routes.ts
│   │   ├── task.routes.ts
│   │   └── user.routes.ts
│
│   ├── schemas/               # Validação e tipagem com Zod
│   │   ├── task.schema.ts
│   │   ├── user.schema.ts
│   │   └── auth.schema.ts
│
│   ├── models/                # Mapeamento de dados (ORM ou SQL)
│   │   ├── task.model.ts
│   │   ├── user.model.ts
│   │   └── comment.model.ts
│
│   ├── services/              # Regras de negócio (camada intermediária)
│   │   ├── task.service.ts
│   │   ├── user.service.ts
│   │   └── auth.service.ts
│
│   ├── db/                    # Conexão com o banco (PostgreSQL)
│   │   ├── client.ts          # Ex: usando Prisma ou pg
│   │   └── migrations/        # (opcional) SQL ou ORM migrations
│
│   ├── middlewares/           # Autenticação, erros, permissões
│   │   ├── auth.middleware.ts
│   │   └── error.middleware.ts
│
│   ├── plugins/               # Plugins do Fastify (CORS, JWT, etc)
│   │   ├── auth.plugin.ts
│   │   ├── swagger.plugin.ts
│   │   └── zod.plugin.ts
│
│   ├── openapi/               # Arquivos OpenAPI/Swagger
│   │   └── openapi.yaml       # Pode ser usado com fastify-swagger
│
│   ├── utils/                 # Helpers, formatação, tokens, etc.
│   │   └── jwt.ts
│
│   ├── app.ts                 # Criação e configuração do Fastify
│   └── server.ts              # Inicia o servidor
│
├── tests/                     # Testes com Jest
│   ├── unit/
│   │   └── task.service.test.ts
│   └── integration/
│       └── task.routes.test.ts
│
├── .env
├── tsconfig.json
├── jest.config.ts
├── package.json
└── README.md
```

## Estrutura do Banco de Dados

![alt text](docs/images/db-logic.png)

## Stack do Projeto

### 🟩 Node.js

Plataforma de execução JavaScript no servidor, escolhida por sua leveza, ecossistema maduro e excelente performance para APIs HTTP.

### 🟦 TypeScript

Superset do JavaScript que adiciona tipagem estática ao código, aumentando a segurança, legibilidade e produtividade durante o desenvolvimento.

### ⚡ Fastify

Framework web focado em performance e baixo consumo de recursos, ideal para criar APIs rápidas, com suporte nativo a schemas, plugins e integração com Swagger.

### 🧪 Zod

Biblioteca de validação de dados com foco em **tipagem integrada ao TypeScript**, usada para validar entradas da API (body, params, query) e gerar schemas reutilizáveis.

### 📚 Swagger

Ferramenta de documentação automática da API, permitindo que os endpoints sejam visualizados e testados via navegador com base nos schemas definidos em Zod.

### 🐘 PostgreSQL

Banco de dados relacional robusto, usado para persistir dados de forma segura, escalável e confiável. Ideal para sistemas com múltiplas entidades e relacionamentos.

### ✅ Jest

Framework de testes em JavaScript/TypeScript, utilizado para escrever e executar testes automatizados garantindo o funcionamento correto das funcionalidades da API.

### 🌐 Open

Pacote usado para abrir automaticamente a URL do servidor no navegador assim que a API sobe, facilitando o acesso durante o desenvolvimento local.

## Tarefas para fazer

Emanu:

- [ ] Implementar o banco de dados com PostgreSQL (quem sabe através de migrations) -> Emanuzita
- [ ] Implementar API CRUD para comentários de taferas -> Emanuzita
- [ ] Implementar testes unitários - Emanuzita

Gabriela:

- [ ] Implementar API CRUD para usuários -> Gabrela
- [ ] Implementar API CRUD para tarefas -> Gabrela
- [ ] Implementar testes de integração - Gabrela

Bia:

- [ ] Implementar API CRUD para autenticação -> Bia
- [ ] Definir business cases para roles -> Bia
- [ ] Definir happy paths para cada role -> Bia
