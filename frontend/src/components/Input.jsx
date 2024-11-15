// eslint-disable-next-line react/prop-types
const Input = ({ id, type = 'text', value, onChange, className, ...props }) => (
    <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className={`border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${className || ''}`}
        {...props}
    />
);

export default Input;