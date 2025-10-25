import React from "react";

export default function SlideOver({ open, onClose, children }) {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/30 transition-opacity duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />
      <div className={`slide-over ${open ? "open" : "closed"}`}>
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Create Account</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">✕</button>
        </div>
        <div className="p-4 overflow-y-auto h-[calc(100%-60px)]">{children}</div>
      </div>
    </>
  );
}
