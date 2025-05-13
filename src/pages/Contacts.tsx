
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
import { Plus, Search, MoreHorizontal, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Contatos</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Contato
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientsCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Fornecedores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{suppliersCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Equipe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Geral</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{generalCount}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center space-x-4">
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

      <Tabs defaultValue="all" onValueChange={setFilterCategory}>
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="cliente">Clientes</TabsTrigger>
          <TabsTrigger value="fornecedor">Fornecedores</TabsTrigger>
          <TabsTrigger value="equipe">Equipe</TabsTrigger>
          <TabsTrigger value="geral">Geral</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <ContactTable contacts={filteredContacts} />
        </TabsContent>
        <TabsContent value="cliente" className="mt-4">
          <ContactTable contacts={filteredContacts} />
        </TabsContent>
        <TabsContent value="fornecedor" className="mt-4">
          <ContactTable contacts={filteredContacts} />
        </TabsContent>
        <TabsContent value="equipe" className="mt-4">
          <ContactTable contacts={filteredContacts} />
        </TabsContent>
        <TabsContent value="geral" className="mt-4">
          <ContactTable contacts={filteredContacts} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const ContactTable = ({ contacts }: { contacts: any[] }) => {
  return (
    <div className="border rounded-md">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-4">Nome</th>
            <th className="text-left p-4">Telefone</th>
            <th className="text-left p-4">Categoria</th>
            <th className="text-left p-4">Status</th>
            <th className="text-right p-4">Ações</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr key={contact.id} className="border-b hover:bg-muted/50">
              <td className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <span className="font-medium">{contact.name.charAt(0)}</span>
                  </div>
                  <span>{contact.name}</span>
                </div>
              </td>
              <td className="p-4">{contact.phone}</td>
              <td className="p-4">
                <div className="capitalize">{contact.category}</div>
              </td>
              <td className="p-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${contact.isOnline ? "bg-green-500" : "bg-gray-300"}`}></div>
                  <span>{contact.isOnline ? "Online" : "Offline"}</span>
                </div>
              </td>
              <td className="p-4 text-right">
                <div className="flex justify-end space-x-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link to={`/chats/${contact.id}`}>
                      <MessageSquare className="h-4 w-4" />
                    </Link>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
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
              <td colSpan={5} className="text-center p-4 text-muted-foreground">
                Nenhum contato encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Contacts;
