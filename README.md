# 🤖 Chatbot Flow Builder

A visual chatbot flow builder built with **React** and **React Flow** for the [BiteSpeed](https://www.bitespeed.co/) Frontend Internship Task.

🔗 **Live Demo**: _[Add Vercel deployment link here]_

---

## ✨ Features

### Core Features
- **Text Message Nodes** — Custom nodes with a chat header, message body, and source/target handles
- **Drag & Drop** — Drag nodes from the sidebar panel onto the canvas to create them
- **Extensible Nodes Panel** — Easily add new node types by adding entries to a config array
- **Settings Panel** — Click any node to edit its text in real-time; includes a back button to return
- **Edge Connections** — Connect nodes via handles; each source can only have **one outgoing edge**
- **Save & Validation** — Validates the flow on save: shows an error if more than one node has an empty target handle; shows success otherwise

### Bonus Features
- **Multi-Select & Delete** — Shift+Click to select multiple nodes; Delete/Backspace to remove them
- **Undo / Redo** — Ctrl+Z to undo, Ctrl+Y to redo (up to 50 history states)
- **Custom Styling** — Animated edges, gradient navbar, hover effects, selection glow, and a polished UI

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| [React](https://react.dev/) | UI Framework |
| [Vite](https://vitejs.dev/) | Build Tool & Dev Server |
| [React Flow](https://reactflow.dev/) | Flow/Node Graph Library |
| [React Toastify](https://fkhadra.github.io/react-toastify/) | Toast Notifications |
| [UUID](https://www.npmjs.com/package/uuid) | Unique Node IDs |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/BiteSpeed_Internship_Assignment_Jyolsna.git
cd BiteSpeed_Internship_Assignment_Jyolsna

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Production Build

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── TextNode.jsx          # Custom text message node
│   ├── TextNode.css
│   ├── NodesPanel.jsx        # Draggable node type panel (extensible)
│   ├── NodesPanel.css
│   ├── SettingsPanel.jsx     # Node text editor panel
│   ├── SettingsPanel.css
│   ├── Sidebar.jsx           # Panel container (switches Nodes/Settings)
│   ├── Sidebar.css
│   ├── FlowBuilder.jsx       # Main canvas with all logic
│   ├── FlowBuilder.css
│   ├── Navbar.jsx            # Top bar with Save button
│   └── Navbar.css
├── App.jsx                   # Root component
├── index.css                 # Global styles & design tokens
└── main.jsx                  # Entry point
```

---

## 📝 How It Works

1. **Add Nodes** — Drag a "Message" card from the sidebar onto the canvas
2. **Edit Nodes** — Click a node to open the Settings Panel and edit its text
3. **Connect Nodes** — Drag from one node's source handle to another node's target handle
4. **Save Flow** — Click "Save Changes" to validate and save
5. **Undo/Redo** — Use Ctrl+Z / Ctrl+Y to undo/redo changes
6. **Delete** — Select node(s) and press Delete/Backspace

---

## 👩‍💻 Author

**Jyolsna Maria Joemon**

Built with ❤️ for BiteSpeed
