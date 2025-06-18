# Projeto de Engenharia de Software: Arquitetura e Padrões

## Objetivo

Desenvolver uma API para um sistema de Gestão de Tarefas Colaborativas, permitindo que usuários criem, editem, atribuam e concluam tarefas. A API seguirá uma arquitetura MVC, e `implementará duas features adicionais como comentários em tarefas e sistema de notificação conforme os itens são atualizado`.

## Pre-requisitos

### Alternativa 1

- [node](https://nodejs.org/en/download)
- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

- [eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) - optional

### Alternativa 2

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

Run project

``` sh
npm run start
```

## Arquitetura: MVC

``` md
project-root/
│
├── collection/                         # Requests para a API feita com o Bruno
│
├── docs/                               # Arquivos utilizados na documentação, como imagens
│
├── src/
│   ├── controllers/                    # Lógica dos endpoints HTTP (Handlers)
│   │   ├── auth.controller.ts
│   │   ├── task.controller.ts
│   │   └── user.controller.ts
│
│   ├── routes/                         # Registro das rotas no Fastify
│   │   ├── auth.routes.ts
│   │   ├── task.routes.ts
│   │   └── user.routes.ts
│
│   ├── schemas/                        # Validação e tipagem com Zod
│   │   ├── auth.schema.ts
│   │   ├── task.schema.ts
│   │   ├── user.schema.ts
│
│   ├── models/                         # Funções com implementação no banco
│   │   ├── task.model.ts
│   │   ├── user.model.ts
│   │   └── comment.model.ts
│
│   ├── db/                             # Conexão com o banco (PostgreSQL)
│   │   ├── app.db                      # Criado quando roda a build
│   │   └── migrations/
│
│   ├── middlewares/                    # Autenticação, erros, permissões
│   │   ├── auth.middleware.ts
│   │   └── error.middleware.ts
│
│   ├── plugins/                        # Plugins utilizados
│   │   ├── send-notification.plugin.ts
│   │   ├── templates
│   │   │   └── notification.templates.json
│
│   ├── utils/                          # Helpers, formatação, tokens, etc.
│   │   └── types.utils.ts
│
│   └── database.ts                     # Configurações do database
│
│   └── server.ts                       # Inicia o servidor
│
├── tests/                              # Testes com Jest
│   ├── unit/
│   │   ├── auth.spec.ts
│   │   ├── task.spec.ts
│   │   └── user.spec.ts
│   ├── integration/
│   │   ├── auth.spec.ts
│   │   ├── task.spec.ts
│   │   └── user.spec.ts
│   └── setup.ts                        # Configurações de um app do Fastify para os tests
│
├── .env
├── .env.example
├── .eslintrc.json
├── .gitignore
├── knexfile.ts
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.json
└── vitest.config.ts
```

## Estrutura do Banco de Dados

![alt text](docs/images/db-logic.png)

O seguinte comando cria o banco de dados no local

```sh
npm run knex -- migrate:latest
```

## Stack do Projeto

### 🟩 Node.js

Plataforma de execução JavaScript no servidor, escolhida por sua leveza, ecossistema maduro e excelente performance para APIs HTTP.

### 🟦 TypeScript

Superset do JavaScript que adiciona tipagem estática ao código, aumentando a segurança, legibilidade e produtividade durante o desenvolvimento.

### ⚡ Fastify

Framework web focado em performance e baixo consumo de recursos, ideal para criar APIs rápidas, com suporte nativo a schemas, plugins e integração com Swagger.

### 🧪 Zod

Biblioteca de validação de dados com foco em tipagem integrada ao TypeScript, usada para validar entradas da API (body, params, query) e gerar schemas reutilizáveis.

### 📚 Swagger

Ferramenta de documentação automática da API, permitindo que os endpoints sejam visualizados e testados via navegador com base nos schemas definidos em Zod.

### 🗄️ SQLite 3

Banco de dados relacional leve e embutido, ideal para aplicações de pequeno a médio porte. Utilizado por sua simplicidade, portabilidade e zero configuração, permitindo armazenamento local eficiente e confiável.

### 🧪 Vitest

Framework de testes rápido e moderno, inspirado no Jest, com suporte nativo a TypeScript e integração perfeita com bibliotecas como Vite. Ideal para escrever e executar testes unitários e de integração

### 🔒 Bcrypt

Biblioteca para hashing de senhas, utilizada para garantir a segurança das credenciais dos usuários, protegendo-as contra acessos não autorizados.
