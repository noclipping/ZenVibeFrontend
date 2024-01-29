import PropTypes from "prop-types"; // Import PropTypes
import "../../FeaturePage/ReminderFeature/Modal.css";

const Modal = ({ onClose, children }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h1>Enter Your Reminder For Today!</h1>
        {children}
        <button onClick={onClose} className="close-modal">
          Close
        </button>
      </div>
    </div>
  );
};

// Define prop types
Modal.propTypes = {
  onClose: PropTypes.func.isRequired, // onClose should be a function
  children: PropTypes.node.isRequired, // children can be any renderable React nodes
};

export default Modal;
