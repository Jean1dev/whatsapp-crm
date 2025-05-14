
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { contacts } from "@/lib/mock-data";
import { Search, RefreshCw, QrCode } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useToast } from "@/hooks/use-toast";
import { whatsappAPI } from "@/integrations/whatsapp";

const Chats = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
      const sessionKey = `session_${Math.random().toString(36).substring(7)}`;
      
      // Initialize session
      const initResponse = await whatsappAPI.initSession(sessionKey);
      
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
      const qrCodeData = await whatsappAPI.getQRCode(sessionKey);
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

  useEffect(() => {
    // Checking connection status could be implemented here
    // For now, we'll just simulate a connection
    const checkConnection = () => {
      // Placeholder for actual connection check
    };
    
    checkConnection();
  }, []);

  return (
    <div className="flex h-full">
      {/* Left sidebar - Contact list */}
      <div className="w-1/3 border-r pr-4 h-[calc(100vh-120px)] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bricolage font-bold">Conversas</h1>
          {!isConnected ? (
            <Button 
              onClick={generateQRCode} 
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <QrCode className="h-4 w-4 mr-2" />
              )}
              Conectar WhatsApp
            </Button>
          ) : (
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              <span className="text-xs text-muted-foreground">Conectado</span>
            </div>
          )}
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Pesquisar contatos..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Tabs defaultValue="all" onValueChange={setFilter}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="cliente">Clientes</TabsTrigger>
            <TabsTrigger value="fornecedor">Fornecedores</TabsTrigger>
            <TabsTrigger value="equipe">Equipe</TabsTrigger>
            <TabsTrigger value="geral">Geral</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-2">
            {renderContactList(filteredContacts)}
          </TabsContent>
          <TabsContent value="cliente" className="space-y-2">
            {renderContactList(filteredContacts)}
          </TabsContent>
          <TabsContent value="fornecedor" className="space-y-2">
            {renderContactList(filteredContacts)}
          </TabsContent>
          <TabsContent value="equipe" className="space-y-2">
            {renderContactList(filteredContacts)}
          </TabsContent>
          <TabsContent value="geral" className="space-y-2">
            {renderContactList(filteredContacts)}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Right content - QR code or chat */}
      <div className="w-2/3 pl-4">
        {!isConnected && !qrCode ? (
          <Card className="h-full flex items-center justify-center">
            <CardContent className="p-6 text-center">
              <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-muted">
                <QrCode className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bricolage font-bold mb-2">Conecte seu WhatsApp</h3>
              <p className="text-muted-foreground mb-4">
                Clique no botão "Conectar WhatsApp" acima para gerar um QR code e escaneie com seu celular.
              </p>
              <Button 
                onClick={generateQRCode} 
                disabled={isLoading}
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <QrCode className="h-4 w-4 mr-2" />
                )}
                Conectar WhatsApp
              </Button>
            </CardContent>
          </Card>
        ) : qrCode ? (
          <Card>
            <CardHeader className="pb-2">
              <h2 className="text-xl font-bricolage font-bold">
                Escaneie o QR Code
              </h2>
              <p className="text-sm text-muted-foreground">
                Abra o WhatsApp no seu celular e escaneie este código para conectar.
              </p>
            </CardHeader>
            <CardContent>
              <div className="w-64 h-64 mx-auto">
                <AspectRatio ratio={1 / 1}>
                  <div 
                    className="w-full h-full"
                    dangerouslySetInnerHTML={{ __html: qrCode }}
                  />
                </AspectRatio>
              </div>
              <div className="mt-4 text-center">
                <Button variant="outline" onClick={generateQRCode} disabled={isLoading}>
                  {isLoading ? "Gerando..." : "Gerar novo QR code"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="h-full flex items-center justify-center">
            <CardContent className="text-center p-6">
              <p className="text-muted-foreground">
                Selecione uma conversa para visualizar as mensagens.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

const renderContactList = (contacts: any[]) => {
  if (contacts.length === 0) {
    return (
      <Card>
        <CardContent className="p-4 text-center text-muted-foreground">
          Nenhum contato encontrado.
        </CardContent>
      </Card>
    );
  }

  return contacts.map((contact) => (
    <Link to={`/chats/${contact.id}`} key={contact.id}>
      <Card className="hover:bg-muted/50 transition-colors mb-2">
        <CardContent className="p-3 flex items-center space-x-3">
          <div className="relative">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
              <span className="font-medium">{contact.name.charAt(0)}</span>
            </div>
            {contact.isOnline && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-medium truncate">{contact.name}</h3>
              {contact.lastMessageTime && (
                <span className="text-xs text-muted-foreground">{contact.lastMessageTime}</span>
              )}
            </div>
            {contact.lastMessage && (
              <p className="text-sm text-muted-foreground truncate">{contact.lastMessage}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  ));
};

export default Chats;
