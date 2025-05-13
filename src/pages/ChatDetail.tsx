
import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { contacts, messages as mockMessages } from "@/lib/mock-data";
import { ArrowLeft, Send, Bot } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const ChatDetail = () => {
  const { id } = useParams<{ id: string }>();
  const contact = contacts.find((c) => c.id === id);
  const [messages, setMessages] = useState(mockMessages[id as string] || []);
  const [newMessage, setNewMessage] = useState("");
  const [aiEnabled, setAiEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!contact) {
    return <div>Contato não encontrado</div>;
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const newMsg = {
      id: `m${Date.now()}`,
      contactId: contact.id,
      text: newMessage,
      timestamp: new Date().toISOString(),
      isFromContact: false,
      read: true,
    };

    setMessages((prev) => [...prev, newMsg]);
    setNewMessage("");

    if (aiEnabled) {
      setTimeout(() => {
        const aiResponse = {
          id: `m${Date.now() + 1}`,
          contactId: contact.id,
          text: `[IA] Olá! Recebi sua mensagem: "${newMessage}". Como posso ajudar?`,
          timestamp: new Date().toISOString(),
          isFromContact: true,
          read: true,
        };
        setMessages((prev) => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const handleAiToggle = (checked: boolean) => {
    setAiEnabled(checked);
    toast({
      title: checked ? "Agente IA ativado" : "Agente IA desativado",
      description: checked 
        ? "A IA agora responderá automaticamente às mensagens" 
        : "As respostas automáticas foram desativadas",
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/chats">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                <span className="font-medium">{contact.name.charAt(0)}</span>
              </div>
              {contact.isOnline && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
              )}
            </div>
            <div>
              <h2 className="font-medium">{contact.name}</h2>
              <p className="text-sm text-muted-foreground">{contact.phone}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Bot className="h-5 w-5 text-muted-foreground" />
          <div className="flex items-center space-x-2">
            <Switch checked={aiEnabled} onCheckedChange={handleAiToggle} />
            <Label>Agente IA</Label>
          </div>
        </div>
      </div>

      <Card className="flex-1 mb-4">
        <CardHeader className="p-4 border-b">
          <div className="flex justify-between">
            <h3 className="font-medium">Histórico de Conversas</h3>
            <span className="text-sm text-muted-foreground">{messages.length} mensagens</span>
          </div>
        </CardHeader>
        <CardContent className="p-4 overflow-y-auto h-[calc(100%-70px)] bg-whatsapp-chat/30">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message-bubble ${
                  message.isFromContact
                    ? "message-bubble-received"
                    : "message-bubble-sent"
                }`}
              >
                {message.text}
                <div className="text-xs text-right mt-1 text-gray-500">
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
      </Card>

      <div className="flex space-x-2">
        <Input
          placeholder="Digite sua mensagem..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          className="flex-1"
        />
        <Button onClick={handleSendMessage}>
          <Send className="h-4 w-4 mr-2" />
          Enviar
        </Button>
      </div>
    </div>
  );
};

export default ChatDetail;
