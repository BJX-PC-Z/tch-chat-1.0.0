import React, { useState, useMemo } from 'react';
import { MessageCard, CompactMessageCard } from './MessageCard';
import { Loading, LoadingSpinner } from './ui/loading';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { ChatMessage } from '@/types';
import { ChevronUp, ChevronDown, MessageCircle, Users, Clock } from 'lucide-react';
import { formatRelativeTime } from '@/utils';
import { cn } from '@/utils';

interface MessageListProps {
  messages: ChatMessage[];
  onMessageClick?: (message: ChatMessage) => void;
  isLoading?: boolean;
  className?: string;
  variant?: 'default' | 'compact' | 'dense';
}

export function MessageList({
  messages,
  onMessageClick,
  isLoading = false,
  className,
  variant = 'default'
}: MessageListProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');

  // 按日期分组的消息
  const groupedMessages = useMemo(() => {
    const groups: Record<string, ChatMessage[]> = {};
    
    messages.forEach(message => {
      const date = new Date(message.createdAt).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });

    return Object.entries(groups).sort(([a], [b]) => 
      new Date(b).getTime() - new Date(a).getTime()
    );
  }, [messages]);

  // 滚动到顶部
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 监听滚动位置
  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loading text="正在加载消息..." variant="spinner" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <MessageCircle className="w-12 h-12 text-tch-text-secondary mb-4" />
          <h3 className="text-lg font-medium text-tch-text-primary mb-2">
            暂无消息
          </h3>
          <p className="text-tch-text-secondary text-center">
            成为第一个在思维交汇处留下印记的人吧！
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* 视图控制 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-tch-text-primary">
            共 {messages.length} 条消息
          </span>
          {messages.filter(m => m.isNew).length > 0 && (
            <Badge variant="success" className="text-xs">
              {messages.filter(m => m.isNew).length} 条新消息
            </Badge>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('cards')}
            className={cn(
              'px-3 py-1 rounded text-sm transition-colors',
              viewMode === 'cards' 
                ? 'bg-tch-primary text-white' 
                : 'text-tch-text-secondary hover:text-tch-text-primary'
            )}
          >
            卡片视图
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              'px-3 py-1 rounded text-sm transition-colors',
              viewMode === 'list' 
                ? 'bg-tch-primary text-white' 
                : 'text-tch-text-secondary hover:text-tch-text-primary'
            )}
          >
            列表视图
          </button>
        </div>
      </div>

      {/* 消息列表 */}
      <div className="space-y-6">
        {groupedMessages.map(([date, dayMessages]) => (
          <div key={date} className="space-y-3">
            {/* 日期标题 */}
            <div className="sticky top-0 z-10 bg-tch-bg-main/80 backdrop-blur-sm py-2">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-tch-text-secondary" />
                <span className="text-sm font-medium text-tch-text-primary">
                  {getDateLabel(date)}
                </span>
                <div className="flex items-center space-x-1 text-xs text-tch-text-secondary">
                  <Users className="w-3 h-3" />
                  <span>{new Set(dayMessages.map(m => m.author)).size} 人</span>
                  <MessageCircle className="w-3 h-3 ml-2" />
                  <span>{dayMessages.length} 条消息</span>
                </div>
              </div>
              <div className="w-full h-px bg-tch-border mt-2" />
            </div>

            {/* 消息项 */}
            <div className={cn(
              viewMode === 'cards' 
                ? 'grid grid-cols-1 md:grid-cols-2 gap-4' 
                : 'space-y-2'
            )}>
              {dayMessages.map((message) => 
                viewMode === 'cards' ? (
                  <MessageCard
                    key={message.id}
                    message={message}
                    onClick={() => onMessageClick?.(message)}
                  />
                ) : (
                  <CompactMessageCard
                    key={message.id}
                    message={message}
                    onClick={() => onMessageClick?.(message)}
                  />
                )
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 滚动到顶部按钮 */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 w-12 h-12 bg-tch-primary hover:bg-tch-accent text-white rounded-full shadow-lg transition-all duration-200 hover:scale-105 flex items-center justify-center"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

// 获取日期标签
function getDateLabel(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return '今天';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return '昨天';
  } else {
    return date.toLocaleDateString('zh-CN', {
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  }
}

// 空状态组件
interface MessageListEmptyProps {
  searchQuery?: string;
  filters?: any;
  onResetFilters?: () => void;
}

export function MessageListEmpty({ 
  searchQuery, 
  filters, 
  onResetFilters 
}: MessageListEmptyProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <MessageCircle className="w-16 h-16 text-tch-text-secondary mb-6" />
        <h3 className="text-xl font-medium text-tch-text-primary mb-2">
          {searchQuery || filters ? '未找到匹配的消息' : '暂无消息'}
        </h3>
        <p className="text-tch-text-secondary text-center mb-6 max-w-md">
          {searchQuery || filters 
            ? '试试调整搜索条件或筛选条件' 
            : '成为第一个在思维交汇处留下印记的人吧！'
          }
        </p>
        
        {(searchQuery || filters) && onResetFilters && (
          <button
            onClick={onResetFilters}
            className="text-tch-accent hover:text-tch-primary transition-colors underline"
          >
            重置搜索条件
          </button>
        )}
      </CardContent>
    </Card>
  );
}

// 消息加载状态
export function MessageListSkeleton() {
  return (
    <div className="space-y-4">
      {/* 骨架屏 */}
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-tch-bg-secondary rounded-full" />
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-tch-bg-secondary rounded w-24" />
                  <div className="h-4 bg-tch-bg-secondary rounded w-16" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-tch-bg-secondary rounded w-3/4" />
                  <div className="h-4 bg-tch-bg-secondary rounded w-1/2" />
                </div>
                <div className="flex space-x-2">
                  <div className="h-6 bg-tch-bg-secondary rounded-full w-16" />
                  <div className="h-6 bg-tch-bg-secondary rounded-full w-20" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// 虚拟化消息列表（用于大量消息）
interface VirtualizedMessageListProps {
  messages: ChatMessage[];
  onMessageClick?: (message: ChatMessage) => void;
  height?: number;
  className?: string;
}

export function VirtualizedMessageList({
  messages,
  onMessageClick,
  height = 600,
  className
}: VirtualizedMessageListProps) {
  // 这里可以实现虚拟滚动逻辑
  // 暂时使用普通列表作为后备
  return (
    <div 
      className={cn('overflow-y-auto scrollbar-thin', className)}
      style={{ height }}
    >
      <MessageList
        messages={messages}
        onMessageClick={onMessageClick}
        variant="compact"
      />
    </div>
  );
}