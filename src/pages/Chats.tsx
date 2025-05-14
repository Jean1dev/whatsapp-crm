
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  RefreshCw, 
  QrCode, 
  ArrowLeft, 
  MoreVertical, 
  Send,
  User,
  Users,
  UserPlus,
  Clock,
  CheckCheck,
  ChevronRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { whatsappAPI } from "@/integrations/whatsapp";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const Chats = () => {
  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [sessionKey, setSessionKey] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState("");
  const [contacts, setContacts] = useState<any[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Categories for contacts
  const categories = [
    { id: "all", name: "Todos" },
    { id: "cliente", name: "Clientes" },
    { id: "fornecedor", name: "Fornecedores" },
    { id: "equipe", name: "Equipe" },
    { id: "geral", name: "Geral" }
  ];

  // Generate QR code to connect WhatsApp
  const generateQRCode = async () => {
    setIsLoading(true);
    setQrCode(null);
    
    try {
      // Using a random key for session
      const newSessionKey = `session_${Math.random().toString(36).substring(7)}`;
      setSessionKey(newSessionKey);
      
      console.log("Initializing session with key:", newSessionKey);
      
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

      console.log("Session initialized, getting QR code");
      
      // Get QR code
      const qrCodeData = await whatsappAPI.getQRCode(newSessionKey);
      setQrCode(qrCodeData);
      
      toast({
        title: "QR Code gerado",
        description: "Escaneie o QR code com seu WhatsApp para conectar.",
      });
    } catch (error) {
      console.error("Error generating QR code:", error);
      toast({
        title: "Erro",
        description: "Falha ao gerar QR code. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate fetching contacts after QR scan
  const fetchContacts = () => {
    setLoadingContacts(true);
    
    // In a real app, this would fetch from WhatsApp API
    // For now, simulate loading then connection
    setTimeout(() => {
      const demoContacts = [
        {
          id: "1",
          name: "João Silva",
          phone: "+5511999999999",
          category: "cliente",
          lastMessage: "Quando podemos agendar uma reunião?",
          lastMessageTime: "09:45",
          isOnline: true,
          unread: 2,
        },
        {
          id: "2",
          name: "Maria Oliveira",
          phone: "+5511988888888",
          category: "cliente",
          lastMessage: "Obrigado pelo atendimento!",
          lastMessageTime: "Ontem",
          unread: 0,
        },
        {
          id: "3",
          name: "Carlos Ferreira",
          phone: "+5511977777777",
          category: "fornecedor",
          lastMessage: "Os produtos chegam amanhã",
          lastMessageTime: "10:23",
          unread: 0,
        },
        {
          id: "4",
          name: "Ana Souza",
          phone: "+5511966666666",
          category: "equipe",
          lastMessage: "Reunião às 15h",
          lastMessageTime: "Ontem",
          isOnline: true,
          unread: 0,
        },
        {
          id: "5",
          name: "Pedro Santos",
          phone: "+5511955555555",
          category: "geral",
          lastMessage: "Podemos conversar depois?",
          lastMessageTime: "Seg",
          unread: 1,
        },
      ];
      
      setContacts(demoContacts);
      setLoadingContacts(false);
      setIsConnected(true);
      
      toast({
        title: "WhatsApp conectado",
        description: "Seus contatos foram carregados com sucesso",
      });
    }, 2000);
  };

  // Handle chat selection
  const handleChatSelect = (contactId: string) => {
    setSelectedChat(contactId);
    
    // Fetch messages for this contact (simulated)
    const demoMessages = [
      { id: "1", text: "Olá, tudo bem?", isSent: false, timestamp: "09:30" },
      { id: "2", text: "Tudo ótimo, como posso ajudar?", isSent: true, timestamp: "09:32" },
      { id: "3", text: "Estou interessado no seu produto", isSent: false, timestamp: "09:35" },
      { id: "4", text: "Qual produto específico você tem interesse?", isSent: true, timestamp: "09:37" },
      { id: "5", text: "O novo modelo X-2000", isSent: false, timestamp: "09:40" },
      { id: "6", text: "Excelente escolha! Posso te passar mais informações", isSent: true, timestamp: "09:42" },
      { id: "7", text: "Quando podemos agendar uma reunião?", isSent: false, timestamp: "09:45" },
    ];
    
    setMessages(demoMessages);
    
    // Mark as read (would be implemented with real API)
    setContacts(prevContacts => 
      prevContacts.map(contact => 
        contact.id === contactId 
          ? { ...contact, unread: 0 } 
          : contact
      )
    );
    
    // Scroll to bottom of messages
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Send message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || !selectedChat) return;
    
    // Add message to chat (would send via API in real app)
    const newMessage = {
      id: `msg_${Date.now()}`,
      text: inputMessage,
      isSent: true,
      timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputMessage("");
    
    // Scroll to bottom
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Filter contacts based on search and category
  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch = (
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.includes(searchTerm)
    );
    
    if (filter === "all") return matchesSearch;
    return matchesSearch && contact.category === filter;
  });

  // On first render, try to generate QR code
  useEffect(() => {
    if (qrCode === null && !isConnected) {
      generateQRCode();
    }
  }, []);

  // Check connection status when component mounts
  useEffect(() => {
    // Simulate checking connection status
    const checkConnection = () => {
      if (sessionKey) {
        console.log("Checking connection for session:", sessionKey);
        // Here we would check actual connection status with the API
      }
    };
    
    checkConnection();
    
    // Poll for status changes when QR code is displayed
    const interval = qrCode && !isConnected ? setInterval(checkConnection, 5000) : null;
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [qrCode, sessionKey, isConnected]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex h-full">
      {/* Left sidebar - Contact list - Fixed width and scrollable */}
      <div className="w-80 bg-white rounded-lg shadow-sm mr-4 flex flex-col h-[calc(100vh-130px)]">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bricolage">Conversas</h1>
            <Button 
              size="icon" 
              variant="outline" 
              className="rounded-full h-8 w-8"
              onClick={() => {
                if (isConnected) {
                  toast({
                    title: "Nova Conversa",
                    description: "Funcionalidade em desenvolvimento"
                  });
                } else {
                  generateQRCode();
                }
              }}
            >
              <UserPlus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="relative">
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
        
        {/* Categories */}
        <div className="categories-scroll border-b">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setFilter(category.id)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium ${
                filter === category.id 
                  ? "bg-whatsapp text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        {!isConnected ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-center space-y-3">
              <QrCode className="h-12 w-12 text-whatsapp mx-auto" />
              <h2 className="font-bricolage font-bold">Conecte seu WhatsApp</h2>
              <p className="text-sm text-muted-foreground">
                Escaneie o QR code para ver seus contatos
              </p>
              <Button 
                onClick={fetchContacts} // For demo, just connect on click
                className="w-full bg-whatsapp hover:bg-whatsapp-dark"
              >
                {loadingContacts ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Conectando...
                  </>
                ) : (
                  "Conectar WhatsApp"
                )}
              </Button>
            </div>
          </div>
        ) : loadingContacts ? (
          <div className="flex-1 p-2 space-y-3">
            {Array.from({length: 5}).map((_, i) => (
              <div key={i} className="flex items-center space-x-3 p-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="contact-list p-2 overflow-y-auto">
            {filteredContacts.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                Nenhum contato encontrado.
              </div>
            ) : (
              filteredContacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => handleChatSelect(contact.id)}
                  className={`w-full text-left p-2.5 rounded-lg transition-colors hover:bg-gray-50 ${
                    selectedChat === contact.id ? "bg-gray-50" : ""
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10 bg-gradient-to-br from-whatsapp to-whatsapp-dark">
                        <AvatarFallback className="bg-gradient-to-br from-whatsapp to-whatsapp-dark text-white">
                          {contact.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {contact.isOnline && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium truncate">{contact.name}</h3>
                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-1">
                          {contact.lastMessageTime}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground truncate">
                          {contact.lastMessage}
                        </p>
                        {contact.unread > 0 && (
                          <Badge 
                            variant="default"
                            className="ml-1 bg-whatsapp min-w-5 h-5 rounded-full px-1.5"
                          >
                            {contact.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>
      
      {/* Right content - QR code or chat */}
      <div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm h-[calc(100vh-130px)]">
        {!isConnected ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <Card className="w-full max-w-md mx-auto">
              <CardContent className="pt-6 pb-4 space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bricolage font-bold mb-2">
                    Conecte seu WhatsApp
                  </h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Escaneie o QR code com seu celular para iniciar
                  </p>
                </div>
                
                {qrCode ? (
                  <div className="mx-auto">
                    <div 
                      className="w-72 h-72 mx-auto bg-white p-3 rounded-lg flex items-center justify-center"
                      dangerouslySetInnerHTML={{ __html: qrCode }}
                    />
                    <div className="mt-6">
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
                    <div className="mx-auto w-24 h-24 mb-4 flex items-center justify-center rounded-full bg-whatsapp/10">
                      <QrCode className="h-12 w-12 text-whatsapp" />
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
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="mr-2 md:hidden" 
                  onClick={() => setSelectedChat(null)}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                
                <Avatar className="h-10 w-10 bg-gradient-to-br from-whatsapp to-whatsapp-dark">
                  <AvatarFallback className="bg-gradient-to-br from-whatsapp to-whatsapp-dark text-white">
                    {contacts.find(c => c.id === selectedChat)?.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="ml-3">
                  <h3 className="font-medium">
                    {contacts.find(c => c.id === selectedChat)?.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {contacts.find(c => c.id === selectedChat)?.isOnline 
                      ? "online" 
                      : "visto por último hoje"}
                  </p>
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Ver contato</DropdownMenuItem>
                  <DropdownMenuItem>Arquivar conversa</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-500">
                    Apagar conversa
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-[#f5f6f7]">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex mb-3 ${message.isSent ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[75%] rounded-lg p-3 px-4 shadow-sm ${
                      message.isSent 
                        ? 'bg-whatsapp-light text-gray-800 rounded-tr-none' 
                        : 'bg-white text-gray-800 rounded-tl-none'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <div className="flex items-center justify-end mt-1 space-x-1">
                      <span className="text-[10px] text-gray-500">
                        {message.timestamp}
                      </span>
                      {message.isSent && (
                        <CheckCheck className="h-3 w-3 text-whatsapp" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Message input */}
            <div className="border-t p-3">
              <form className="flex items-center" onSubmit={handleSendMessage}>
                <Input
                  type="text"
                  placeholder="Digite uma mensagem..."
                  className="flex-1"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  className="ml-2 bg-whatsapp hover:bg-whatsapp-dark"
                  disabled={!inputMessage.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        ) : (
          // No chat selected
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center p-6">
              <div className="mx-auto w-20 h-20 mb-4 flex items-center justify-center rounded-full bg-whatsapp/10">
                <Users className="h-10 w-10 text-whatsapp" />
              </div>
              <h3 className="text-xl font-bricolage font-bold mb-2">Selecione uma conversa</h3>
              <p className="text-muted-foreground max-w-md">
                Escolha um contato na lista à esquerda para visualizar as mensagens ou iniciar uma nova conversa.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chats;
