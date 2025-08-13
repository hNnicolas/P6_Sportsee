import { useState } from "react";
import useUserInfo from "../hooks/useUserInfo";
import { useAuth } from "../contexts/AuthContext";
import TypingDots from "../components/TypingDots";

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

  const sendMessage = async (text?: string) => {
    const messageToSend = text || input;
    if (!messageToSend.trim()) return;

    console.log("Message utilisateur :", messageToSend);

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
        body: JSON.stringify({ message: messageToSend }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Erreur serveur: ${errText}`);
      }

      const data = await res.json();
      console.log("Réponse bot :", data.response);

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

  if (isLoading) return <div className="text-center py-4">Chargement...</div>;
  if (error)
    return <div className="text-center py-4 text-red-500">{error}</div>;

  const userAvatar = data?.profile.profilePicture;

  return (
    <div className="flex flex-col h-full bg-white">
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
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Comment puis-je vous aider ?"
            className="flex-1 px-4 py-2 rounded-lg focus:outline-none bg-white text-[#707070] border border-gray-300"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button
            onClick={() => sendMessage()}
            className="bg-[#0A24F5] hover:bg-blue-700 p-2 rounded-lg"
          >
            <img
              src="/assets/sendArrow.svg"
              alt="Envoyer"
              className="w-5 h-5"
            />
          </button>
        </div>

        <div className="mt-3 flex justify-between">
          {[
            "Comment améliorer mon endurance ?",
            "Que signifie mon score de récupération ?",
            "Peux-tu m’expliquer mon dernier graphique ?",
          ].map((suggestion, index) => (
            <button
              key={index}
              className="flex-1 mx-1 bg-[#F2F3FF] text-[#C1C2C9] px-3 py-2 rounded-full text-xs text-center"
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
