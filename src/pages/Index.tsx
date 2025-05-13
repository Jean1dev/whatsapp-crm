
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-whatsapp rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-6">
          <span className="text-white font-bold text-4xl">W</span>
        </div>
        <h1 className="text-4xl font-bold mb-4">Bem-vindo ao WhatsApp CRM</h1>
        <p className="text-xl text-gray-600 mb-8">
          Gerencie seus contatos, conversas e funis de vendas integrados com o WhatsApp.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
          <Button asChild size="lg" className="h-16">
            <Link to="/dashboard">
              <span className="text-lg">Dashboard</span>
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-16">
            <Link to="/chats">
              <span className="text-lg">Conversas</span>
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
        <div className="text-center">
          <div className="h-12 w-12 bg-whatsapp/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquareIcon className="h-6 w-6 text-whatsapp" />
          </div>
          <h3 className="font-semibold mb-2">Conversas</h3>
          <p className="text-sm text-gray-500">
            Gerencie suas conversas do WhatsApp direto na plataforma
          </p>
        </div>
        <div className="text-center">
          <div className="h-12 w-12 bg-whatsapp/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <UsersIcon className="h-6 w-6 text-whatsapp" />
          </div>
          <h3 className="font-semibold mb-2">Contatos</h3>
          <p className="text-sm text-gray-500">
            Organize seus contatos por categorias
          </p>
        </div>
        <div className="text-center">
          <div className="h-12 w-12 bg-whatsapp/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FolderIcon className="h-6 w-6 text-whatsapp" />
          </div>
          <h3 className="font-semibold mb-2">Funis</h3>
          <p className="text-sm text-gray-500">
            Acompanhe o progresso de suas negociações
          </p>
        </div>
        <div className="text-center">
          <div className="h-12 w-12 bg-whatsapp/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <BotIcon className="h-6 w-6 text-whatsapp" />
          </div>
          <h3 className="font-semibold mb-2">Agente IA</h3>
          <p className="text-sm text-gray-500">
            Automatize respostas com inteligência artificial
          </p>
        </div>
      </div>
    </div>
  );
};

const MessageSquareIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const UsersIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const FolderIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/>
  </svg>
);

const BotIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 8V4H8"/>
    <rect width="16" height="12" x="4" y="8" rx="2"/>
    <path d="M2 14h2"/>
    <path d="M20 14h2"/>
    <path d="M15 13v2"/>
    <path d="M9 13v2"/>
  </svg>
);

export default Index;
