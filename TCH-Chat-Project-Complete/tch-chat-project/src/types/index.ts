// GitHub Issues API Types
export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body: string;
  state: 'open' | 'closed';
  user: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
  created_at: string;
  updated_at: string;
  comments: number;
  html_url: string;
  repository_url: string;
  labels?: Array<{
    name: string;
    color: string;
    description?: string;
  }>;
}

export interface GitHubComment {
  id: number;
  body: string;
  user: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
  created_at: string;
  updated_at: string;
  html_url: string;
}

// Chat Room Types
export interface ChatMessage {
  id: number;
  title: string;
  body: string;
  author: string;
  authorAvatar: string;
  createdAt: string;
  updatedAt: string;
  comments: number;
  isNew: boolean;
  labels: Array<{
    name: string;
    color: string;
    description?: string;
  }>;
}

export interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastSeen: Date;
}

// App State Types
export interface AppState {
  isLoading: boolean;
  isConnected: boolean;
  error: string | null;
  messages: ChatMessage[];
  users: ChatUser[];
  currentUser: ChatUser | null;
  repository: string;
  lastSyncTime: Date | null;
}

export interface SyncSettings {
  interval: number; // seconds
  enabled: boolean;
  autoSync: boolean;
}

// Utility Types
export type Theme = 'light' | 'dark';
export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'error';

// Event Types
export interface ChatEvent {
  type: 'message_added' | 'message_updated' | 'user_joined' | 'user_left' | 'sync_completed' | 'error';
  data: any;
  timestamp: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Form Types
export interface MessageForm {
  title: string;
  content: string;
  tags: string[];
}

export interface UserProfile {
  name: string;
  avatar?: string;
  bio?: string;
}

// Configuration Types
export interface RepositoryConfig {
  owner: string;
  repo: string;
  defaultBranch: string;
  labels: {
    chat: string;
    urgent: string;
    discussion: string;
  };
}

// Error Types
export interface ChatError extends Error {
  code: string;
  context?: any;
  retryable: boolean;
}