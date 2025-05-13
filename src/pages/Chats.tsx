
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { contacts } from "@/lib/mock-data";
import { Search } from "lucide-react";

const Chats = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          contact.phone.includes(searchTerm);
    
    if (filter === "all") return matchesSearch;
    return matchesSearch && contact.category === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Conversas</h1>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Pesquisar contatos..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline">Novo Contato</Button>
      </div>

      <Tabs defaultValue="all" onValueChange={setFilter}>
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="cliente">Clientes</TabsTrigger>
          <TabsTrigger value="fornecedor">Fornecedores</TabsTrigger>
          <TabsTrigger value="equipe">Equipe</TabsTrigger>
          <TabsTrigger value="geral">Geral</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4 mt-4">
          {renderChatList(filteredContacts)}
        </TabsContent>
        <TabsContent value="cliente" className="space-y-4 mt-4">
          {renderChatList(filteredContacts)}
        </TabsContent>
        <TabsContent value="fornecedor" className="space-y-4 mt-4">
          {renderChatList(filteredContacts)}
        </TabsContent>
        <TabsContent value="equipe" className="space-y-4 mt-4">
          {renderChatList(filteredContacts)}
        </TabsContent>
        <TabsContent value="geral" className="space-y-4 mt-4">
          {renderChatList(filteredContacts)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const renderChatList = (contacts: any[]) => {
  if (contacts.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          Nenhum contato encontrado.
        </CardContent>
      </Card>
    );
  }

  return contacts.map((contact) => (
    <Link to={`/chats/${contact.id}`} key={contact.id}>
      <Card className="hover:bg-muted/50 transition-colors">
        <CardContent className="p-4 flex items-center space-x-4">
          <div className="relative">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <span className="font-medium">{contact.name.charAt(0)}</span>
            </div>
            {contact.isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
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
