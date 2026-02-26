/**
 * SettingsPanel — Appears when a node is selected.
 *
 * Replaces the NodesPanel to let users edit the selected node's text.
 * Changes are reflected in real-time on the canvas.
 *
 * Props:
 * - selectedNode: The currently selected React Flow node object
 * - onTextChange: Callback to update the node's label text
 * - onBack: Callback to deselect the node and return to the NodesPanel
 */

import { LuArrowLeft } from 'react-icons/lu';
import './SettingsPanel.css';

const SettingsPanel = ({ selectedNode, onTextChange, onBack }) => {
    return (
        <div className="settings-panel">
            {/* Header with back navigation */}
            <div className="settings-panel__header">
                <button
                    className="settings-panel__back"
                    onClick={onBack}
                    aria-label="Back to nodes panel"
                >
                    <LuArrowLeft size={18} />
                </button>
                <span className="settings-panel__title">Message Settings</span>
            </div>

            {/* Text editing area */}
            <div className="settings-panel__body">
                <label className="settings-panel__label" htmlFor="node-text">
                    Text
                </label>
                <textarea
                    id="node-text"
                    className="settings-panel__textarea"
                    value={selectedNode?.data?.label || ''}
                    onChange={(e) => onTextChange(e.target.value)}
                    placeholder="Enter your message here..."
                />
            </div>
        </div>
    );
};

export default SettingsPanel;
