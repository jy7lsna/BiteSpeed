/**
 * TextNode — Custom React Flow node representing a "Send Message" action.
 *
 * Features:
 * - Green header bar with a chat icon and "Send Message" label
 * - Body area displaying the user's message text
 * - Target handle (top) for incoming edges
 * - Source handle (bottom) for outgoing edges
 * - Visual selection indicator via border glow
 */

import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { BsChatLeftTextFill } from 'react-icons/bs';
import './TextNode.css';

const TextNode = ({ data, selected }) => {
  return (
    <div className={`text-node ${selected ? 'selected' : ''}`}>
      {/* Target handle — receives incoming connections */}
      <Handle
        type="target"
        position={Position.Top}
        id="target"
      />

      {/* Header bar */}
      <div className="text-node__header">
        <span className="text-node__header-icon">
          <BsChatLeftTextFill size={12} />
        </span>
        <span>Send Message</span>
      </div>

      {/* Message body */}
      <div className="text-node__body">
        {data.label || 'Type your message...'}
      </div>

      {/* Source handle — creates outgoing connections */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="source"
      />
    </div>
  );
};

export default memo(TextNode);
