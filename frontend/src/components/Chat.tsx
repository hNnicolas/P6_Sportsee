import { useState } from "react";
import useUserInfo from "../hooks/useUserInfo";
import { useAuth } from "../contexts/AuthContext";
import TypingDots from "../components/TypingDots";
import useUserPrompt from "../hooks/useUserPrompt";
import { X } from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

export default function Chat() {
  const { token } = useAuth();
  const { data, isLoading, error } = useUserInfo(token);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [botTyping, setBotTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  // On récupère le niveau de l'utilisateur
  const userLevel = data?.profile?.level || "débutant";
  const userPrompt = useUserPrompt(userLevel);

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
        body: JSON.stringify({
          message: messageToSend,
          prompt: userPrompt,
        }),
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
    <div className="flex flex-col min-h-screen bg-white max-w-[1000px] w-full mx-auto">
      <div className="ml-auto flex items-center gap-1 mb-2">
        <span className="text-xs" style={{ color: "#707070" }}>
          Fermer
        </span>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 bg-transparent hover:bg-gray-200 rounded-md focus:outline-none border-none"
        >
          <X size={14} color="#717171" />
        </button>
      </div>

      <h1 className="text-center text-[#0B23F4]">
        Posez vos questions votre programme,
        <span className="block">vos performances ou vos objectifs</span>
      </h1>

      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="flex items-center mb-4">
            <img
              src="/assets/botIcon.svg"
              alt="Bot"
              className="w-9 h-9 mr-2 rounded-full object-cover"
            />
            <TypingDots />
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex mb-4 ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.sender === "bot" && (
              <img
                src="/assets/botIcon.svg"
                alt="Bot"
                className="w-9 h-9 mr-2 rounded-full object-cover"
              />
            )}

            <div
              className={`px-4 py-2 rounded-2xl max-w-xs break-words text-sm ${
                msg.sender === "user"
                  ? "bg-[#FFECEC] text-black rounded-br-none"
                  : "bg-gray-100 text-black rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>

            {msg.sender === "user" && userAvatar && (
              <img
                src={userAvatar}
                alt="user avatar"
                className="w-9 h-9 ml-2 rounded-full object-cover border border-gray-300 max-w-[36px] max-h-[36px]"
              />
            )}
          </div>
        ))}

        {botTyping && (
          <div className="flex items-center mb-4">
            <img
              src="/assets/botIcon.svg"
              alt="Bot"
              className="w-9 h-9 mr-2 rounded-full object-cover"
            />
            <TypingDots />
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex justify-center mt-10">
          <div className="relative w-full max-w-[1000px]">
            <input
              type="text"
              placeholder="Comment puis-je vous aider ?"
              className="w-full h-[140px] pl-6 pr-16 rounded-xl focus:outline-none bg-white text-[#707070] border border-gray-300"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
            />

            <button
              onClick={() => sendMessage()}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#0A24F5] hover:bg-blue-700 p-4 rounded-r-xl flex items-center justify-center"
            >
              <img src="/sendArrow.svg" alt="Envoyer" className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="mt-3 flex justify-between">
          {[
            "Comment améliorer mon endurance ?",
            "Que signifie mon score de récupération ?",
            "Peux-tu m’expliquer mon dernier graphique ?",
          ].map((suggestion, index) => (
            <button
              key={index}
              style={{ height: "5rem" }}
              className="!flex-1 !mx-1 !bg-[#F2F3FF] !text-[#C1C2C9] !px-4 !py-3 !rounded-full !text-sm !flex !items-center !justify-center border-0"
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
