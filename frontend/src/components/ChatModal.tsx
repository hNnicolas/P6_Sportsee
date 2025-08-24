import { useEffect } from "react";
import Chat from "./Chat";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatModal({ isOpen, onClose }: ChatModalProps) {
  // Bloquer le scroll de la page quand la modale est ouverte
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay semi-transparent */}
      <div
        className="fixed inset-0 z-40 bg-black bg-opacity-30"
        onClick={onClose}
      />

      {/* Conteneur flex pour animation depuis le bas */}
      <div className="fixed inset-0 z-50 flex justify-center items-end pointer-events-none">
        <div
          className={`bg-[#FFFFFF] shadow-xl overflow-y-auto transform transition-transform duration-300 ease-out pointer-events-auto
            ${isOpen ? "translate-y-0" : "translate-y-full"}`}
          style={{
            width: "89vw",
            height: "98vh",
            maxWidth: "1700px",
            maxHeight: "104vh",
            margin: "60px 0px 0px 20px",
            borderTopLeftRadius: "20px",
            borderTopRightRadius: "20px",
            marginLeft: "70px",
          }}
        >
          <Chat onClose={onClose} />
        </div>
      </div>
    </>
  );
}
