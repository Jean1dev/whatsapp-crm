
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  ChevronRight,
  Phone,
  Video,
  Smile,
  Paperclip,
  Mic,
  MessageSquare
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
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";

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
  const [isNewContactOpen, setIsNewContactOpen] = useState(false);
  const [newContact, setNewContact] = useState({ name: "", phone: "" });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Categories for contacts
  const categories = [
    { id: "all", name: "Todos", emoji: "🌐", icon: <Users className="h-5 w-5" /> },
    { id: "cliente", name: "Clientes", emoji: "👥", icon: <User className="h-5 w-5" /> },
    { id: "fornecedor", name: "Fornecedores", emoji: "🏭", icon: <Briefcase className="h-5 w-5" /> },
    { id: "equipe", name: "Equipe", emoji: "👨‍💼", icon: <Users className="h-5 w-5" /> },
    { id: "geral", name: "Geral", emoji: "📋", icon: <MessageSquare className="h-5 w-5" /> }
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
      
      // For demo purposes
      setTimeout(() => {
        // Mock QR code HTML
        const mockQrCode = `
          <svg viewBox="0 0 200 200" style="width:100%; height:100%;">
            <rect x="0" y="0" width="200" height="200" fill="#ffffff" />
            <g transform="scale(4)">
              <rect x="0" y="0" width="5" height="5" fill="#000000" />
              <rect x="5" y="0" width="5" height="5" fill="#000000" />
              <rect x="10" y="0" width="5" height="5" fill="#000000" />
              <rect x="20" y="0" width="5" height="5" fill="#000000" />
              <rect x="30" y="0" width="5" height="5" fill="#000000" />
              <rect x="35" y="0" width="5" height="5" fill="#000000" />
              <rect x="40" y="0" width="5" height="5" fill="#000000" />
              <rect x="0" y="5" width="5" height="5" fill="#000000" />
              <rect x="15" y="5" width="5" height="5" fill="#000000" />
              <rect x="20" y="5" width="5" height="5" fill="#000000" />
              <rect x="25" y="5" width="5" height="5" fill="#000000" />
              <rect x="40" y="5" width="5" height="5" fill="#000000" />
              <rect x="0" y="10" width="5" height="5" fill="#000000" />
              <rect x="10" y="10" width="5" height="5" fill="#000000" />
              <rect x="15" y="10" width="5" height="5" fill="#000000" />
              <rect x="25" y="10" width="5" height="5" fill="#000000" />
              <rect x="35" y="10" width="5" height="5" fill="#000000" />
              <rect x="40" y="10" width="5" height="5" fill="#000000" />
              <rect x="0" y="15" width="5" height="5" fill="#000000" />
              <rect x="10" y="15" width="5" height="5" fill="#000000" />
              <rect x="15" y="15" width="5" height="5" fill="#000000" />
              <rect x="20" y="15" width="5" height="5" fill="#000000" />
              <rect x="30" y="15" width="5" height="5" fill="#000000" />
              <rect x="40" y="15" width="5" height="5" fill="#000000" />
              <rect x="0" y="20" width="5" height="5" fill="#000000" />
              <rect x="5" y="20" width="5" height="5" fill="#000000" />
              <rect x="10" y="20" width="5" height="5" fill="#000000" />
              <rect x="25" y="20" width="5" height="5" fill="#000000" />
              <rect x="30" y="20" width="5" height="5" fill="#000000" />
              <rect x="35" y="20" width="5" height="5" fill="#000000" />
              <rect x="10" y="25" width="5" height="5" fill="#000000" />
              <rect x="15" y="25" width="5" height="5" fill="#000000" />
              <rect x="20" y="25" width="5" height="5" fill="#000000" />
              <rect x="30" y="25" width="5" height="5" fill="#000000" />
              <rect x="40" y="25" width="5" height="5" fill="#000000" />
              <rect x="0" y="30" width="5" height="5" fill="#000000" />
              <rect x="5" y="30" width="5" height="5" fill="#000000" />
              <rect x="10" y="30" width="5" height="5" fill="#000000" />
              <rect x="15" y="30" width="5" height="5" fill="#000000" />
              <rect x="25" y="30" width="5" height="5" fill="#000000" />
              <rect x="30" y="30" width="5" height="5" fill="#000000" />
              <rect x="35" y="30" width="5" height="5" fill="#000000" />
              <rect x="0" y="35" width="5" height="5" fill="#000000" />
              <rect x="15" y="35" width="5" height="5" fill="#000000" />
              <rect x="30" y="35" width="5" height="5" fill="#000000" />
              <rect x="0" y="40" width="5" height="5" fill="#000000" />
              <rect x="5" y="40" width="5" height="5" fill="#000000" />
              <rect x="10" y="40" width="5" height="5" fill="#000000" />
              <rect x="15" y="40" width="5" height="5" fill="#000000" />
              <rect x="20" y="40" width="5" height="5" fill="#000000" />
              <rect x="25" y="40" width="5" height="5" fill="#000000" />
              <rect x="30" y="40" width="5" height="5" fill="#000000" />
              <rect x="35" y="40" width="5" height="5" fill="#000000" />
              <rect x="40" y="40" width="5" height="5" fill="#000000" />
            </g>
          </svg>
        `;
        
        setQrCode(mockQrCode);
        setIsLoading(false);
        
        toast({
          title: "QR Code gerado",
          description: "Escaneie o QR code com seu WhatsApp para conectar.",
        });
      }, 1500);
    } catch (error) {
      console.error("Error generating QR code:", error);
      toast({
        title: "Erro",
        description: "Falha ao gerar QR code. Tente novamente.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // Fetch contacts after QR scan
  const fetchContacts = async () => {
    setLoadingContacts(true);
    
    try {
      // For demo, simulate loading then connection
      setTimeout(() => {
        setIsConnected(true);
        setLoadingContacts(false);
        
        // Add some mock contacts for demo
        const mockContacts = [
          {
            id: 'contact1',
            name: 'João Silva',
            phone: '+5511999990001',
            category: 'cliente',
            isOnline: true,
            lastMessage: 'Olá, tudo bem?',
            lastMessageTime: '10:30',
            unread: 2
          },
          {
            id: 'contact2',
            name: 'Maria Souza',
            phone: '+5511999990002',
            category: 'fornecedor',
            isOnline: false,
            lastMessage: 'Podemos marcar uma reunião amanhã?',
            lastMessageTime: 'ontem',
            unread: 0
          },
          {
            id: 'contact3',
            name: 'Carlos Oliveira',
            phone: '+5511999990003',
            category: 'equipe',
            isOnline: true,
            lastMessage: 'Enviado o relatório!',
            lastMessageTime: '09:15',
            unread: 1
          }
        ];
        
        setContacts(mockContacts);
        
        toast({
          title: "WhatsApp conectado",
          description: "Seus contatos foram carregados com sucesso",
        });
      }, 2000);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast({
        title: "Erro",
        description: "Falha ao carregar contatos. Tente novamente.",
        variant: "destructive",
      });
      setLoadingContacts(false);
    }
  };

  // Handle chat selection
  const handleChatSelect = (contactId: string) => {
    setSelectedChat(contactId);
    
    // Generate mock messages for the selected contact
    const selected = contacts.find(c => c.id === contactId);
    if (selected) {
      // Create some mock messages
      const mockMessages = [
        {
          id: `msg_${Date.now()}_1`,
          text: `Olá ${selected.name.split(' ')[0]}, como posso ajudar?`,
          isSent: true,
          timestamp: new Date(Date.now() - 3600000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        },
        {
          id: `msg_${Date.now()}_2`,
          text: selected.lastMessage,
          isSent: false,
          timestamp: selected.lastMessageTime === 'ontem' ? 'ontem' : new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        }
      ];
      
      setMessages(mockMessages);
    } else {
      setMessages([]);
    }
    
    // Mark as read
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
    
    // Add message to chat
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

  // Handle new contact submission
  const handleNewContact = () => {
    if (!newContact.name.trim() || !newContact.phone.trim()) {
      toast({
        title: "Erro",
        description: "Nome e telefone são obrigatórios",
        variant: "destructive",
      });
      return;
    }
    
    // Create mock contact
    const newId = `contact_${Date.now()}`;
    const contact = {
      id: newId,
      name: newContact.name,
      phone: newContact.phone,
      category: 'geral',
      isOnline: false,
      lastMessage: '',
      lastMessageTime: 'agora',
      unread: 0
    };
    
    // Add to contacts
    setContacts(prev => [contact, ...prev]);
    
    // Reset form and close dialog
    setNewContact({ name: "", phone: "" });
    setIsNewContactOpen(false);
    
    // Select the new chat
    setTimeout(() => {
      handleChatSelect(newId);
    }, 100);
    
    toast({
      title: "Contato adicionado",
      description: `${newContact.name} foi adicionado aos seus contatos`
    });
  };

  // Filter contacts based on search and category
  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch = (
      contact?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact?.phone?.includes(searchTerm)
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

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex h-full gap-4 max-h-[calc(100vh-130px)]">
      {/* Left sidebar - Contact list - Fixed width and scrollable */}
      <div className="w-80 bg-white rounded-lg flex flex-col h-full">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bricolage">Conversas</h1>
            <Dialog open={isNewContactOpen} onOpenChange={setIsNewContactOpen}>
              <DialogTrigger asChild>
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="rounded-full h-8 w-8"
                >
                  <UserPlus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Novo Contato</DialogTitle>
                  <DialogDescription>
                    Adicione um novo contato para iniciar uma conversa.
                    {!isConnected && <span className="text-red-500 block mt-2">
                      Conecte seu WhatsApp primeiro para enviar mensagens.
                    </span>}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Nome
                    </Label>
                    <Input
                      id="name"
                      value={newContact.name}
                      onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right">
                      Telefone
                    </Label>
                    <Input
                      id="phone"
                      value={newContact.phone}
                      onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                      placeholder="+55 11 99999-9999"
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    onClick={handleNewContact}
                    disabled={!isConnected || !newContact.name || !newContact.phone}
                    className="bg-whatsapp hover:bg-whatsapp-dark"
                  >
                    {isConnected ? "Adicionar e Iniciar Conversa" : "Conecte o WhatsApp Primeiro"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
        <div className="relative border-b py-1">
          <div className="categories-scroll px-4 flex justify-center" ref={categoriesRef}>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setFilter(category.id)}
                className={`category-button relative mx-1 ${
                  filter === category.id 
                    ? "bg-whatsapp text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.icon}
                <span className="category-label">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
        
        {!isConnected ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-center space-y-3">
              <div className="mx-auto w-16 h-16 mb-2 flex items-center justify-center rounded-full bg-whatsapp/10">
                <QrCode className="h-8 w-8 text-whatsapp" />
              </div>
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
          <div className="flex-1 p-3 space-y-3">
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
          <ScrollArea className="flex-1">
            <div className="p-2">
              {filteredContacts.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <Users className="h-10 w-10 mx-auto mb-2 text-muted-foreground/50" />
                  <p>Nenhum contato encontrado.</p>
                  <p className="text-xs mt-2">Inicie uma nova conversa para adicionar contatos.</p>
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
          </ScrollArea>
        )}
      </div>
      
      {/* Right content - QR code or chat */}
      <div className="flex-1 flex flex-col bg-white rounded-lg h-full">
        {!isConnected ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <Card className="w-full max-w-md mx-auto border-0">
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
                      className="w-64 h-64 mx-auto bg-white p-4 flex items-center justify-center rounded-lg border"
                      dangerouslySetInnerHTML={{ __html: qrCode }}
                    />
                    <div className="mt-6 space-y-2">
                      <p className="text-sm text-center text-muted-foreground">
                        1. Abra o WhatsApp no seu celular<br/>
                        2. Toque em Menu ou Configurações<br/>
                        3. Selecione WhatsApp Web<br/>
                        4. Aponte a câmera para este QR code
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={generateQRCode} 
                        disabled={isLoading}
                        className="w-full mt-4"
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
                    {contacts.find(c => c.id === selectedChat)?.name?.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
                
                <div className="ml-3">
                  <h3 className="font-medium">
                    {contacts.find(c => c.id === selectedChat)?.name || "Contato"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {contacts.find(c => c.id === selectedChat)?.isOnline 
                      ? "online" 
                      : "visto por último hoje"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="icon">
                  <Video className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Phone className="h-5 w-5" />
                </Button>
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
            </div>
            
            {/* Chat messages */}
            <ScrollArea className="flex-1 px-3 bg-[#f0f2f5]">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-whatsapp/10">
                      <MessageSquare className="h-8 w-8 text-whatsapp" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Não há mensagens nesta conversa.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex mb-3 ${message.isSent ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[75%] rounded-lg p-3 px-4 ${
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
              )}
            </ScrollArea>
            
            {/* Message input */}
            <div className="border-t p-3 bg-[#f0f2f5]">
              <form className="flex items-center gap-2" onSubmit={handleSendMessage}>
                <Button type="button" variant="ghost" size="icon" className="text-gray-500">
                  <Smile className="h-5 w-5" />
                </Button>
                <Button type="button" variant="ghost" size="icon" className="text-gray-500">
                  <Paperclip className="h-5 w-5" />
                </Button>
                <Input
                  type="text"
                  placeholder="Digite uma mensagem..."
                  className="flex-1 bg-white"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                />
                {inputMessage.trim() ? (
                  <Button 
                    type="submit" 
                    size="icon" 
                    className="bg-whatsapp hover:bg-whatsapp-dark"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button 
                    type="button" 
                    size="icon" 
                    className="bg-whatsapp hover:bg-whatsapp-dark"
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                )}
              </form>
            </div>
          </div>
        ) : (
          // No chat selected
          <div className="flex-1 flex items-center justify-center bg-[#f0f2f5]">
            <div className="text-center p-6">
              <div className="mx-auto w-20 h-20 mb-4 flex items-center justify-center rounded-full bg-whatsapp/10">
                <Users className="h-10 w-10 text-whatsapp" />
              </div>
              <h3 className="text-xl font-bricolage font-bold mb-2">Selecione uma conversa</h3>
              <p className="text-muted-foreground max-w-md">
                Escolha um contato na lista à esquerda para visualizar as mensagens ou inicie uma nova conversa.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chats;
