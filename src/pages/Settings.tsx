import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { funnels as mockFunnels } from "@/lib/mock-data";
import { Plus, Trash2 } from "lucide-react";
import { whatsappAPI } from "@/integrations/whatsapp";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("account");
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Configurações</h1>
      </div>

      <Tabs defaultValue="account" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="account">Conta</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          <TabsTrigger value="ai">Agente IA</TabsTrigger>
          <TabsTrigger value="funnels">Funis</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <AccountSettings />
        </TabsContent>
        <TabsContent value="whatsapp">
          <WhatsAppSettings />
        </TabsContent>
        <TabsContent value="ai">
          <AISettings />
        </TabsContent>
        <TabsContent value="funnels">
          <FunnelSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const AccountSettings = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: "Admin",
    email: "admin@whatsappcrm.com",
    company: "Minha Empresa",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Configurações salvas",
      description: "Suas configurações de conta foram atualizadas.",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
          <CardDescription>
            Atualize seus dados de perfil.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Empresa</Label>
            <Input
              id="company"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
            />
          </div>
          <Button type="submit">Salvar Alterações</Button>
        </CardContent>
      </Card>
    </form>
  );
};

const WhatsAppSettings = () => {
  const { toast } = useToast();
  const [connected, setConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      const key = `whatsapp-${Math.random().toString(36).substring(7)}`;
      
      const initResponse = await whatsappAPI.initSession(key);
      
      if (initResponse.error) {
        throw new Error(initResponse.message);
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
      const qrCode = await whatsappAPI.getQRCode(key);
      
      const qrWindow = window.open('', '_blank');
      if (qrWindow) {
        qrWindow.document.write(qrCode);
        qrWindow.document.close();
      }

      setConnected(true);
      toast({
        title: "QR Code gerado",
        description: "Escaneie o QR Code com seu WhatsApp para conectar.",
      });
    } catch (error) {
      toast({
        title: "Erro ao conectar",
        description: error instanceof Error ? error.message : "Falha ao gerar QR Code",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    setConnected(false);
    toast({
      title: "WhatsApp desconectado",
      description: "Seu WhatsApp foi desconectado.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conexão com WhatsApp</CardTitle>
        <CardDescription>
          Conecte sua conta do WhatsApp para iniciar conversas.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border rounded-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Status da Conexão</h3>
              <p className="text-sm text-muted-foreground">
                {connected ? "Conectado ao WhatsApp" : "Não conectado"}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`}></div>
              <span className="text-sm">{connected ? "Online" : "Offline"}</span>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          {!connected ? (
            <Button onClick={handleConnect} disabled={isLoading}>
              {isLoading ? "Gerando QR Code..." : "Conectar WhatsApp"}
            </Button>
          ) : (
            <Button variant="destructive" onClick={handleDisconnect}>
              Desconectar WhatsApp
            </Button>
          )}
        </div>
        <div className="space-y-2">
          <h3 className="font-medium">Como conectar?</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            <li>Clique no botão "Conectar WhatsApp"</li>
            <li>Abra o WhatsApp no seu celular</li>
            <li>Toque em Menu ou Configurações e selecione WhatsApp Web</li>
            <li>Aponte seu celular para a tela para escanear o código QR</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

const AISettings = () => {
  const { toast } = useToast();
  const [aiEnabled, setAiEnabled] = useState(false);
  const [autoReply, setAutoReply] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Configurações de IA salvas",
      description: "Suas configurações de IA foram atualizadas.",
    });
  };

  return (
    <form onSubmit={handleSave}>
      <Card>
        <CardHeader>
          <CardTitle>Configurações de IA</CardTitle>
          <CardDescription>
            Configure o comportamento do agente de IA nas conversas.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="ai-enabled">Ativar Agente de IA</Label>
                <p className="text-sm text-muted-foreground">
                  Habilita o assistente de IA nas conversas
                </p>
              </div>
              <Switch
                id="ai-enabled"
                checked={aiEnabled}
                onCheckedChange={setAiEnabled}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-reply">Resposta Automática</Label>
                <p className="text-sm text-muted-foreground">
                  Responde automaticamente às mensagens recebidas
                </p>
              </div>
              <Switch
                id="auto-reply"
                checked={autoReply}
                onCheckedChange={setAutoReply}
                disabled={!aiEnabled}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="custom-prompt">Prompt Personalizado</Label>
            <Input
              id="custom-prompt"
              placeholder="Ex: Você é um assistente de vendas amigável..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              disabled={!aiEnabled}
            />
            <p className="text-xs text-muted-foreground">
              Personalize como a IA deve se comportar ao conversar com clientes.
            </p>
          </div>
          <Button type="submit">Salvar Configurações</Button>
        </CardContent>
      </Card>
    </form>
  );
};

const FunnelSettings = () => {
  const { toast } = useToast();
  const [funnels, setFunnels] = useState(mockFunnels);
  const [selectedFunnel, setSelectedFunnel] = useState(mockFunnels[0]);
  const [newStageName, setNewStageName] = useState("");

  const handleAddStage = () => {
    if (!newStageName.trim()) return;

    const newStage = {
      id: `stage-${Date.now()}`,
      name: newStageName,
      order: selectedFunnel.stages.length,
    };

    const updatedFunnel = {
      ...selectedFunnel,
      stages: [...selectedFunnel.stages, newStage],
    };

    setFunnels(funnels.map(f => f.id === selectedFunnel.id ? updatedFunnel : f));
    setSelectedFunnel(updatedFunnel);
    setNewStageName("");

    toast({
      title: "Estágio adicionado",
      description: `O estágio "${newStageName}" foi adicionado ao funil "${selectedFunnel.name}".`,
    });
  };

  const handleDeleteStage = (stageId: string) => {
    if (selectedFunnel.stages.length <= 1) {
      toast({
        title: "Não é possível excluir",
        description: "Um funil deve ter pelo menos um estágio.",
        variant: "destructive",
      });
      return;
    }

    const updatedStages = selectedFunnel.stages.filter(s => s.id !== stageId);
    
    // Reorder stages
    const reorderedStages = updatedStages.map((stage, index) => ({
      ...stage,
      order: index,
    }));

    const updatedFunnel = {
      ...selectedFunnel,
      stages: reorderedStages,
    };

    setFunnels(funnels.map(f => f.id === selectedFunnel.id ? updatedFunnel : f));
    setSelectedFunnel(updatedFunnel);

    toast({
      title: "Estágio removido",
      description: `O estágio foi removido do funil "${selectedFunnel.name}".`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Funis</CardTitle>
          <CardDescription>
            Configure os funis e estágios para organizar suas conversas.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Selecione um Funil</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {funnels.map((funnel) => (
                <Button
                  key={funnel.id}
                  variant={selectedFunnel.id === funnel.id ? "default" : "outline"}
                  onClick={() => setSelectedFunnel(funnel)}
                  className="justify-start"
                >
                  {funnel.name}
                </Button>
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Estágios do Funil</Label>
              <span className="text-sm text-muted-foreground">
                {selectedFunnel.stages.length} estágios
              </span>
            </div>
            <div className="space-y-2">
              {selectedFunnel.stages
                .sort((a, b) => a.order - b.order)
                .map((stage) => (
                  <div
                    key={stage.id}
                    className="flex items-center justify-between p-2 border rounded-md"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{stage.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteStage(stage.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
            </div>
          </div>

          <div className="flex space-x-2">
            <Input
              placeholder="Nome do novo estágio"
              value={newStageName}
              onChange={(e) => setNewStageName(e.target.value)}
            />
            <Button onClick={handleAddStage} disabled={!newStageName.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Estágio
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
