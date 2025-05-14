
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { contacts as mockContacts } from "@/lib/mock-data";
import { Plus, Search, MoreHorizontal, MessageSquare, User, Users, Briefcase, ListFilter } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Contacts = () => {
  const [contacts, setContacts] = useState(mockContacts);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          contact.phone.includes(searchTerm);
    
    if (filterCategory === "all") return matchesSearch;
    return matchesSearch && contact.category === filterCategory;
  });

  const clientsCount = contacts.filter(c => c.category === "cliente").length;
  const suppliersCount = contacts.filter(c => c.category === "fornecedor").length;
  const teamCount = contacts.filter(c => c.category === "equipe").length;
  const generalCount = contacts.filter(c => c.category === "geral").length;

  return (
    <div className="space-y-6 px-1">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Contatos</h1>
        <Button className="bg-whatsapp hover:bg-whatsapp-dark">
          <Plus className="h-4 w-4 mr-2" />
          Novo Contato
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-white border-0 overflow-hidden">
          <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-blue-100 border-b">
            <CardTitle className="text-sm font-medium flex items-center">
              <User className="h-4 w-4 mr-2 text-blue-600" />
              Clientes
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{clientsCount}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-0 overflow-hidden">
          <CardHeader className="pb-2 bg-gradient-to-r from-purple-50 to-purple-100 border-b">
            <CardTitle className="text-sm font-medium flex items-center">
              <Briefcase className="h-4 w-4 mr-2 text-purple-600" />
              Fornecedores
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{suppliersCount}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-0 overflow-hidden">
          <CardHeader className="pb-2 bg-gradient-to-r from-green-50 to-green-100 border-b">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-2 text-green-600" />
              Equipe
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{teamCount}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-0 overflow-hidden">
          <CardHeader className="pb-2 bg-gradient-to-r from-amber-50 to-amber-100 border-b">
            <CardTitle className="text-sm font-medium flex items-center">
              <ListFilter className="h-4 w-4 mr-2 text-amber-600" />
              Geral
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{generalCount}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center space-x-4 bg-white p-3 rounded-lg">
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
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            <SelectItem value="cliente">Cliente</SelectItem>
            <SelectItem value="fornecedor">Fornecedor</SelectItem>
            <SelectItem value="equipe">Equipe</SelectItem>
            <SelectItem value="geral">Geral</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="border-0 bg-white">
        <Tabs defaultValue="all" onValueChange={setFilterCategory} className="w-full">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="cliente">Clientes</TabsTrigger>
            <TabsTrigger value="fornecedor">Fornecedores</TabsTrigger>
            <TabsTrigger value="equipe">Equipe</TabsTrigger>
            <TabsTrigger value="geral">Geral</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4 p-0">
            <ContactTable contacts={filteredContacts} />
          </TabsContent>
          <TabsContent value="cliente" className="mt-4 p-0">
            <ContactTable contacts={filteredContacts} />
          </TabsContent>
          <TabsContent value="fornecedor" className="mt-4 p-0">
            <ContactTable contacts={filteredContacts} />
          </TabsContent>
          <TabsContent value="equipe" className="mt-4 p-0">
            <ContactTable contacts={filteredContacts} />
          </TabsContent>
          <TabsContent value="geral" className="mt-4 p-0">
            <ContactTable contacts={filteredContacts} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

const getCategoryStyle = (category: string) => {
  switch (category) {
    case "cliente":
      return "bg-blue-50 text-blue-600 border-blue-200";
    case "fornecedor":
      return "bg-purple-50 text-purple-600 border-purple-200";
    case "equipe":
      return "bg-green-50 text-green-600 border-green-200";
    case "geral":
      return "bg-amber-50 text-amber-600 border-amber-200";
    default:
      return "bg-gray-50 text-gray-600 border-gray-200";
  }
};

const ContactTable = ({ contacts }: { contacts: any[] }) => {
  return (
    <div className="rounded-md overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/30">
            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Nome</th>
            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Telefone</th>
            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Categoria</th>
            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
            <th className="text-right p-4 text-sm font-medium text-muted-foreground">Ações</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr key={contact.id} className="border-b hover:bg-muted/50 transition-colors">
              <td className="p-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-9 w-9 bg-gradient-to-br from-whatsapp to-whatsapp-dark">
                    <AvatarFallback className="bg-gradient-to-br from-whatsapp to-whatsapp-dark text-white">
                      {contact.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{contact.name}</span>
                </div>
              </td>
              <td className="p-4 text-sm">{contact.phone}</td>
              <td className="p-4">
                <div className={`capitalize text-xs py-1 px-2 rounded-full border inline-block font-medium ${getCategoryStyle(contact.category)}`}>
                  {contact.category}
                </div>
              </td>
              <td className="p-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${contact.isOnline ? "bg-green-500" : "bg-gray-300"}`}></div>
                  <span className="text-sm">{contact.isOnline ? "Online" : "Offline"}</span>
                </div>
              </td>
              <td className="p-4 text-right">
                <div className="flex justify-end space-x-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                    <Link to={`/chats/${contact.id}`}>
                      <MessageSquare className="h-4 w-4" />
                    </Link>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500">Excluir</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </td>
            </tr>
          ))}
          {contacts.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center p-6 text-muted-foreground">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <Users className="h-10 w-10 text-muted-foreground/50" />
                  <p>Nenhum contato encontrado.</p>
                  <p className="text-xs">Tente ajustar os filtros ou adicionar novos contatos.</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Contacts;
