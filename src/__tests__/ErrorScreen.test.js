import React from "react";
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from "@testing-library/react";
import ErrorScreen from "../common/ErrorScreen";

describe("ErrorScreen Component", () => {
  it("renders default error message", () => {
    render(<ErrorScreen />);
    
    // Check if the default title and message are rendered
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("An unexpected error has occurred. Please try again later.")).toBeInTheDocument();
  });

  it("renders a custom title and message", () => {
    const customTitle = "Custom Error";
    const customMessage = "Something went wrong. Please try again later.";
    render(<ErrorScreen title={customTitle} message={customMessage} />);
    
    // Check if the custom title and message are rendered
    expect(screen.getByText(customTitle)).toBeInTheDocument();
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it("renders the retry button when onRetry is passed", () => {
    const retryHandler = jest.fn();
    render(<ErrorScreen onRetry={retryHandler} />);
    
    // Check if the retry button is rendered
    const retryButton = screen.getByText("Try Again");
    expect(retryButton).toBeInTheDocument();
    
    // Simulate a click on the retry button
    fireEvent.click(retryButton);
    
    // Check if the retry handler was called
    expect(retryHandler).toHaveBeenCalledTimes(1);
  });

  it("does not render the retry button when onRetry is not passed", () => {
    render(<ErrorScreen />);
    
    // Check that the retry button is not rendered
    const retryButton = screen.queryByText("Try Again");
    expect(retryButton).not.toBeInTheDocument();
  });

  it("renders the default image when no image is provided", () => {
    render(<ErrorScreen />);
    
    // Check if the default image is rendered
    const image = screen.getByAltText("Error");
    expect(image).toHaveAttribute("src", "/ic-error.svg");
  });

  it("renders the provided image when an image prop is passed", () => {
    const customImage = "/custom-error-image.svg";
    render(<ErrorScreen image={customImage} />);
    
    // Check if the custom image is rendered
    const image = screen.getByAltText("Error");
    expect(image).toHaveAttribute("src", customImage);
  });
});
