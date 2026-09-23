# Fade Barbearia

Sistema de agendamento online para barbearia. O cliente escolhe o serviço, o dia e um dos horários livres; a barbearia acompanha a agenda do dia e mantém o catálogo de serviços atualizado. A disponibilidade é calculada em tempo real a partir da duração de cada serviço e dos agendamentos já existentes, então o mesmo horário nunca é vendido duas vezes.

**Acesse:** https://sistemaagendamento-smoky.vercel.app

> ⏳ A API está hospedada no plano gratuito do Render, que hiberna depois de um tempo sem uso. O primeiro acesso pode levar até 50 segundos enquanto o servidor acorda — os seguintes são instantâneos.

**Demonstração como administrador:**

| E-mail | Senha |
| --- | --- |
| `admin@barbershop.com` | `admin123` |

Para ver a experiência do cliente, basta criar uma conta pela tela de cadastro.

---

## Sumário

- [Stack](#stack)
- [Funcionalidades](#funcionalidades)
- [Decisões técnicas](#decisões-técnicas)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Rodando localmente](#rodando-localmente)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Endpoints da API](#endpoints-da-api)
- [Autora](#autora)

---

## Stack

**Frontend**

- React 19 com TypeScript
- Vite
- Tailwind CSS 4
- React Router
- Axios
- shadcn/ui sobre Radix UI (diálogos, select, badge, skeleton)
- Framer Motion (transições e micro-interações)
- Sonner (notificações) e Lucide (ícones)

**Backend**

- Node.js com TypeScript
- Express 5
- Prisma ORM 7
- Zod (validação de entrada)
- JSON Web Token e bcrypt (autenticação)

**Infraestrutura**

- PostgreSQL no Neon
- API no Render
- Frontend na Vercel

---

## Funcionalidades

### Cliente

- Cadastro e login com sessão persistida no navegador
- Catálogo de serviços com foto, duração, preço e quantidade de horários livres
- Agendamento em três passos: serviço → data → horário
- Apenas horários realmente livres aparecem na lista, já descontando a duração do serviço
- Observações opcionais para o barbeiro
- Página "Meus agendamentos" separando próximos e histórico
- Cancelamento com confirmação, devolvendo o horário para a agenda na hora

### Administrador

- Agenda do dia com navegação por data, nome e telefone do cliente
- Indicadores do dia: agendados, total e receita prevista
- Visão dos próximos sete dias com a carga de cada dia
- Marcar atendimento como concluído ou cancelar
- CRUD de serviços: criar, editar, ativar/desativar e excluir
- Serviços inativos somem para o cliente, mas continuam no catálogo interno

---

## Decisões técnicas

### Nenhum horário vendido duas vezes

A checagem não é "existe agendamento começando nesse horário?", e sim uma comparação de intervalos: dois agendamentos conflitam quando `inicioExistente < fimNovo` **e** `fimExistente > inicioNovo`. Isso cobre o caso em que um corte de 50 minutos engole o horário seguinte.

A verificação e a criação acontecem dentro da mesma transação, com `isolationLevel: 'Serializable'`. Sem isso, dois clientes clicando ao mesmo tempo poderiam passar os dois pela checagem antes de qualquer gravação. Se o horário já estiver ocupado, a API responde `409` e o frontend recarrega a lista de horários.

### Datas em UTC, conversão só na exibição

O banco guarda `startsAt` e `endsAt` em UTC. A conversão para o fuso da barbearia (`BUSINESS_TIMEZONE`) acontece na hora de montar os horários disponíveis e de exibir na tela, usando a API `Intl` — sem depender do relógio de quem está acessando. Assim um cliente viajando não vê horários deslocados, e o horário de verão não quebra a agenda.

### Soft delete de serviços

Excluir um serviço que já tem agendamentos apagaria o histórico junto. Por isso, o `DELETE /services/:id` verifica se existe algum agendamento ligado ao serviço: se existir, ele é apenas desativado (`active: false`) e some para os clientes; se não existir, é removido de fato. O histórico continua íntegro e o admin recebe a informação do que aconteceu.

### Regras de negócio no servidor

Horário de funcionamento, dias de trabalho, duração do slot, cálculo do fim do atendimento e validação de conflito ficam no backend. O frontend nunca envia `endsAt` nem decide se um horário é válido — ele só envia o serviço e o início escolhido. Isso mantém a regra em um lugar só e impede que uma requisição feita fora da interface burle a agenda.

### Autenticação com JWT e bcrypt

As senhas são gravadas com hash bcrypt (nunca em texto puro). O login devolve um JWT assinado com `sub`, `email` e `role`, guardado no `localStorage` e enviado no header `Authorization`. No backend, o middleware `authenticate` valida o token e o `requireAdmin` protege as rotas administrativas — o papel vem do token, não do que o cliente diz ser.

### Validação com Zod

Todo corpo, query e parâmetro de rota passa por um schema Zod antes de chegar ao controller. Erros de validação voltam como `400` com a mensagem de cada campo, em português, e os tipos do TypeScript são inferidos dos próprios schemas, sem duplicar definição.

---

## Estrutura de pastas

```
.
├── backend/
│   ├── prisma/
│   │   ├── migrations/         # histórico de migrações
│   │   ├── schema.prisma       # User, Service, Appointment
│   │   └── seed.ts             # admin + serviços iniciais
│   └── src/
│       ├── config/             # env, CORS, Prisma, horário de funcionamento
│       ├── controllers/        # entrada e saída HTTP
│       ├── middlewares/        # autenticação, validação, tratamento de erros
│       ├── routes/             # definição das rotas
│       ├── schemas/            # schemas Zod
│       ├── services/           # regras de negócio
│       ├── types/              # tipagem do Express
│       ├── utils/              # datas e JWT
│       ├── app.ts
│       └── server.ts
└── frontend/
    └── src/
        ├── components/         # UI compartilhada (+ ui/ do shadcn e admin/)
        ├── contexts/           # contexto de autenticação
        ├── hooks/              # acesso a dados e estado de tela
        ├── lib/                # imagens curadas e presets de animação
        ├── pages/              # Home, Login, Register, Book, MyAppointments, admin/
        ├── services/           # cliente HTTP e chamadas à API
        ├── types/              # tipos compartilhados
        └── utils/              # formatação de datas, preços e durações
```

---

## Rodando localmente

### Pré-requisitos

- Node.js 20 ou superior
- Um banco PostgreSQL (o projeto usa o Neon, mas qualquer instância serve)

### Backend

```bash
cd backend
cp .env.example .env     # preencha DATABASE_URL e JWT_SECRET
npm install
npm run db:migrate       # cria as tabelas
npm run db:seed          # cria o admin e os serviços iniciais
npm run dev              # http://localhost:3333
```

### Frontend

Em outro terminal:

```bash
cd frontend
cp .env.example .env     # VITE_API_URL=http://localhost:3333
npm install
npm run dev              # http://localhost:5173
```

### Outros scripts

| Script | Backend | Frontend |
| --- | --- | --- |
| `npm run dev` | API com recarga automática | Vite em modo desenvolvimento |
| `npm run build` | gera o Prisma Client e compila para `dist/` | type-check e build de produção |
| `npm start` | roda o build de `dist/` | — |
| `npm run lint` | ESLint | ESLint |
| `npm run format` | Prettier | Prettier |
| `npm run typecheck` | TypeScript sem emitir arquivos | TypeScript sem emitir arquivos |
| `npm run db:migrate` | cria e aplica uma migração | — |
| `npm run db:deploy` | aplica migrações pendentes (produção) | — |
| `npm run db:seed` | popula admin e serviços | — |
| `npm run db:studio` | abre o Prisma Studio | — |

---

## Variáveis de ambiente

### Backend (`backend/.env`)

| Variável | Obrigatória | Padrão | Descrição |
| --- | --- | --- | --- |
| `DATABASE_URL` | Sim | — | String de conexão do PostgreSQL |
| `JWT_SECRET` | Recomendada | `change-me` | Chave usada para assinar os tokens |
| `JWT_EXPIRES_IN` | Não | `7d` | Validade do token |
| `PORT` | Não | `3333` | Porta da API |
| `NODE_ENV` | Não | `development` | `development`, `test` ou `production` |
| `CORS_ORIGIN` | Não | `http://localhost:5173` | Origens permitidas, separadas por vírgula |
| `SEED_ADMIN_EMAIL` | Não | `admin@barbershop.com` | E-mail do admin criado pelo seed |
| `SEED_ADMIN_PASSWORD` | Não | `admin123` | Senha do admin criado pelo seed |
| `BUSINESS_TIMEZONE` | Não | `America/Sao_Paulo` | Fuso usado nos cálculos de agenda |
| `BUSINESS_OPENING_TIME` | Não | `09:00` | Horário de abertura |
| `BUSINESS_CLOSING_TIME` | Não | `19:00` | Horário de fechamento |
| `BUSINESS_SLOT_INTERVAL` | Não | `30` | Intervalo entre horários, em minutos |
| `BUSINESS_WORKING_DAYS` | Não | `1,2,3,4,5,6` | Dias de funcionamento (0 = domingo) |

### Frontend (`frontend/.env`)

| Variável | Obrigatória | Padrão | Descrição |
| --- | --- | --- | --- |
| `VITE_API_URL` | Não | `http://localhost:3333` | URL base da API |

Os arquivos `.env` nunca vão para o repositório — só os `.env.example`.

---

## Endpoints da API

Rotas protegidas esperam o header `Authorization: Bearer <token>`.

| Método | Rota | Acesso | Descrição |
| --- | --- | --- | --- |
| `GET` | `/health` | Público | Verificação de saúde da API |
| `POST` | `/auth/register` | Público | Cria uma conta de cliente e devolve o token |
| `POST` | `/auth/login` | Público | Autentica e devolve o token |
| `GET` | `/auth/me` | Autenticado | Dados do usuário logado |
| `GET` | `/services` | Público | Lista serviços ativos (`?includeInactive=true` para admin) |
| `GET` | `/services/:id` | Público | Detalhe de um serviço |
| `POST` | `/services` | Admin | Cria um serviço |
| `PATCH` | `/services/:id` | Admin | Atualiza um serviço |
| `DELETE` | `/services/:id` | Admin | Exclui o serviço ou o desativa, se houver agendamentos |
| `GET` | `/appointments/availability` | Público | Horários livres de `?serviceId=&date=AAAA-MM-DD` |
| `POST` | `/appointments` | Autenticado | Cria um agendamento |
| `GET` | `/appointments/me` | Autenticado | Agendamentos do usuário logado |
| `PATCH` | `/appointments/:id/cancel` | Autenticado | Cancela (dono do agendamento ou admin) |
| `GET` | `/appointments/agenda` | Admin | Agenda do dia (`?date=`, padrão hoje) |
| `PATCH` | `/appointments/:id/status` | Admin | Altera o status do agendamento |

### Regras aplicadas no agendamento

- O horário precisa estar no futuro e caber inteiro dentro do expediente
- O serviço precisa estar ativo
- Sobreposição com outro agendamento ativo retorna `409`
- Agendamentos cancelados liberam o horário; concluídos não podem ser cancelados

---

## Autora

**Maria Carolina Magnani de Lyra**

- GitHub: [@carollyra](https://github.com/carollyra)
- LinkedIn: [carolina-magnani](https://www.linkedin.com/in/carolina-magnani-383141353)
