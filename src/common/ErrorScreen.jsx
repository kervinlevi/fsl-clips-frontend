import React from "react";

const DEFAULT_IMAGE = "/ic-error.svg"
const ErrorScreen = ({
  image = DEFAULT_IMAGE,
  title = "Something went wrong",
  message = "An unexpected error has occurred. Please try again later.",
  onRetry, // optional retry handler
}) => {
  return (
    <div className="absolute w-full flex flex-col items-center justify-center min-h-screen text-center px-6 py-12">
      <img
        src={image}
        alt="Error"
        className="size-25 object-contain mb-6"
      />
      <h1 className="text-2xl font-semibold text-space-cadet mb-2">{title}</h1>
      <p className="text-space-cadet mb-6 max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-indigo-dye text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorScreen;