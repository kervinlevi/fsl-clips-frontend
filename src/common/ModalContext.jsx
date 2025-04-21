import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";

const ModalContext = createContext();

// Root ModalProvider to be used in App.jsx
export const ModalProvider = ({ children }) => {
  const [modalContent, setModalContent] = useState(null);
  const [modalOptions, setModalOptions] = useState({
    overlay: true,
    closeOnOverlayClick: true,
  });
  const beforeCloseRef = useRef(null); // store the beforeClose callback

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
    ({
      title,
      message,
      yes = "Confirm",
      no = "Cancel",
      overlay = true,
      closeOnOverlayClick = false,
      warning = false,
    }) => {
      return new Promise((resolve) => {
        setModalOptions({ overlay, closeOnOverlayClick });
        beforeCloseRef.current = null;
        const buttonBg = warning ? "bg-rose-red" : "bg-indigo-dye";
        beforeCloseRef.current = () => {
          resolve(false);
        };

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
                className={`p-2 ${buttonBg} text-white min-w-24 font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-sky-blue cursor-pointer`}
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
    ({
      title,
      message,
      ok = "Okay",
      overlay = true,
      closeOnOverlayClick = true,
    }) => {
      return new Promise((resolve) => {
        setModalOptions({ overlay, closeOnOverlayClick });
        beforeCloseRef.current = () => {
          resolve(); // call resolve on overlay click by default
        };

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

  const handleOverlayClick = () => {
    if (modalOptions.closeOnOverlayClick === true) {
      if (beforeCloseRef.current) {
        beforeCloseRef.current();
        beforeCloseRef.current = null;
      }
      closeModal();
    }
  };

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
          onClick={handleOverlayClick}
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
