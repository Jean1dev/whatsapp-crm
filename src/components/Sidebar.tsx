
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  MessageSquare,
  Users,
  Folder,
  Settings,
  Home,
} from "lucide-react";

type SidebarProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const navItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/chats", label: "Conversas", icon: MessageSquare },
    { path: "/contacts", label: "Contatos", icon: Users },
    { path: "/funnels", label: "Funis", icon: Folder },
    { path: "/settings", label: "Configurações", icon: Settings },
  ];

  return (
    <aside
      className={cn(
        "bg-sidebar border-r transition-all duration-300 h-screen flex flex-col fixed md:relative z-10 top-0 left-0",
        isOpen ? "w-64" : "w-0 md:w-16 overflow-hidden"
      )}
    >
      <div className="h-16 border-b flex items-center justify-center p-4">
        <div className="flex items-center space-x-2">
          <div className="bg-whatsapp rounded-full h-8 w-8 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">W</span>
          </div>
          {isOpen && <span className="font-semibold text-lg">WhatsApp CRM</span>}
        </div>
      </div>
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center h-10 px-3 rounded-md transition-colors hover:bg-sidebar-accent",
                    isActive ? "bg-sidebar-accent text-sidebar-primary font-medium" : "text-sidebar-foreground",
                    !isOpen && "justify-center"
                  )
                }
              >
                <item.icon className="h-5 w-5 mr-2" />
                {isOpen && <span>{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="font-medium text-sm">U</span>
          </div>
          {isOpen && (
            <div>
              <p className="font-medium text-sm">Usuário</p>
              <p className="text-xs text-gray-500">admin@whatsappcrm.com</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
