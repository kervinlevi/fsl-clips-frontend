import React, { createContext, useContext, useState, useCallback } from "react";

const ModalContext = createContext();

// Root ModalProvider to be used in App.jsx
export const ModalProvider = ({ children }) => {
  const [modalContent, setModalContent] = useState(null);
  const [modalOptions, setModalOptions] = useState({ overlay: true });

  const closeModal = useCallback(() => {
    setModalContent(null);
  }, []);

  // 1. openModal: for showing any JSX content
  const openModal = useCallback((content, options = { overlay: true }) => {
    setModalOptions(options);
    setModalContent(() => content);
  }, []);

  // 2. openConfirmModal: modal with two buttons. It returns a boolean confirmed.
  const openConfirmModal = useCallback(
    ({ title, message, yes = "Confirm", no = "Cancel", overlay = true }) => {
      return new Promise((resolve) => {
        setModalOptions({ overlay });
        setModalContent(
          <div>
            {title && <h2 className="text-lg font-medium mb-2">{title}</h2>}
            <p className="mb-4 text-base text-space-cadet">{message}</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  resolve(true);
                  closeModal();
                }}
                className="p-2 bg-indigo-dye text-white min-w-24 font-semibold rounded-md hover:bg-indigo-dye focus:outline-none focus:ring-2 focus:ring-sky-blue cursor-pointer"
              >
                {yes}
              </button>
              <button
                onClick={() => {
                  resolve(false);
                  closeModal();
                }}
                className="p-2 pr-3 bg-gray-200 min-w-24 text-space-cadet font-semibold rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-blue cursor-pointer"
              >
                {no}
              </button>
            </div>
          </div>
        );
      });
    },
    [closeModal]
  );

  // 3. openInfoModal: modal with one button.
  const openInfoModal = useCallback(
    ({ title, message, ok = "Okay", overlay = true }) => {
      return new Promise((resolve) => {
        setModalOptions({ overlay });
        setModalContent(
          <div>
            {title && <h2 className="text-lg font-medium mb-2">{title}</h2>}
            {message && (
              <p className="mb-4 text-base text-space-cadet">{message}</p>
            )}
            <div className="flex justify-end">
              <button
                onClick={() => {
                  resolve();
                  closeModal();
                }}
                className="p-2 pr-3 bg-gray-200 min-w-24 text-space-cadet font-semibold rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-blue cursor-pointer"
              >
                {ok}
              </button>
            </div>
          </div>
        );
      });
    },
    [closeModal]
  );

  return (
    <ModalContext.Provider
      value={{ openModal, openInfoModal, openConfirmModal, closeModal }}
    >
      {children}

      {modalContent && (
        <div
          className={`fixed inset-0 ${
            modalOptions.overlay ? "bg-space-cadet/80" : ""
          } flex items-center justify-center z-50`}
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg w-1/2 min-w-100 shadow-lg p-8 relative"
            onClick={(e) => e.stopPropagation()} // Prevent overlay click from closing
          >
            {modalContent}
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
