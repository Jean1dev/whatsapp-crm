
export interface Contact {
  id: string;
  name: string;
  phone: string;
  category: "cliente" | "fornecedor" | "equipe" | "geral";
  lastMessage?: string;
  lastMessageTime?: string;
  avatar?: string;
  isOnline?: boolean;
}

export interface Message {
  id: string;
  contactId: string;
  text: string;
  timestamp: string;
  isFromContact: boolean;
  read: boolean;
}

export interface FunnelStage {
  id: string;
  name: string;
  order: number;
}

export interface Funnel {
  id: string;
  name: string;
  stages: FunnelStage[];
}

export interface Conversation {
  id: string;
  contactId: string;
  funnelId: string;
  stageId: string;
  lastMessageTimestamp: string;
}

// Mock contacts
export const contacts: Contact[] = [
  {
    id: "1",
    name: "João Silva",
    phone: "+5511999999999",
    category: "cliente",
    lastMessage: "Quando podemos agendar uma reunião?",
    lastMessageTime: "09:45",
    isOnline: true,
  },
  {
    id: "2",
    name: "Maria Oliveira",
    phone: "+5511988888888",
    category: "cliente",
    lastMessage: "Obrigado pelo atendimento!",
    lastMessageTime: "Ontem",
  },
  {
    id: "3",
    name: "Carlos Ferreira",
    phone: "+5511977777777",
    category: "fornecedor",
    lastMessage: "Os produtos chegam amanhã",
    lastMessageTime: "10:23",
  },
  {
    id: "4",
    name: "Ana Souza",
    phone: "+5511966666666",
    category: "equipe",
    lastMessage: "Reunião às 15h",
    lastMessageTime: "Ontem",
    isOnline: true,
  },
  {
    id: "5",
    name: "Pedro Santos",
    phone: "+5511955555555",
    category: "geral",
    lastMessage: "Podemos conversar depois?",
    lastMessageTime: "Seg",
  },
];

// Mock messages
export const messages: Record<string, Message[]> = {
  "1": [
    {
      id: "m1",
      contactId: "1",
      text: "Olá, tudo bem?",
      timestamp: "2023-05-12T09:30:00",
      isFromContact: true,
      read: true,
    },
    {
      id: "m2",
      contactId: "1",
      text: "Tudo ótimo, como posso ajudar?",
      timestamp: "2023-05-12T09:32:00",
      isFromContact: false,
      read: true,
    },
    {
      id: "m3",
      contactId: "1",
      text: "Estou interessado no seu produto",
      timestamp: "2023-05-12T09:35:00",
      isFromContact: true,
      read: true,
    },
    {
      id: "m4",
      contactId: "1",
      text: "Quando podemos agendar uma reunião?",
      timestamp: "2023-05-12T09:45:00",
      isFromContact: true,
      read: false,
    },
  ],
  "2": [
    {
      id: "m5",
      contactId: "2",
      text: "Bom dia",
      timestamp: "2023-05-11T08:30:00",
      isFromContact: true,
      read: true,
    },
    {
      id: "m6",
      contactId: "2",
      text: "Bom dia, Maria! Como posso ajudá-la hoje?",
      timestamp: "2023-05-11T08:35:00",
      isFromContact: false,
      read: true,
    },
    {
      id: "m7",
      contactId: "2",
      text: "Queria saber sobre os preços",
      timestamp: "2023-05-11T08:40:00",
      isFromContact: true,
      read: true,
    },
    {
      id: "m8",
      contactId: "2",
      text: "Claro, vou enviar nosso catálogo",
      timestamp: "2023-05-11T08:45:00",
      isFromContact: false,
      read: true,
    },
    {
      id: "m9",
      contactId: "2",
      text: "Obrigado pelo atendimento!",
      timestamp: "2023-05-11T09:00:00",
      isFromContact: true,
      read: true,
    },
  ],
};

// Mock funnels
export const funnels: Funnel[] = [
  {
    id: "1",
    name: "Vendas",
    stages: [
      {
        id: "s1",
        name: "Novo Lead",
        order: 0,
      },
      {
        id: "s2",
        name: "Qualificação",
        order: 1,
      },
      {
        id: "s3",
        name: "Proposta",
        order: 2,
      },
      {
        id: "s4",
        name: "Negociação",
        order: 3,
      },
      {
        id: "s5",
        name: "Fechamento",
        order: 4,
      },
    ],
  },
  {
    id: "2",
    name: "Suporte",
    stages: [
      {
        id: "s6",
        name: "Novo Ticket",
        order: 0,
      },
      {
        id: "s7",
        name: "Em Análise",
        order: 1,
      },
      {
        id: "s8",
        name: "Resolvendo",
        order: 2,
      },
      {
        id: "s9",
        name: "Resolvido",
        order: 3,
      },
    ],
  },
];

// Mock conversations
export const conversations: Conversation[] = [
  {
    id: "c1",
    contactId: "1",
    funnelId: "1",
    stageId: "s3",
    lastMessageTimestamp: "2023-05-12T09:45:00",
  },
  {
    id: "c2",
    contactId: "2",
    funnelId: "1",
    stageId: "s4",
    lastMessageTimestamp: "2023-05-11T09:00:00",
  },
  {
    id: "c3",
    contactId: "3",
    funnelId: "1",
    stageId: "s1",
    lastMessageTimestamp: "2023-05-12T10:23:00",
  },
  {
    id: "c4",
    contactId: "4",
    funnelId: "2",
    stageId: "s7",
    lastMessageTimestamp: "2023-05-11T15:00:00",
  },
  {
    id: "c5",
    contactId: "5",
    funnelId: "2",
    stageId: "s6",
    lastMessageTimestamp: "2023-05-09T14:30:00",
  },
];
