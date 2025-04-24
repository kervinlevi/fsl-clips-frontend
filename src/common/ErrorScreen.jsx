import React from "react";

const DEFAULT_IMAGE = "/ic-error.svg"
const ErrorScreen = ({
  image = DEFAULT_IMAGE,
  title = "Something went wrong",
  message = "An unexpected error has occurred. Please try again later.",
  textColor = "text-space-cadet",
  buttonColor = "bg-indigo-dye text-white",
  onRetry, // optional retry handler
}) => {
  return (
    <div className="absolute w-full flex flex-col items-center justify-center min-h-screen text-center px-6 py-12">
      <img
        src={image}
        alt="Error"
        className="size-25 object-contain mb-6"
      />
      <h1 className={`text-2xl font-semibold mb-2 ${textColor}`}>{title}</h1>
      <p className={`mb-6 max-w-md ${textColor}`}>{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className={`px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer ${buttonColor}`}
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorScreen;