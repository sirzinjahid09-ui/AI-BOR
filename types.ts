
export interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'voice';
  mediaUrl?: string;
}

export interface BotConfig {
  token: string;
  owner: string;
  name: string;
}

export enum BotStatus {
  OFFLINE = 'Offline',
  ONLINE = 'Online',
  CONNECTING = 'Connecting',
  ERROR = 'Error'
}
