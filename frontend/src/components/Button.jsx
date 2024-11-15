// eslint-disable-next-line react/prop-types
export default function Button({ children, onClick, variant = "default", className }) {
    const baseStyles = "px-4 py-2 rounded";
    const variants = {
        default: "bg-blue-500 text-white hover:bg-blue-600",
        link: "text-blue-500 underline hover:text-blue-700",
    };
    return (
        <button onClick={onClick} className={`${baseStyles} ${variants[variant]} ${className}`}>
        {children}
        </button>
    );
}
  