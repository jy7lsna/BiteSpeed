/**
 * Sidebar — Conditionally renders the NodesPanel or SettingsPanel.
 *
 * When a node is selected, the SettingsPanel is shown.
 * When no node is selected, the NodesPanel is shown.
 *
 * Props:
 * - selectedNode: The currently selected node (null if none)
 * - onTextChange: Callback to update the selected node's text
 * - onDeselectNode: Callback to deselect the current node
 */

import NodesPanel from './NodesPanel';
import SettingsPanel from './SettingsPanel';
import './Sidebar.css';

const Sidebar = ({ selectedNode, onTextChange, onDeselectNode }) => {
    return (
        <div className="sidebar">
            {selectedNode ? (
                // Settings panel shown when a node is selected
                <SettingsPanel
                    selectedNode={selectedNode}
                    onTextChange={onTextChange}
                    onBack={onDeselectNode}
                />
            ) : (
                // Nodes panel shown by default for drag-and-drop
                <NodesPanel />
            )}
        </div>
    );
};

export default Sidebar;
