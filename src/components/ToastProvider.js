"use client";
import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 2500,
        style: {
          background: "#14151a",
          color: "#ffffff",
          border: "1px solid rgba(255,255,255,0.1)",
          fontSize: "14px",
        },
        iconTheme: { primary: "#ccff00", secondary: "#000000" },
      }}
    />
  );
}