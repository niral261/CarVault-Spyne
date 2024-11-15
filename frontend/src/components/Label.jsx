
// eslint-disable-next-line react/prop-types
const Label = ({ htmlFor, children, className }) => (
    <label htmlFor={htmlFor} className={`block font-medium text-gray ${className || ''}`}>
        {children}
    </label>
);

export default Label;
