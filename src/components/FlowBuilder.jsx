/**
 * FlowBuilder — The main application component.
 *
 * Orchestrates the entire chatbot flow builder:
 * - Manages nodes, edges, and selection state
 * - Handles drag-and-drop from the NodesPanel to create new nodes
 * - Enforces single outgoing edge per source handle
 * - Validates the flow on save (checks for disconnected nodes)
 * - Supports undo/redo via keyboard shortcuts (Ctrl+Z / Ctrl+Y)
 * - Supports multi-select (Shift+Click) and delete (Delete/Backspace)
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
    ReactFlowProvider,
    addEdge,
    useNodesState,
    useEdgesState,
    Controls,
    Background,
    MiniMap,
    BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';

import TextNode from './TextNode';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import './FlowBuilder.css';

// Register custom node types with React Flow
const nodeTypes = { textNode: TextNode };

// Maximum number of undo/redo history states
const MAX_HISTORY = 50;

const FlowBuilder = () => {
    // ---- State ----
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [selectedNode, setSelectedNode] = useState(null);
    const reactFlowWrapper = useRef(null);
    const reactFlowInstance = useRef(null);

    // ---- Undo/Redo History ----
    const historyRef = useRef([{ nodes: [], edges: [] }]);
    const historyIndexRef = useRef(0);
    const isUndoRedoAction = useRef(false);

    /**
     * Pushes the current state onto the undo history stack.
     * Called after every user action that modifies nodes or edges.
     */
    const pushHistory = useCallback((newNodes, newEdges) => {
        if (isUndoRedoAction.current) {
            isUndoRedoAction.current = false;
            return;
        }

        const current = historyIndexRef.current;
        // Discard any future states after current index (for branching)
        const newHistory = historyRef.current.slice(0, current + 1);
        newHistory.push({
            nodes: JSON.parse(JSON.stringify(newNodes)),
            edges: JSON.parse(JSON.stringify(newEdges)),
        });

        // Cap history length
        if (newHistory.length > MAX_HISTORY) {
            newHistory.shift();
        }

        historyRef.current = newHistory;
        historyIndexRef.current = newHistory.length - 1;
    }, []);

    /**
     * Undo — revert to the previous state in history.
     */
    const undo = useCallback(() => {
        const index = historyIndexRef.current;
        if (index <= 0) return;

        isUndoRedoAction.current = true;
        const prevState = historyRef.current[index - 1];
        historyIndexRef.current = index - 1;

        setNodes(JSON.parse(JSON.stringify(prevState.nodes)));
        setEdges(JSON.parse(JSON.stringify(prevState.edges)));
        setSelectedNode(null);
    }, [setNodes, setEdges]);

    /**
     * Redo — advance to the next state in history.
     */
    const redo = useCallback(() => {
        const index = historyIndexRef.current;
        if (index >= historyRef.current.length - 1) return;

        isUndoRedoAction.current = true;
        const nextState = historyRef.current[index + 1];
        historyIndexRef.current = index + 1;

        setNodes(JSON.parse(JSON.stringify(nextState.nodes)));
        setEdges(JSON.parse(JSON.stringify(nextState.edges)));
        setSelectedNode(null);
    }, [setNodes, setEdges]);

    // ---- Keyboard Shortcuts ----
    useEffect(() => {
        const handleKeyDown = (event) => {
            // Undo: Ctrl+Z (not in textarea)
            if (event.ctrlKey && event.key === 'z' && !event.target.closest('textarea')) {
                event.preventDefault();
                undo();
            }
            // Redo: Ctrl+Y or Ctrl+Shift+Z
            if (
                (event.ctrlKey && event.key === 'y') ||
                (event.ctrlKey && event.shiftKey && event.key === 'Z')
            ) {
                if (!event.target.closest('textarea')) {
                    event.preventDefault();
                    redo();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [undo, redo]);

    // ---- Connection Handler ----
    /**
     * Called when a user connects two nodes.
     * Enforces the rule: each source handle can only have one outgoing edge.
     */
    const onConnect = useCallback(
        (params) => {
            // Check if source handle already has an outgoing edge
            const sourceHasEdge = edges.some(
                (edge) => edge.source === params.source && edge.sourceHandle === params.sourceHandle
            );

            if (sourceHasEdge) {
                toast.warn('A source handle can only have one outgoing edge.', {
                    position: 'top-center',
                    autoClose: 2500,
                });
                return;
            }

            const newEdges = addEdge(
                { ...params, animated: true, style: { strokeWidth: 2 } },
                edges
            );
            setEdges(newEdges);
            pushHistory(nodes, newEdges);
        },
        [edges, nodes, setEdges, pushHistory]
    );

    // ---- Node Selection ----
    /**
     * When a node is clicked, select it to show the SettingsPanel.
     */
    const onNodeClick = useCallback(
        (_event, node) => {
            setSelectedNode(node);
        },
        []
    );

    /**
     * When the canvas (pane) is clicked, deselect any selected node.
     */
    const onPaneClick = useCallback(() => {
        setSelectedNode(null);
    }, []);

    /**
     * Called from the SettingsPanel when the user edits the node text.
     * Updates the node data in real-time.
     */
    const onTextChange = useCallback(
        (newText) => {
            setNodes((nds) => {
                const updated = nds.map((node) => {
                    if (node.id === selectedNode?.id) {
                        return {
                            ...node,
                            data: { ...node.data, label: newText },
                        };
                    }
                    return node;
                });
                // Update selectedNode reference so the textarea stays in sync
                const updatedSelected = updated.find((n) => n.id === selectedNode?.id);
                if (updatedSelected) setSelectedNode(updatedSelected);
                return updated;
            });
        },
        [selectedNode, setNodes]
    );

    /**
     * Deselects the currently selected node (used by the back button).
     */
    const onDeselectNode = useCallback(() => {
        setSelectedNode(null);
    }, []);

    // ---- Drag & Drop ----
    /**
     * Allow the canvas to accept dragged node types.
     */
    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    /**
     * Creates a new node at the drop position when a node type
     * is dragged from the NodesPanel onto the canvas.
     */
    const onDrop = useCallback(
        (event) => {
            event.preventDefault();

            const nodeType = event.dataTransfer.getData('application/reactflow');
            if (!nodeType || !reactFlowInstance.current) return;

            // Convert screen coordinates to flow coordinates
            const position = reactFlowInstance.current.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const newNode = {
                id: uuidv4(),
                type: nodeType,
                position,
                data: { label: `test message ${nodes.length + 1}` },
            };

            const newNodes = [...nodes, newNode];
            setNodes(newNodes);
            pushHistory(newNodes, edges);
        },
        [nodes, edges, setNodes, pushHistory]
    );

    // ---- Node/Edge Deletion ----
    /**
     * Track changes to nodes/edges from React Flow's internal state
     * (including multi-select delete via keyboard).
     * Push to history on removals.
     */
    const handleNodesChange = useCallback(
        (changes) => {
            onNodesChange(changes);

            const hasRemoval = changes.some((c) => c.type === 'remove');
            if (hasRemoval) {
                // Compute the new node list after removals
                const removedIds = changes.filter((c) => c.type === 'remove').map((c) => c.id);
                const remainingNodes = nodes.filter((n) => !removedIds.includes(n.id));
                const remainingEdges = edges.filter(
                    (e) => !removedIds.includes(e.source) && !removedIds.includes(e.target)
                );
                pushHistory(remainingNodes, remainingEdges);

                // Clear selection if the selected node was deleted
                if (selectedNode && removedIds.includes(selectedNode.id)) {
                    setSelectedNode(null);
                }
            }
        },
        [onNodesChange, nodes, edges, pushHistory, selectedNode]
    );

    const handleEdgesChange = useCallback(
        (changes) => {
            onEdgesChange(changes);

            const hasRemoval = changes.some((c) => c.type === 'remove');
            if (hasRemoval) {
                const removedIds = changes.filter((c) => c.type === 'remove').map((c) => c.id);
                const remainingEdges = edges.filter((e) => !removedIds.includes(e.id));
                pushHistory(nodes, remainingEdges);
            }
        },
        [onEdgesChange, nodes, edges, pushHistory]
    );

    // ---- Save & Validation ----
    /**
     * Validates the flow:
     * - If there are no nodes, show an error
     * - If more than one node has an empty target handle (no incoming edge),
     *   it means the flow has multiple disconnected starting points → error
     * - Otherwise, the flow is valid → success toast
     */
    const onSave = useCallback(() => {
        if (nodes.length === 0) {
            toast.error('Cannot save an empty flow. Add some nodes first!', {
                position: 'top-center',
                autoClose: 3000,
            });
            return;
        }

        // Count nodes with empty target handles (no incoming edges)
        const nodesWithIncomingEdge = new Set(edges.map((edge) => edge.target));
        const nodesWithEmptyTarget = nodes.filter(
            (node) => !nodesWithIncomingEdge.has(node.id)
        );

        if (nodesWithEmptyTarget.length > 1) {
            toast.error(
                'Flow validation failed! More than one node has an empty target handle. Please connect all nodes.',
                {
                    position: 'top-center',
                    autoClose: 4000,
                }
            );
        } else {
            toast.success('Flow saved successfully!', {
                position: 'top-center',
                autoClose: 3000,
            });
        }
    }, [nodes, edges]);

    return (
        <div className="flow-builder">
            {/* Top navigation bar with save button */}
            <Navbar onSave={onSave} />

            <div className="flow-builder__main">
                {/* React Flow Canvas */}
                <div
                    className="flow-builder__canvas"
                    ref={reactFlowWrapper}
                    onDragOver={onDragOver}
                    onDrop={onDrop}
                >
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={handleNodesChange}
                        onEdgesChange={handleEdgesChange}
                        onConnect={onConnect}
                        onNodeClick={onNodeClick}
                        onPaneClick={onPaneClick}
                        onInit={(instance) => {
                            reactFlowInstance.current = instance;
                        }}
                        nodeTypes={nodeTypes}
                        fitView
                        deleteKeyCode={['Backspace', 'Delete']}
                        multiSelectionKeyCode="Shift"
                        selectionOnDrag
                    >
                        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
                        <Controls />
                        <MiniMap
                            nodeColor={() => '#6c5ce7'}
                            maskColor="rgba(0, 0, 0, 0.08)"
                            style={{ borderRadius: 10 }}
                        />
                    </ReactFlow>
                </div>

                {/* Sidebar: NodesPanel or SettingsPanel */}
                <Sidebar
                    selectedNode={selectedNode}
                    onTextChange={onTextChange}
                    onDeselectNode={onDeselectNode}
                />
            </div>

            {/* Toast notification container */}
            <ToastContainer
                limit={3}
                newestOnTop
                theme="colored"
            />
        </div>
    );
};

/**
 * Wrapped with ReactFlowProvider so that hooks like
 * useReactFlow() can be used in child components.
 */
const FlowBuilderWrapper = () => (
    <ReactFlowProvider>
        <FlowBuilder />
    </ReactFlowProvider>
);

export default FlowBuilderWrapper;
