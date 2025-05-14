
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { contacts } from "@/lib/mock-data";
import { Search, RefreshCw, QrCode, ArrowLeft } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useToast } from "@/hooks/use-toast";
import { whatsappAPI } from "@/integrations/whatsapp";
import { Separator } from "@/components/ui/separator";

const Chats = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [sessionKey, setSessionKey] = useState<string | null>(null);
  const { toast } = useToast();

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          contact.phone.includes(searchTerm);
    
    if (filter === "all") return matchesSearch;
    return matchesSearch && contact.category === filter;
  });

  const generateQRCode = async () => {
    setIsLoading(true);
    try {
      // Using a random key for demo purposes
      const newSessionKey = `session_${Math.random().toString(36).substring(7)}`;
      setSessionKey(newSessionKey);
      
      // Initialize session
      const initResponse = await whatsappAPI.initSession(newSessionKey);
      
      if (initResponse.error) {
        toast({
          title: "Erro",
          description: initResponse.message,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Get QR code
      const qrCodeData = await whatsappAPI.getQRCode(newSessionKey);
      setQrCode(qrCodeData);
      
      toast({
        title: "QR Code gerado",
        description: "Escaneie o QR code com seu WhatsApp para conectar.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao gerar QR code. Tente novamente.",
        variant: "destructive",
      });
      console.error("Error generating QR code:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle chat selection
  const handleChatSelect = (contactId: string) => {
    setSelectedChat(contactId);
    // Here we would normally fetch messages for this contact
    // For now, just simulate some messages
    const mockMessages = [
      { id: "1", text: "Olá, como posso ajudar?", isSent: true, timestamp: new Date().toISOString() },
      { id: "2", text: "Estou com uma dúvida sobre o produto", isSent: false, timestamp: new Date().toISOString() },
      { id: "3", text: "Claro, pode perguntar", isSent: true, timestamp: new Date().toISOString() },
    ];
    setMessages(mockMessages);
  };

  // Check connection status when component mounts
  useEffect(() => {
    // TODO: Implement real connection check with WhatsApp API
    const checkConnection = () => {
      if (sessionKey) {
        // Check connection status with the API
        console.log("Checking connection for session:", sessionKey);
      }
    };
    
    checkConnection();
    
    // Poll for status changes every 5 seconds when QR code is displayed
    const interval = qrCode ? setInterval(checkConnection, 5000) : null;
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [qrCode, sessionKey]);

  return (
    <div className="flex h-full">
      {/* Left sidebar - Contact list - Fixed width and scrollable */}
      <div className="w-80 border-r bg-background flex flex-col h-[calc(100vh-120px)]">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bricolage font-bold">Conversas</h1>
          <div className="relative mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Pesquisar contatos..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <Tabs defaultValue="all" className="px-2 pt-2" onValueChange={setFilter}>
          <TabsList className="w-full h-auto p-0 bg-transparent space-x-2">
            <TabsTrigger 
              value="all" 
              className="text-sm px-2.5 py-1.5 h-auto rounded-md data-[state=active]:bg-whatsapp/10 data-[state=active]:text-whatsapp"
            >
              Todos
            </TabsTrigger>
            <TabsTrigger 
              value="cliente" 
              className="text-sm px-2.5 py-1.5 h-auto rounded-md data-[state=active]:bg-whatsapp/10 data-[state=active]:text-whatsapp"
            >
              Clientes
            </TabsTrigger>
            <TabsTrigger 
              value="fornecedor" 
              className="text-sm px-2.5 py-1.5 h-auto rounded-md data-[state=active]:bg-whatsapp/10 data-[state=active]:text-whatsapp"
            >
              Fornecedores
            </TabsTrigger>
            <TabsTrigger 
              value="equipe" 
              className="text-sm px-2.5 py-1.5 h-auto rounded-md data-[state=active]:bg-whatsapp/10 data-[state=active]:text-whatsapp"
            >
              Equipe
            </TabsTrigger>
            <TabsTrigger 
              value="geral" 
              className="text-sm px-2.5 py-1.5 h-auto rounded-md data-[state=active]:bg-whatsapp/10 data-[state=active]:text-whatsapp"
            >
              Geral
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-2 space-y-1 overflow-y-auto h-[calc(100vh-220px)]">
            {filteredContacts.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                Nenhum contato encontrado.
              </div>
            ) : (
              filteredContacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => handleChatSelect(contact.id)}
                  className={`w-full text-left px-2 py-2.5 rounded-lg transition-colors hover:bg-muted/50 ${
                    selectedChat === contact.id ? "bg-whatsapp/10 border-l-4 border-whatsapp" : ""
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                        <span className="font-medium">{contact.name.charAt(0)}</span>
                      </div>
                      {contact.isOnline && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium truncate text-sm">{contact.name}</h3>
                        {contact.lastMessageTime && (
                          <span className="text-xs text-muted-foreground">{contact.lastMessageTime}</span>
                        )}
                      </div>
                      {contact.lastMessage && (
                        <p className="text-xs text-muted-foreground truncate">{contact.lastMessage}</p>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </Tabs>
      </div>
      
      {/* Right content - QR code or chat */}
      <div className="flex-1 flex flex-col">
        {!isConnected ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <Card className="w-full max-w-md mx-auto">
              <CardHeader className="text-center">
                <h2 className="text-2xl font-bricolage font-bold">
                  Conecte seu WhatsApp
                </h2>
                <p className="text-sm text-muted-foreground">
                  Escaneie o QR code com seu celular para iniciar
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {qrCode ? (
                  <div className="mx-auto">
                    <AspectRatio ratio={1 / 1} className="w-64 h-64 mx-auto">
                      <div 
                        className="w-full h-full bg-white p-3 rounded-lg flex items-center justify-center"
                        dangerouslySetInnerHTML={{ __html: qrCode }}
                      />
                    </AspectRatio>
                    <div className="mt-4 text-center">
                      <Button 
                        variant="outline" 
                        onClick={generateQRCode} 
                        disabled={isLoading}
                        className="w-full"
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Gerando...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Gerar novo QR code
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="mx-auto w-24 h-24 mb-4 flex items-center justify-center rounded-full bg-muted">
                      <QrCode className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <Button 
                      onClick={generateQRCode} 
                      disabled={isLoading}
                      className="w-full bg-whatsapp hover:bg-whatsapp-dark"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Gerando QR Code...
                        </>
                      ) : (
                        <>
                          <QrCode className="h-4 w-4 mr-2" />
                          Conectar WhatsApp
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : selectedChat ? (
          // Selected chat view
          <div className="flex flex-col h-full">
            {/* Chat header */}
            <div className="p-4 border-b flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="mr-2 md:hidden" 
                onClick={() => setSelectedChat(null)}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                  <span className="font-medium">
                    {filteredContacts.find(c => c.id === selectedChat)?.name.charAt(0)}
                  </span>
                </div>
                <div className="ml-3">
                  <h3 className="font-medium">
                    {filteredContacts.find(c => c.id === selectedChat)?.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">online</p>
                </div>
              </div>
            </div>
            
            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`message-bubble ${
                    message.isSent ? "message-bubble-sent" : "message-bubble-received"
                  }`}
                >
                  <p>{message.text}</p>
                  <span className="text-[10px] text-muted-foreground block text-right mt-1">
                    {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Message input */}
            <div className="border-t p-4">
              <form className="flex items-center">
                <Input
                  type="text"
                  placeholder="Digite uma mensagem..."
                  className="flex-1"
                />
                <Button type="submit" size="icon" className="ml-2 bg-whatsapp hover:bg-whatsapp-dark">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </Button>
              </form>
            </div>
          </div>
        ) : (
          // No chat selected
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center p-6">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-16 w-16 text-muted-foreground mx-auto mb-4">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <h3 className="text-xl font-bricolage font-bold mb-2">Selecione uma conversa</h3>
              <p className="text-muted-foreground">
                Escolha um contato para visualizar as mensagens.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chats;
