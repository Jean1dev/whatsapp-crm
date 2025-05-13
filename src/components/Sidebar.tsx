
import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronRight, LogOut, MessageSquare, Settings, Users, Folder, Home, X, Menu } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { WhatsappIcon } from "./WhatsappIcon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const { pathname } = useLocation();
  const { user, profile, signOut } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [pathname, isMobile, setIsOpen]);

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const fullName = profile?.full_name || user?.email?.split("@")[0] || "Usuário";
  const userInitials = getInitials(fullName);

  const navItems = [
    { path: "/", icon: <Home className="w-5 h-5" />, label: "Dashboard" },
    { path: "/chats", icon: <MessageSquare className="w-5 h-5" />, label: "Conversas" },
    { path: "/contacts", icon: <Users className="w-5 h-5" />, label: "Contatos" },
    { path: "/funnels", icon: <Folder className="w-5 h-5" />, label: "Funis" },
    { path: "/settings", icon: <Settings className="w-5 h-5" />, label: "Configurações" },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-20" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed left-0 top-0 bottom-0 z-30 flex h-screen flex-col bg-white border-r shadow-sm transition-all duration-300 ${
          isOpen ? "w-64" : isMobile ? "-translate-x-full" : "w-20"
        }`}
      >
        {/* Close button on mobile */}
        {isMobile && (
          <button
            onClick={() => setIsOpen(false)}
            className="absolute right-3 top-3 p-1 text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        )}

        {/* Logo */}
        <div className="flex items-center p-4">
          <div className={`flex items-center ${!isOpen && !isMobile ? "justify-center w-full" : ""}`}>
            <div className="bg-whatsapp text-white p-2 rounded-lg">
              <WhatsappIcon className="h-6 w-6" />
            </div>
            {(isOpen || isMobile) && (
              <div className="ml-3">
                <h2 className="text-lg font-bold">WhatsApp CRM</h2>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-auto py-4">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center p-3 rounded-lg transition-colors
                    ${isActive 
                      ? "bg-whatsapp/10 text-whatsapp font-medium" 
                      : "text-gray-600 hover:bg-gray-100"
                    }
                  `}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {(isOpen || isMobile) && (
                    <span className="ml-3">{item.label}</span>
                  )}
                  {!isOpen && !isMobile && (
                    <span className="absolute left-full rounded-md px-2 py-1 ml-1 bg-gray-900 text-white text-sm invisible opacity-0 -translate-x-3 group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                      {item.label}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User profile */}
        <div className={`border-t p-4 ${!isOpen && !isMobile ? "flex justify-center" : ""}`}>
          <div className="flex items-center">
            <Avatar>
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback className="bg-whatsapp/20 text-whatsapp">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            
            {(isOpen || isMobile) && (
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium truncate">{fullName}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            )}
          </div>
          
          {(isOpen || isMobile) && (
            <Button 
              variant="ghost"
              size="sm"
              className="mt-3 w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50"
              onClick={signOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          )}
        </div>

        {/* Collapse button (desktop only) */}
        {!isMobile && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`absolute -right-3 top-12 flex h-6 w-6 items-center justify-center rounded-full border bg-white text-gray-600 hover:bg-gray-100 ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
