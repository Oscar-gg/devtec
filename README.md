# DevTec

Discover, share, and collaborate on technology projects. Connect with the developer community at ITESM.

## Objective

DevTec aims to be a place where developers can:

- **Discover** projects implemented by other students, either related to Tec, coursework, or personal initiatives
- **Share** their own projects and get feedback from the community
- **Collaborate** in projects found through the platform
- **Learn** about new technologies and development practices
- **Connect** with like-minded developers

## Features

- Project showcase and discovery
- GitHub integration for repository management
- User authentication for @tec.mx email addresses
- Language-based filtering and search

## Technologies

See [architecture](./docs/devtec_architecture.drawio.xml) for component overview details. This project is built with the [T3 Stack](https://create.t3.gg/):

### Core Framework

- **[Next.js](https://nextjs.org)** - React framework for production-grade applications
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript development

### Backend & Database

- **[Prisma](https://prisma.io)** - Next-generation ORM for database management
- **[tRPC](https://trpc.io)** - End-to-end typesafe APIs

### Authentication & Security

- **[NextAuth.js](https://next-auth.js.org)** - Complete authentication solution for Next.js

### Styling & UI

- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first CSS framework for rapid UI development

### Additional Tools

- **ESLint & Prettier** - Code linting and formatting
- **GitHub API Integration** - Repository data and analytics

## 🤝 Contributing

Contributions are welcome (and appreciated)!

For more information, see [Contributing Guidelines](CONTRIBUTING.md) before investing your time.

## Running Locally

1. Clone & install dependencies:

```bash
git clone https://github.com/Oscar-gg/devtec
cd devtec
npm install
```

2. Set up environment variables:

Create a `.env` file in the root directory and add the necessary environment variables. You can use the `.env.example` file as a reference. For setting up a database, you can use the [start-database.sh](./scripts/start-database.sh) script to run a local PostgreSQL instance using Docker.

3. Run the development server:

```bash
npm run dev
```

## Useful Prisma database commands

1. Pull the latest schema changes from the Database

```bash
npx prisma db pull
```

2. Push the local schema changes to the Database

```bash
npx prisma db push
```

3. Generate Prisma Client

```bash
npx prisma generate
```

4. Inspect the database

```bash
npx prisma studio
```

## Roadmap

Deployment

- [x] Set up db for deploy
- [x] Set up env vars for github auth in deploy

Projects

- [x] Complete README and contribution guide
- [x] Improve denied auth page (non-domain users)
- [x] Show projects on homepage instead of mock data
- [x] Filter projects
- [x] Update and Delete projects
- [x] Implement tags for projects
- [x] Language distribution chart
- [x] Multiple authors per project
- [x] Select org for project

Developers

- [x] Profile config page / read and update user info
- [x] Developers page
- [x] Navigate to organizations on click
- [x] Developer Organizations
- [ ] Optional Location (ITESM campus)
- [ ] Developer Links
- [ ] Developer Work experience

Organizations

- [x] Create Organization
- [x] Organization page read
- [x] Projects of organization
- [x] Logo for organization
- [x] Back on edit organization
