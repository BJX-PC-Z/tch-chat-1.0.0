import { GitHubIssue, ChatMessage, ChatUser, RepositoryConfig, ApiResponse, ChatEvent } from '@/types';
import { githubService } from './github';
import { formatRelativeTime, generateUserId, getRandomColor, getErrorMessage } from '@/utils';

class ChatService {
  private subscribers: Set<(event: ChatEvent) => void> = new Set();
  private syncInterval: NodeJS.Timeout | null = null;
  private lastSyncTime: Date | null = null;
  private isSyncing = false;
  private config: RepositoryConfig = {
    owner: 'BJX-PC-Z',
    repo: 'tch-chat',
    defaultBranch: 'main',
    labels: {
      chat: 'chat',
      urgent: 'urgent',
      discussion: 'discussion'
    }
  };

  // 订阅事件
  subscribe(callback: (event: ChatEvent) => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  // 发布事件
  private publish(event: ChatEvent): void {
    this.subscribers.forEach(callback => callback(event));
  }

  // 设置配置
  setConfig(config: Partial<RepositoryConfig>): void {
    this.config = { ...this.config, ...config };
  }

  getConfig(): RepositoryConfig {
    return { ...this.config };
  }

  // 转换GitHub Issue到ChatMessage
  private transformIssueToMessage(issue: GitHubIssue): ChatMessage {
    return {
      id: issue.id,
      title: issue.title,
      body: issue.body || '',
      author: issue.user.login,
      authorAvatar: issue.user.avatar_url,
      createdAt: issue.created_at,
      updatedAt: issue.updated_at,
      comments: issue.comments,
      isNew: this.lastSyncTime ? new Date(issue.created_at) > this.lastSyncTime : false,
      labels: issue.labels || []
    };
  }

  // 获取聊天消息
  async getMessages(): Promise<ApiResponse<ChatMessage[]>> {
    try {
      const result = await githubService.getIssues(this.config.owner, this.config.repo, {
        state: 'open',
        per_page: 50,
        sort: 'created',
        order: 'desc'
      });

      if (!result.success) {
        return {
          success: false,
          error: result.error,
        };
      }

      const messages = (result.data || []).map(issue => this.transformIssueToMessage(issue));
      return {
        success: true,
        data: messages,
      };
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error),
      };
    }
  }

  // 发送新消息（创建Issue）
  async sendMessage(title: string, content: string, tags: string[] = []): Promise<ApiResponse<ChatMessage>> {
    try {
      const labels = [...tags];
      
      // 添加聊天标签
      if (!labels.includes(this.config.labels.chat)) {
        labels.push(this.config.labels.chat);
      }

      const result = await githubService.createIssue(this.config.owner, this.config.repo, {
        title,
        body: content,
        labels
      });

      if (!result.success) {
        return {
          success: false,
          error: result.error,
        };
      }

      const message = this.transformIssueToMessage(result.data!);
      
      // 发布事件
      this.publish({
        type: 'message_added',
        data: message,
        timestamp: new Date(),
      });

      return {
        success: true,
        data: message,
      };
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error),
      };
    }
  }

  // 同步数据
  async syncMessages(): Promise<ApiResponse<ChatMessage[]>> {
    if (this.isSyncing) {
      return { success: false, error: '正在同步中...' };
    }

    this.isSyncing = true;
    
    try {
      const result = await this.getMessages();
      
      if (result.success) {
        this.lastSyncTime = new Date();
        
        // 发布同步完成事件
        this.publish({
          type: 'sync_completed',
          data: { messages: result.data, timestamp: this.lastSyncTime },
          timestamp: new Date(),
        });
      }

      return result;
    } finally {
      this.isSyncing = false;
    }
  }

  // 启动自动同步
  startAutoSync(interval: number = 30000): void {
    this.stopAutoSync();
    
    this.syncInterval = setInterval(async () => {
      try {
        await this.syncMessages();
      } catch (error) {
        this.publish({
          type: 'error',
          data: { message: '自动同步失败', error: getErrorMessage(error) },
          timestamp: new Date(),
        });
      }
    }, interval);
  }

  // 停止自动同步
  stopAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  // 验证仓库配置
  async validateRepository(): Promise<ApiResponse<{
    accessible: boolean;
    canRead: boolean;
    canWrite: boolean;
    error?: string;
  }>> {
    try {
      const result = await githubService.validateRepositoryAccess(
        this.config.owner, 
        this.config.repo
      );

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error),
      };
    }
  }

  // 获取用户统计
  getUserStats(messages: ChatMessage[]): Map<string, {
    messageCount: number;
    lastMessage: string;
    avatar: string;
    color: string;
  }> {
    const stats = new Map<string, any>();

    messages.forEach(message => {
      const existing = stats.get(message.author) || {
        messageCount: 0,
        lastMessage: message.createdAt,
        avatar: message.authorAvatar,
        color: getRandomColor()
      };

      existing.messageCount += 1;
      
      if (new Date(message.createdAt) > new Date(existing.lastMessage)) {
        existing.lastMessage = message.createdAt;
      }

      stats.set(message.author, existing);
    });

    return stats;
  }

  // 搜索消息
  searchMessages(messages: ChatMessage[], query: string): ChatMessage[] {
    if (!query.trim()) return messages;

    const lowercaseQuery = query.toLowerCase();
    return messages.filter(message => 
      message.title.toLowerCase().includes(lowercaseQuery) ||
      message.body.toLowerCase().includes(lowercaseQuery) ||
      message.author.toLowerCase().includes(lowercaseQuery)
    );
  }

  // 过滤消息
  filterMessages(messages: ChatMessage[], filters: {
    author?: string;
    tags?: string[];
    dateRange?: {
      start: Date;
      end: Date;
    };
    hasComments?: boolean;
  }): ChatMessage[] {
    return messages.filter(message => {
      // 作者过滤
      if (filters.author && message.author !== filters.author) {
        return false;
      }

      // 标签过滤
      if (filters.tags && filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some(tag => 
          message.labels.some(label => 
            label.name.toLowerCase().includes(tag.toLowerCase())
          )
        );
        if (!hasMatchingTag) return false;
      }

      // 日期范围过滤
      if (filters.dateRange) {
        const messageDate = new Date(message.createdAt);
        if (messageDate < filters.dateRange.start || messageDate > filters.dateRange.end) {
          return false;
        }
      }

      // 评论数量过滤
      if (filters.hasComments !== undefined) {
        const hasComments = message.comments > 0;
        if (hasComments !== filters.hasComments) {
          return false;
        }
      }

      return true;
    });
  }

  // 获取活跃用户
  getActiveUsers(messages: ChatMessage[], hoursBack: number = 24): ChatUser[] {
    const cutoffTime = new Date(Date.now() - hoursBack * 60 * 60 * 1000);
    const activeUsers = new Map<string, ChatUser>();

    messages
      .filter(message => new Date(message.createdAt) > cutoffTime)
      .forEach(message => {
        if (!activeUsers.has(message.author)) {
          activeUsers.set(message.author, {
            id: generateUserId(),
            name: message.author,
            avatar: message.authorAvatar,
            isOnline: true,
            lastSeen: new Date(message.createdAt),
          });
        } else {
          const user = activeUsers.get(message.author)!;
          if (new Date(message.createdAt) > user.lastSeen) {
            user.lastSeen = new Date(message.createdAt);
          }
        }
      });

    return Array.from(activeUsers.values());
  }

  // 获取实时统计
  getRealtimeStats(messages: ChatMessage[]): {
    totalMessages: number;
    activeUsers: number;
    newMessages: number;
    lastActivity: string;
  } {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    
    const recentMessages = messages.filter(message => 
      new Date(message.createdAt) > oneHourAgo
    );
    
    const newMessages = messages.filter(message => 
      message.isNew
    );

    const uniqueUsers = new Set(messages.map(message => message.author));
    const lastMessage = messages.length > 0 ? messages[0] : null;

    return {
      totalMessages: messages.length,
      activeUsers: uniqueUsers.size,
      newMessages: newMessages.length,
      lastActivity: lastMessage ? formatRelativeTime(lastMessage.createdAt) : '无活动'
    };
  }

  // 设置GitHub API Key
  setApiKey(apiKey: string): void {
    githubService.setApiKey(apiKey);
  }

  // 清理资源
  destroy(): void {
    this.stopAutoSync();
    this.subscribers.clear();
  }
}

// 导出单例实例
export const chatService = new ChatService();
export default chatService;