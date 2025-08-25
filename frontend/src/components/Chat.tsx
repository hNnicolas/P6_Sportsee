import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import useUserInfo from "../hooks/useUserInfo";
import useUserPrompt, { UserProfile } from "../hooks/useUserPrompt";
import { useRouter } from "next/router";

import { X } from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

interface ChatProps {
  onClose?: () => void; // prop pour fermer la modale
}

export default function Chat({ onClose }: ChatProps) {
  const { token } = useAuth();
  const { data, isLoading, error } = useUserInfo(token);
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [botTyping, setBotTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const userLevel = data?.profile?.level || "débutant";
  const userProfile: UserProfile = {
    level: userLevel,
    age: data?.profile.age,
    weightKg: data?.profile.weight,
    goal: "non renseigné",
    recentRuns: [],
  };

  const userPrompt = useUserPrompt(userProfile);

  const sendMessage = async (text?: string) => {
    const messageToSend = text || input;
    if (!messageToSend.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      text: messageToSend,
      sender: "user",
    };
    setMessages((prev) => [...prev, newMessage]);
    if (!text) setInput("");
    setBotTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageToSend, prompt: userPrompt }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Erreur serveur: ${errText}`);
      }

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: data.response || "Réponse vide",
          sender: "bot",
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: "Erreur : impossible de contacter le bot",
          sender: "bot",
        },
      ]);
    } finally {
      setBotTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  if (!isOpen) return null;
  if (isLoading) return <div className="text-center py-4">Chargement...</div>;
  if (error)
    return <div className="text-center py-4 text-red-500">{error}</div>;

  const userAvatar = data?.profile.profilePicture;

  return (
    <div className="flex flex-col min-h-[80vh] bg-white max-w-[1000px] w-full mx-auto rounded-2xl shadow-lg p-4">
      {/* Header modale */}
      <div className="ml-auto flex items-center gap-2">
        <span
          className="text-xs cursor-pointer"
          style={{ color: "#707070" }}
          onClick={() => onClose && onClose()} // ferme la modale
        >
          Fermer
        </span>
        <button
          className="p-1 bg-transparent hover:bg-gray-200 rounded-md focus:outline-none border-none"
          onClick={() => onClose && onClose()}
        >
          <img
            src="/images/icons/close-modale.png"
            alt="close-modale"
            className="w-9 h-9 mr-2 rounded-full object-cover flex-shrink-0 self-end mt-[6px]"
          />
        </button>
      </div>

      <h1 className="text-center text-[#0B23F4] font-inter text-[16px] mt-[60px]">
        Posez vos questions sur votre programme,
        <span className="block">vos performances ou vos objectifs</span>
      </h1>

      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex mb-4 ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.sender === "bot" ? (
              <div className="flex flex-col items-start mb-[50px]">
                {/* Titre du bot */}
                <div className="text-[#707070] text-sm ml-[40px] mb-[10px]">
                  Coach AI
                </div>
                <div className="flex items-end">
                  {/* Avatar du bot */}
                  <img
                    src="/images/icons/profile.png"
                    alt="Bot"
                    className="w-9 h-9 mr-[10px] rounded-full object-cover flex-shrink-0 self-end"
                  />

                  {/* Message du bot */}
                  <div
                    style={{ padding: "10px" }}
                    className="max-w-[500px] break-words text-sm text-center bg-[#E7E7E7] text-black rounded-tl-[20px] rounded-tr-[20px] rounded-br-[20px]"
                  >
                    {msg.text}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-end mb-[20px] mr-[35px]">
                {/* Message utilisateur */}
                <div
                  style={{ padding: "10px" }}
                  className="max-w-[500px] ml-[20px] break-words text-sm text-center bg-[#FFECEC] text-black rounded-br-none rounded-[20px]"
                >
                  {msg.text}
                </div>

                {/* Avatar utilisateur */}
                {userAvatar && (
                  <img
                    src={userAvatar}
                    alt="user avatar"
                    className="w-16 h-16 ml-[10px] rounded-full object-cover border border-gray-300 max-w-[36px] max-h-[36px]"
                    style={{ marginTop: "-45px", marginRight: "-30px" }}
                  />
                )}
              </div>
            )}
          </div>
        ))}

        {/* Affichage de l'animation de saisie du bot uniquement si il tape */}
        {botTyping && (
          <div className="flex items-center mb-[50px] mt-[20px]">
            <img
              src="/images/icons/profile.png"
              alt="loading"
              className="w-17 h-6 ml-4"
            />
            <img
              src="/images/icons/dots.png"
              alt="dots"
              className="w-9 h-9 rounded-full object-cover"
            />
          </div>
        )}
      </div>

      <div className="p-4 min-h-[300px]">
        <div className="flex justify-center mt-[15px]">
          <div className="relative w-full max-w-[1000px]">
            <input
              type="text"
              placeholder="Comment puis-je vous aider ?"
              className="w-full h-[140px] pl-6 pr-20 rounded-[10px] focus:outline-none bg-white text-[#707070] border border-[#E7E7E7]"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <img
              src="/images/icons/icone-AI.png"
              alt="icon-AI"
              className="absolute right-16 top-1/2 mt-[-60px] ml-[8px] w-6 h-6"
            />
            <button
              onClick={() => sendMessage()}
              className="absolute top-1/2 right-2 -translate-y-1/2 flex items-center justify-center border-0 rounded-[10px] bg-[#0A24F5] hover:bg-blue-700"
              style={{
                width: "45px",
                height: "40px",
                marginLeft: "950px",
                marginTop: "25px",
              }}
            >
              <img
                src="/images/icons/button-chat.png"
                alt="Envoyer"
                className="w-full h-full object-contain"
              />
            </button>
          </div>
        </div>

        <div className="mt-3 flex justify-between mt-[30px]">
          {[
            "Comment améliorer mon endurance ?",
            "Que signifie mon score de récupération ?",
            "Peux-tu m’expliquer mon dernier graphique ?",
          ].map((suggestion, index) => (
            <button
              key={index}
              style={{
                height: index === 0 ? "6rem" : "7rem",
                borderRadius: "10px",
              }}
              className="w-[32%] bg-[#F2F3FF] text-[#C1C2C9] px-4 py-3 rounded-[20px]text-sm flex items-center justify-center border-0"
              onClick={() => {
                setInput(suggestion);
                sendMessage();
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
