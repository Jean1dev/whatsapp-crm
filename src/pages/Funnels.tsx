
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { funnels as mockFunnels, conversations as mockConversations, contacts } from "@/lib/mock-data";
import { Plus, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Funnels = () => {
  const [funnels, setFunnels] = useState(mockFunnels);
  const [conversations, setConversations] = useState(mockConversations);
  const [activeFunnel, setActiveFunnel] = useState(mockFunnels[0].id);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const { toast } = useToast();

  const activeFunnelData = funnels.find((funnel) => funnel.id === activeFunnel);
  
  const getConversationsByStage = (stageId: string) => {
    return conversations
      .filter((conv) => conv.funnelId === activeFunnel && conv.stageId === stageId)
      .map((conv) => {
        const contact = contacts.find((c) => c.id === conv.contactId);
        return { ...conv, contact };
      });
  };

  const handleDragStart = (e: React.DragEvent, conversationId: string) => {
    e.dataTransfer.setData("conversationId", conversationId);
  };

  const handleDragOver = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    setDragOver(stageId);
  };

  const handleDragLeave = () => {
    setDragOver(null);
  };

  const handleDrop = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    const conversationId = e.dataTransfer.getData("conversationId");
    
    setConversations((prevConversations) =>
      prevConversations.map((conv) =>
        conv.id === conversationId ? { ...conv, stageId } : conv
      )
    );
    
    setDragOver(null);
    
    toast({
      title: "Conversa movida",
      description: "A conversa foi movida para outra etapa do funil."
    });
  };

  const addNewFunnel = (name: string) => {
    const newFunnel = {
      id: `funnel-${Date.now()}`,
      name,
      stages: [
        {
          id: `stage-${Date.now()}-1`,
          name: "Novo",
          order: 0,
        },
        {
          id: `stage-${Date.now()}-2`,
          name: "Em Progresso",
          order: 1,
        },
        {
          id: `stage-${Date.now()}-3`,
          name: "Concluído",
          order: 2,
        },
      ],
    };
    
    setFunnels([...funnels, newFunnel]);
    toast({
      title: "Novo funil criado",
      description: `O funil "${name}" foi criado com sucesso.`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Funis</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Funil
            </Button>
          </DialogTrigger>
          <DialogContent>
            <NewFunnelForm onSubmit={addNewFunnel} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Selecionar Funil</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeFunnel} onValueChange={setActiveFunnel} className="w-full">
            <TabsList className="w-full">
              {funnels.map((funnel) => (
                <TabsTrigger key={funnel.id} value={funnel.id} className="flex-1">
                  {funnel.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {activeFunnelData && (
        <div className="flex gap-4 overflow-x-auto pb-6 h-[calc(100vh-350px)]">
          {activeFunnelData.stages.sort((a, b) => a.order - b.order).map((stage) => (
            <div
              key={stage.id}
              className={`kanban-column ${dragOver === stage.id ? "border-2 border-whatsapp" : ""}`}
              onDragOver={(e) => handleDragOver(e, stage.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              <div className="kanban-column-header">
                {stage.name}{" "}
                <span className="text-xs text-muted-foreground ml-1">
                  ({getConversationsByStage(stage.id).length})
                </span>
              </div>
              <div className="kanban-column-content">
                {getConversationsByStage(stage.id).map((conversation) => (
                  <div
                    key={conversation.id}
                    className="conversation-card"
                    draggable
                    onDragStart={(e) => handleDragStart(e, conversation.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-medium">{conversation.contact?.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {conversation.contact?.phone}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2 flex justify-between">
                      <span>
                        Categoria: {conversation.contact?.category}
                      </span>
                      <span>
                        {new Date(conversation.lastMessageTimestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const NewFunnelForm = ({ onSubmit }: { onSubmit: (name: string) => void }) => {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(name);
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>Criar Novo Funil</DialogTitle>
        <DialogDescription>
          Crie um novo funil para organizar suas conversas.
        </DialogDescription>
      </DialogHeader>
      <div className="py-4 space-y-4">
        <div className="space-y-2">
          <label htmlFor="name">Nome do Funil</label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Vendas, Suporte, Atendimento"
            required
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" disabled={!name.trim()}>Criar Funil</Button>
      </DialogFooter>
    </form>
  );
};

export default Funnels;
