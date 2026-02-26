/**
 * NodesPanel — Sidebar panel listing all available node types.
 *
 * Extensibility:
 * - To add a new node type, simply add an entry to the NODE_TYPES array below.
 * - Each entry defines the type string, display icon, label, and description.
 *
 * Drag-and-drop:
 * - The onDragStart handler sets the node type in the dataTransfer object,
 *   which is read by the FlowBuilder's onDrop handler to create the node.
 */

import { BsChatLeftTextFill } from 'react-icons/bs';
import './NodesPanel.css';

// Extensible node type registry — add new node types here
const NODE_TYPES = [
    {
        type: 'textNode',
        icon: <BsChatLeftTextFill size={18} />,
        label: 'Message',
        description: 'Send a text message',
    },
    // Example: Uncomment to add more node types in the future
    // {
    //   type: 'imageNode',
    //   icon: <BsImage size={18} />,
    //   label: 'Image',
    //   description: 'Send an image',
    // },
];

const NodesPanel = () => {
    /**
     * Initiates drag with the node type payload.
     * The FlowBuilder reads this on drop to create the correct node.
     */
    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div className="nodes-panel">
            <div className="nodes-panel__title">Nodes</div>
            <div className="nodes-panel__grid">
                {NODE_TYPES.map((node) => (
                    <div
                        key={node.type}
                        className="node-card"
                        draggable
                        onDragStart={(e) => onDragStart(e, node.type)}
                    >
                        <div className="node-card__icon">{node.icon}</div>
                        <div className="node-card__info">
                            <span className="node-card__name">{node.label}</span>
                            <span className="node-card__desc">{node.description}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NodesPanel;
