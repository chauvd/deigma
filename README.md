# Deigma

A cloud‑agnostic, technology exploration playground built as a monorepo for experimenting with modern architectures and deploying to Kubernetes.

Badges: (add your CI / registry badges here)

## Quick Start

### Prerequisites

- Node.js v24+
- pnpm v10+
- Docker (for container builds)
- kubectl (for Kubernetes deployments, optional)

### Install

```bash
git clone <repository-url>
cd deigma
pnpm install
```

### Useful commands

```bash
# View monorepo graph
npx nx graph

# Build a project
npx nx build <project-name>

# Run tests
npx nx test <project-name>

# Serve a project locally
npx nx serve <project-name>
```

By convention the example identity service runs on http://localhost:3000 when served locally.

## Project layout

- apps/ - Applications and microservices
- packages/ - Shared libraries and utilities
- tools/ - Workspace tooling and custom generators

Example tree:

```
deigma/
├── apps/
│   └── identity-service/
│       ├── src/
│       ├── Dockerfile
│       └── webpack.config.js
├── packages/
│   ├── infrastructure/
│   └── shared/
├── tools/
├── nx.json
├── tsconfig.base.json
├── pnpm-workspace.yaml
└── README.md
```

## Technologies

Core: NestJS, TypeScript  
Tooling: Nx, pnpm, Jest, ESLint  
Deployment: Docker, Kubernetes (EKS/GKE/AKS/Kind/Minikube)

## Development

### Run a service locally

```bash
npx nx serve identity-service
# open http://localhost:3000
```

### Build & Test

```bash
npx nx build identity-service
npx nx test identity-service
npx nx lint identity-service
```

### Running in Docker

```bash
docker build -f apps/identity-service/Dockerfile -t deigma-identity-service:latest .
docker run -p 3000:3000 deigma-identity-service:latest
```

### Kubernetes

Apply manifests from k8s/ (or add your own Helm charts):

```bash
kubectl apply -f k8s/
```

Health checks are exposed at /health for Kubernetes probes:

```bash
curl http://localhost:3000/health
```

## Nx tips

- Generate a library: npx nx g @nx/js:lib packages/my-lib --publishable
- Run all tests: npx nx run-many --target=test --all
- Sync TypeScript project references (useful on CI): npx nx sync
- Check sync in CI: npx nx sync:check

## CI / Release

Add CI steps to run: pnpm install, npx nx lint, npx nx test, npx nx build, and npx nx sync:check. Use workspace-aware caching provided by your CI provider where possible.

## Contributing

1. Fork
2. git checkout -b feature/your-feature
3. Commit changes and push
4. Open a PR

Standards: TypeScript strict mode, tests for new features, follow linting and formatting rules.

## License

MIT — see LICENSE

## Resources

- Nx: https://nx.dev
- NestJS: https://docs.nestjs.com
- Kubernetes: https://kubernetes.io
- Docker: https://docs.docker.com

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
