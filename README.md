# Chatbot Flow Builder

A visual chatbot flow builder built with **React** and **React Flow** for the [BiteSpeed](https://www.bitespeed.co/) Frontend Internship Task.

**Live Demo**: _[Add Vercel deployment link here]_

---

## Features

**Core**
- Text Message nodes with drag-and-drop creation from the sidebar
- Extensible Nodes Panel — add new node types via a config array
- Settings Panel — click a node to edit its text in real-time; includes a back button
- Edge connections with single outgoing edge per source handle
- Save validation — error if more than one node has an empty target handle

**Bonus**
- Multi-select (Shift+Click) and delete (Delete/Backspace)
- Undo/Redo (Ctrl+Z / Ctrl+Y, 50-state history)
- Custom node and edge styling

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React | UI Framework |
| Vite | Build Tool |
| React Flow | Flow/Node Graph Library |
| React Toastify | Toast Notifications |
| React Icons | SVG Icons |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

App runs at `http://localhost:5173`.

```bash
# Production build
npm run build
```

---

## Project Structure

```
src/
├── components/
│   ├── TextNode.jsx        # Custom text message node
│   ├── NodesPanel.jsx      # Draggable node type panel
│   ├── SettingsPanel.jsx   # Node text editor
│   ├── Sidebar.jsx         # Panel container
│   ├── FlowBuilder.jsx     # Main canvas and app logic
│   └── Navbar.jsx          # Top bar with Save button
├── App.jsx
├── index.css               # Global styles
└── main.jsx
```

---

## Author

**Jyolsna Maria Joemon**
