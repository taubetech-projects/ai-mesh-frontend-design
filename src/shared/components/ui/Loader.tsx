type LoaderProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

export default function Loader({ size = "md", className = "" }: LoaderProps) {
  const sizeMap = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  };

  return (
    <div
      className={`inline-block animate-spin rounded-full border-solid border-current border-r-transparent 
        ${sizeMap[size]} ${className}`}
      role="status"
      aria-label="loading"
    />
  );
}
