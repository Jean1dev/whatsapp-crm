
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Users, ArrowRight, Folder } from "lucide-react";
import { contacts, conversations, funnels } from "@/lib/mock-data";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const totalContacts = contacts.length;
  const totalChats = Object.keys(conversations).length;
  const totalFunnels = funnels.length;
  
  const clientsCount = contacts.filter(c => c.category === "cliente").length;
  const suppliersCount = contacts.filter(c => c.category === "fornecedor").length;
  const teamCount = contacts.filter(c => c.category === "equipe").length;
  const generalCount = contacts.filter(c => c.category === "geral").length;

  const recentContacts = contacts.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button asChild>
          <Link to="/chats">
            Abrir Conversas <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Contatos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalContacts}</div>
            <p className="text-xs text-muted-foreground">
              {clientsCount} clientes, {suppliersCount} fornecedores, {teamCount} equipe, {generalCount} geral
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Conversas Ativas</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalChats}</div>
            <p className="text-xs text-muted-foreground">
              Acompanhe as conversas em andamento
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Funis Ativos</CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFunnels}</div>
            <p className="text-xs text-muted-foreground">
              Gerencie seus processos de vendas
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contatos Recentes</CardTitle>
            <CardDescription>Os últimos 5 contatos adicionados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentContacts.map((contact) => (
                <div key={contact.id} className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <span className="font-medium text-sm">{contact.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-sm text-muted-foreground">{contact.phone}</p>
                  </div>
                  <div className="ml-auto flex space-x-1">
                    <Button variant="ghost" size="icon" asChild>
                      <Link to={`/chats/${contact.id}`}>
                        <MessageSquare className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Funis Ativos</CardTitle>
            <CardDescription>Seus funis de vendas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {funnels.map((funnel) => (
                <div key={funnel.id} className="space-y-2">
                  <div className="flex items-center justify-between font-medium">
                    <span>{funnel.name}</span>
                    <span className="text-sm">{funnel.stages.length} estágios</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden flex">
                    {funnel.stages.map((stage) => (
                      <div 
                        key={stage.id} 
                        className="bg-whatsapp" 
                        style={{ 
                          width: `${100 / funnel.stages.length}%`, 
                          opacity: (funnel.stages.length - stage.order) / funnel.stages.length
                        }} 
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
