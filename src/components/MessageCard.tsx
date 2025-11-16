import React from 'react';
import { formatRelativeTime, truncateText, cn } from '@/utils';
import { ChatMessage } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, User, Clock, Hash } from 'lucide-react';

interface MessageCardProps {
  message: ChatMessage;
  className?: string;
  onClick?: () => void;
}

export function MessageCard({ message, className, onClick }: MessageCardProps) {
  const isNew = message.isNew;
  const hasComments = message.comments > 0;

  return (
    <Card 
      className={cn(
        'transition-all duration-200 hover:shadow-md cursor-pointer group',
        isNew && 'ring-2 ring-tch-accent ring-opacity-50 bg-gradient-to-r from-tch-accent/5 to-transparent',
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div className="relative">
              <img
                src={message.authorAvatar}
                alt={message.author}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-white dark:ring-gray-700"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(message.author)}&background=random&color=fff`;
                }}
              />
              {isNew && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-tch-accent rounded-full animate-pulse" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-sm text-tch-text-primary truncate">
                  {message.author}
                </span>
                <span className="text-xs text-tch-text-secondary">
                  {formatRelativeTime(message.createdAt)}
                </span>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <MessageCircle className="w-3 h-3 text-tch-text-secondary" />
                <span className="text-xs text-tch-text-secondary">
                  {message.comments} 条回复
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 ml-2">
            {hasComments && (
              <Badge variant="info" className="text-xs">
                <MessageCircle className="w-3 h-3 mr-1" />
                已回复
              </Badge>
            )}
            {isNew && (
              <Badge variant="success" className="text-xs">
                新消息
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <h3 className="font-semibold text-tch-text-primary mb-2 line-clamp-2 group-hover:text-tch-accent transition-colors">
          {message.title}
        </h3>
        
        {message.body && (
          <p className="text-sm text-tch-text-secondary mb-3 line-clamp-3">
            {truncateText(message.body, 150)}
          </p>
        )}

        {message.labels.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {message.labels.slice(0, 3).map((label) => (
              <Badge
                key={label.name}
                variant="secondary"
                className="text-xs"
                style={{
                  backgroundColor: `#${label.color}`,
                  color: '#ffffff',
                  fontWeight: '500'
                }}
              >
                <Hash className="w-3 h-3 mr-1" />
                {label.name}
              </Badge>
            ))}
            {message.labels.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{message.labels.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// 紧凑版消息卡片
export function CompactMessageCard({ message, className, onClick }: MessageCardProps) {
  return (
    <Card 
      className={cn(
        'transition-all duration-200 hover:shadow-sm cursor-pointer',
        message.isNew && 'border-tch-accent bg-tch-accent/5',
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-3">
        <div className="flex items-center space-x-3">
          <img
            src={message.authorAvatar}
            alt={message.author}
            className="w-6 h-6 rounded-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(message.author)}&background=random&color=fff`;
            }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-tch-text-primary truncate">
                {message.title}
              </span>
              <div className="flex items-center space-x-2 ml-2">
                <span className="text-xs text-tch-text-secondary">
                  {formatRelativeTime(message.createdAt)}
                </span>
                {message.comments > 0 && (
                  <MessageCircle className="w-3 h-3 text-tch-accent" />
                )}
              </div>
            </div>
            <div className="flex items-center mt-1">
              <User className="w-3 h-3 text-tch-text-secondary mr-1" />
              <span className="text-xs text-tch-text-secondary mr-2">
                {message.author}
              </span>
              <Clock className="w-3 h-3 text-tch-text-secondary mr-1" />
              <span className="text-xs text-tch-text-secondary">
                {message.comments} 回复
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}