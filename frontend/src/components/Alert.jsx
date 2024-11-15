import PropTypes from 'prop-types';

const Alert = ({ type = 'info', message, onClose }) => {
  const typeClasses = {
    info: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
  };

  return (
    <div className={`flex items-center p-4 rounded-lg ${typeClasses[type]} my-2`}>
      <span className="flex-grow">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 p-2 text-sm font-bold hover:text-gray-800 focus:outline-none"
          aria-label="Close Alert"
        >
          ✕
        </button>
      )}
    </div>
  );
};

Alert.propTypes = {
  type: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func,
};

export default Alert;
