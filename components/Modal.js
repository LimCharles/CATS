import React from "react";

const Modal = React.forwardRef(({ children, hidden }, ref) => {
  return (
    <div
      className={`${
        hidden ? "hidden" : "block"
      } fixed inset-0 bg-gray-400 bg-opacity-50 transition-opacity flex flex-col items-center justify-center `}
      style={{ zIndex: 2000 }}
    >
      <div
        ref={ref}
        className={`flex flex-col w-3/4 sm:w-[36rem] min-h-0 max-h-[36rem] px-8 py-6 bg-white rounded-lg justify-center items-center text-center`}
      >
        {children}
      </div>
    </div>
  );
});

Modal.displayName = "Modal";

export default Modal;
