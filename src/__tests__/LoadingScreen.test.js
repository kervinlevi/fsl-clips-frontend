import React from "react";
import "@testing-library/jest-dom";
import { render, screen, act, waitFor } from "@testing-library/react";
import LoadingScreen from "../common/LoadingScreen";

jest.useFakeTimers();

describe("LoadingScreen", () => {
  it("renders spinner when isVisible is true", async () => {
    render(<LoadingScreen isVisible={true} />);

    const spinner = screen.getByTestId("spinner-img");
    expect(spinner).toBeInTheDocument();
  });

  it("does not render anything when isVisible is false initially", () => {
    render(<LoadingScreen isVisible={false} />);
    expect(screen.queryByTestId("spinner-img")).not.toBeInTheDocument();
  });
});
