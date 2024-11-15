// eslint-disable-next-line react/prop-types
export function Card({ children, className, images }) {
  return (
    <div className={`border rounded-lg shadow-md p-4 ${className}`}>
      {/* Render the first image if images exist */}
      {images && (
        <img
          src={images[0]}
          alt="Car"
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
      )}
      {children}
    </div>
  );
}

// eslint-disable-next-line react/prop-types
export function CardHeader({ children }) {
  return <div className="border-b pb-2 mb-2">{children}</div>;
}

// eslint-disable-next-line react/prop-types
export function CardTitle({ children }) {
  return <h3 className="text-lg font-semibold">{children}</h3>;
}

// eslint-disable-next-line react/prop-types
export function CardContent({ children }) {
  return <div className="mt-2">{children}</div>;
}
