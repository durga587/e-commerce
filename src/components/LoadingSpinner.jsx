const LoadingSpinner = ({ size = "md", text = "" }) => {
  const sizes = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
    xl: "w-16 h-16 border-4",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizes[size]} border-primary/20 border-t-primary rounded-full animate-spin`}
      />
      {text && <p className="text-text-secondary text-sm animate-pulse">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
