// eslint-disable-next-line react/prop-types
const Textarea = ({ id, value, onChange, className, ...props }) => (
    <textarea
        id={id}
        value={value}
        onChange={onChange}
        className={`border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${className || ''}`}
        {...props}
    />
);

export default Textarea;
