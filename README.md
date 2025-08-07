# ng-skein

**ng-skein** is a modular, event-driven workflow framework for Angular applications, designed for industrial and commercial process execution.  
It uses **JSON-configurable workflow definitions** as the single source of truth for business logic, UI rendering, and process documentation.

---

## ✨ Key Features
- **Event-Driven Architecture** – Components emit domain events only; side effects and logic live in reducers and effects.
- **JSON Workflow Definitions** – Drive UI, validations, and process logic from declarative configuration.
- **Local-First State** – Fully functional offline with PouchDB; syncs when connectivity is restored.
- **Pluggable UI & Backends** – Domain adapters and presentational components are modular and replaceable.
- **Self-Documenting** – Workflow definitions can be transformed into process descriptions, training guides, or compliance docs.

---

## 📂 Project Structure
- `src/app/**` – Angular modules, services, and components.
- `*.prompt.md` – Human- and AI-readable prompts describing the purpose, logic, and usage of each module or service.  
  These are the **primary source of architectural intent** — read them before editing code.
- `workflow.definition.json` – Example declarative workflows.
- `core/` – Shared services, persistence, event handling.
- `domain/` – Domain-specific workflow adapters and models.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** `20.19.x` (use `.nvmrc` to match exact version)
- **Angular CLI** 20+
- **PouchDB** installed via npm

### Setup
```bash
# Use the correct Node version
nvm use

# Install dependencies
npm install

# Run the app
ng serve

# Run tests
ng test
```

---

## 📖 Development Notes
- Always update the related `.prompt.md` when changing a module — this is how future developers (and AI tools) understand intent.
- Workflow logic should be **configuration-driven**, not hardcoded into components.
- Keep components dumb: emit events, never call services directly for business logic.

---

## 🧪 Demo & Testing
The repository includes example workflows simulating industrial/commercial processes.  
Use these for:
- Learning the framework
- Developing and testing components in isolation
- Storybook-style demonstrations

---

## 📜 License
TBD
