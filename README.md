# Deigma

A cloud-agnostic, technology exploration playground. Built as a monorepo for experimenting with modern architectures and deploying to Kubernetes.

## Quick Start

### Prerequisites

- Node.js (v24+)
- pnpm (v10+)

### Installation

```bash
git clone <repository-url>
cd deigma
pnpm install
```

### Running Commands

```bash
# View monorepo structure
npx nx graph

# Build a project
npx nx build <project-name>

# Run tests
npx nx test <project-name>

# Serve a project
npx nx serve <project-name>
```

## Project Structure

- `apps/` - Applications and microservices
- `packages/` - Shared libraries and utilities
- `tools/` - Workspace tools

## Getting Started

### Build a project

```bash
npx nx build identity-service
```

### Run the user service locally

```bash
npx nx serve identity-service
```

The service will be available at `http://localhost:3000`

### Run tests

```bash
# Run all tests
npx nx test

# Run tests for a specific project
npx nx test identity-service
```

### View dependency graph

```bash
npx nx graph
```

---

## Project Structure

```
deigma/
├── apps/
│   └── identity-service/              # User management microservice
│       ├── src/
│       │   ├── main.ts            # Entry point
│       │   ├── app/               # Application module
│       │   ├── configuration/     # Config service
│       │   └── health/            # Health check endpoints
│       ├── Dockerfile             # Docker image definition
│       └── webpack.config.js       # Build configuration
├── packages/
│   ├── infrastructure/            # Infrastructure utilities & services
│   │   └── configuration/         # Configuration management
│   └── shared/
│       ├── dtos/                  # Shared data transfer objects
│       │   └── user/              # User-related DTOs
│       └── utils/                 # Utility functions
├── tools/                         # Nx workspace tools
├── nx.json                        # Nx configuration
├── tsconfig.base.json             # TypeScript base configuration
├── pnpm-workspace.yaml            # pnpm monorepo configuration
└── README.md                      # This file
```

---

## Technologies

**Core Framework**
- [NestJS](https://nestjs.com) - Progressive Node.js framework
- [TypeScript](https://www.typescriptlang.org) - Language

**Build & Tooling**
- [Nx](https://nx.dev) - Monorepo management
- [pnpm](https://pnpm.io) - Fast, disk space efficient package manager
- [Jest](https://jestjs.io) - Testing framework

**DevOps & Deployment**
- [Docker](https://www.docker.com) - Containerization
- [Kubernetes](https://kubernetes.io) - Orchestration

**Development Practices**
- TypeScript strict mode
- ESLint & code quality
- Comprehensive testing (unit & e2e)
- Docker containerization support

---

## Development

### Useful Nx commands

```bash
# Generate a new library in packages/
npx nx g @nx/js:lib packages/my-lib --publishable

# Run linting
npx nx lint <project-name>

# Format code
npx nx format:write

# Run all tests
npx nx run-many --target=test

# Build all affected projects
npx nx run-many --target=build --all
```

### Creating a new microservice

```bash
npx nx g @nx/node:app apps/my-service --framework=nest
```

---

## Deployment

### Docker Build

Build a Docker image for the user service:

```bash
docker build -f apps/identity-service/Dockerfile -t deigma-identity-service:latest .
```

### Kubernetes Deployment

Deploy to Kubernetes using standard manifests:

```bash
kubectl apply -f k8s/
```

**Cloud-Agnostic Deployment:**
Deigma is designed to run on any Kubernetes-compatible platform:
- **AWS EKS** (Elastic Kubernetes Service)
- **Google GKE** (Google Kubernetes Engine)
- **Azure AKS** (Azure Kubernetes Service)
- **DigitalOcean Kubernetes**
- **Self-hosted Kubernetes clusters**
- **Local Kubernetes** (Docker Desktop, Minikube, Kind)

### Health Checks

All services include health check endpoints for Kubernetes probes:

```bash
curl http://localhost:3000/health
```

---

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

### Code Standards

- Use TypeScript with strict type checking
- Follow the existing code style
- Write tests for new features
- Ensure all tests pass: `pnpm test`
- Run linting: `pnpm lint`

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Resources

- [Nx Documentation](https://nx.dev)
- [NestJS Documentation](https://docs.nestjs.com)
- [Kubernetes Documentation](https://kubernetes.io/docs)
- [Docker Documentation](https://docs.docker.com)

---

**Happy experimenting! 🚀**

Nx automatically updates TypeScript [project references](https://www.typescriptlang.org/docs/handbook/project-references.html) in `tsconfig.json` files to ensure they remain accurate based on your project dependencies (`import` or `require` statements). This sync is automatically done when running tasks such as `build` or `typecheck`, which require updated references to function correctly.

To manually trigger the process to sync the project graph dependencies information to the TypeScript project references, run the following command:

```sh
npx nx sync
```

You can enforce that the TypeScript project references are always in the correct state when running in CI by adding a step to your CI job configuration that runs the following command:

```sh
npx nx sync:check
```

[Learn more about nx sync](https://nx.dev/reference/nx-commands#sync)


[Learn more about Nx on CI](https://nx.dev/ci/intro/ci-with-nx#ready-get-started-with-your-provider?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Useful links

Learn more:

- [Learn more about this workspace setup](https://nx.dev/nx-api/js?utm_source=nx_project&amp;utm_medium=readme&amp;utm_campaign=nx_projects)
- [Learn about Nx on CI](https://nx.dev/ci/intro/ci-with-nx?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Releasing Packages with Nx release](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [What are Nx plugins?](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

And join the Nx community:
- [Discord](https://go.nx.dev/community)
- [Follow us on X](https://twitter.com/nxdevtools) or [LinkedIn](https://www.linkedin.com/company/nrwl)
- [Our Youtube channel](https://www.youtube.com/@nxdevtools)
- [Our blog](https://nx.dev/blog?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
