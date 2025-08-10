import { useState, useRef, useEffect } from "react";

type Message = {
  id: number;
  from: "user" | "bot";
  text: string;
};

const MAX_MESSAGE_LENGTH = 500;

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messageId = useRef(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll automatique vers le bas quand messages changent
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    setError(null);

    if (!input.trim()) return;
    if (input.length > MAX_MESSAGE_LENGTH) {
      setError(`Message trop long, max ${MAX_MESSAGE_LENGTH} caractères.`);
      return;
    }
    if (loading) return;

    const userMessage: Message = {
      id: messageId.current++,
      from: "user",
      text: input.trim(),
    };
    setMessages((msgs) => [...msgs, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.text }),
      });

      if (!res.ok) {
        throw new Error("Erreur serveur, veuillez réessayer.");
      }

      const data = await res.json();
      const botMessage: Message = {
        id: messageId.current++,
        from: "bot",
        text: data.response || "Pas de réponse reçue.",
      };
      setMessages((msgs) => [...msgs, botMessage]);
    } catch (err: any) {
      setError(err.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "2rem auto",
        display: "flex",
        flexDirection: "column",
        border: "1px solid #ddd",
        borderRadius: "8px",
        height: "70vh",
        background: "#fff",
      }}
    >
      <div
        style={{
          flex: 1,
          padding: "1rem",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
        aria-live="polite"
      >
        {messages.length === 0 && (
          <p style={{ textAlign: "center", color: "#999" }}>
            Démarrez la conversation en envoyant un message.
          </p>
        )}

        {messages.map(({ id, from, text }) => (
          <div
            key={id}
            style={{
              alignSelf: from === "user" ? "flex-end" : "flex-start",
              backgroundColor: from === "user" ? "#0b23f4" : "#eee",
              color: from === "user" ? "white" : "black",
              padding: "0.75rem 1rem",
              borderRadius: "12px",
              maxWidth: "80%",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {text}
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      {error && (
        <div
          role="alert"
          style={{
            color: "red",
            padding: "0 1rem",
            fontWeight: "bold",
            fontSize: "0.9rem",
          }}
        >
          {error}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        style={{
          display: "flex",
          padding: "1rem",
          borderTop: "1px solid #ddd",
          gap: "0.5rem",
        }}
      >
        <input
          type="text"
          placeholder="Votre message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          maxLength={MAX_MESSAGE_LENGTH}
          aria-label="Message à envoyer"
          style={{
            flex: 1,
            padding: "0.75rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "1rem",
          }}
        />
        <button
          type="submit"
          disabled={loading || input.trim().length === 0}
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            border: "none",
            backgroundColor: loading ? "#999" : "#0b23f4",
            color: "white",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "bold",
          }}
          aria-busy={loading}
        >
          {loading ? "Envoi..." : "Envoyer"}
        </button>
      </form>
    </div>
  );
}
