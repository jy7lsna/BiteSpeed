/**
 * Navbar — Top navigation bar with the "Save Changes" button.
 *
 * Props:
 * - onSave: Callback triggered when the save button is clicked.
 *           The parent (FlowBuilder) handles validation logic.
 */

import { LuSave } from 'react-icons/lu';
import './Navbar.css';

const Navbar = ({ onSave }) => {
    return (
        <nav className="navbar">
            {/* App branding */}
            <div className="navbar__brand">
                <span className="navbar__title">Chatbot Flow Builder</span>
            </div>

            {/* Action buttons */}
            <div className="navbar__actions">
                <button className="navbar__save-btn" onClick={onSave}>
                    <LuSave size={15} />
                    Save Changes
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
