import React from "react";
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ModalProvider, useModal } from "../common/ModalContext";

// Helper hook to use the modal context inside tests
const TestComponent = () => {
  const { openModal, openConfirmModal, openInfoModal, closeModal } = useModal();

  return (
    <div>
      <button onClick={() => openModal(<div>Modal Content</div>)}>Open Modal</button>
      <button
        onClick={() =>
          openConfirmModal({ title: "Confirm", message: "Are you sure?", yes: "Yes", no: "No" })
        }
      >
        Open Confirm Modal
      </button>
      <button onClick={() => openInfoModal({ message: "Info Message" })}>
        Open Info Modal
      </button>
      <button onClick={closeModal}>Close Modal</button>
    </div>
  );
};

describe("ModalProvider", () => {
  it("renders modal content when openModal is called", async () => {
    render(
      <ModalProvider>
        <TestComponent />
      </ModalProvider>
    );

    const openModalButton = screen.getByText("Open Modal");
    fireEvent.click(openModalButton);

    await waitFor(() => screen.getByText("Modal Content"));
    expect(screen.getByText("Modal Content")).toBeInTheDocument();
  });

  it("renders confirm modal and resolves the correct value", async () => {
    render(
      <ModalProvider>
        <TestComponent />
      </ModalProvider>
    );

    const openConfirmButton = screen.getByText("Open Confirm Modal");
    fireEvent.click(openConfirmButton);

    await waitFor(() => screen.getByText("Are you sure?"));

    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
    expect(screen.getByText("Yes")).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();

    const yesButton = screen.getByText("Yes");
    fireEvent.click(yesButton);
  });

  it("renders info modal and resolves the correct value", async () => {
    render(
      <ModalProvider>
        <TestComponent />
      </ModalProvider>
    );

    const openInfoButton = screen.getByText("Open Info Modal");
    fireEvent.click(openInfoButton);

    await waitFor(() => screen.getByText("Info Message"));
    expect(screen.getByText("Info Message")).toBeInTheDocument();
    expect(screen.getByText("Okay")).toBeInTheDocument();

    const okButton = screen.getByText("Okay");
    fireEvent.click(okButton);
  });

  it("closes the modal when closeModal is called", async () => {
    render(
      <ModalProvider>
        <TestComponent />
      </ModalProvider>
    );

    const openModalButton = screen.getByText("Open Modal");
    fireEvent.click(openModalButton);

    await waitFor(() => screen.getByText("Modal Content"));
    expect(screen.getByText("Modal Content")).toBeInTheDocument();

    const closeModalButton = screen.getByText("Close Modal");
    fireEvent.click(closeModalButton);

    await waitFor(() => expect(screen.queryByText("Modal Content")).toBeNull());
  });

  it("closes the modal when the overlay is clicked", async () => {
    render(
      <ModalProvider>
        <TestComponent />
      </ModalProvider>
    );
    const openInfoButton = screen.getByText("Open Info Modal");
    fireEvent.click(openInfoButton);

    await waitFor(() => screen.getByText("Info Message"));
    expect(screen.getByText("Info Message")).toBeInTheDocument();
    expect(screen.getByText("Okay")).toBeInTheDocument();

    const overlay = screen.getByTestId('modal-overlay');
    expect(overlay).toBeInTheDocument();
    fireEvent.click(overlay);

    await waitFor(() => expect(screen.queryByText("Info Message")).toBeNull());
  });
});
