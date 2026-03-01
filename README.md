# Workflow Builder (React SPA)

A single-page workflow builder where users drag nodes onto a canvas, connect them into a flow, configure node details, and preview the execution order.

## Features

- Drag and drop components (Start, Function, Condition, End) onto a central canvas
- Connect nodes with edges to define flow order
- Configure nodes in a right-hand panel (name, function body, condition expression)
- Run workflow (demo) and view animated execution order in a modal
- Delete nodes with an inline X button

## Tech Stack

- React + TypeScript (Vite)
- React Flow for graph editing
- MUI for UI components
- State managed with `useState` (no Redux)

## Setup

Install dependencies:

```bash
npm install
```

## Development

Start the dev server:

```bash
npm run dev
```

## Build

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```
