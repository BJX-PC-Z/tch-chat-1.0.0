import { useState, useCallback } from 'react';
import { ChatMessage, MessageForm } from '@/types';
import { chatService } from '@/services/chat';
import { getErrorMessage } from '@/utils';

export function useMessages(messages: ChatMessage[]) {
  const [isSending, setIsSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    author: '',
    tags: [] as string[],
    hasComments: undefined as boolean | undefined,
  });
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest');

  // 发送新消息
  const sendMessage = useCallback(async (formData: MessageForm): Promise<boolean> => {
    if (isSending) return false;

    setIsSending(true);
    
    try {
      const result = await chatService.sendMessage(
        formData.title,
        formData.content,
        formData.tags
      );

      if (result.success) {
        return true;
      } else {
        throw new Error(result.error || '发送失败');
      }
    } catch (error) {
      throw new Error(getErrorMessage(error));
    } finally {
      setIsSending(false);
    }
  }, [isSending]);

  // 搜索消息
  const searchMessages = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // 应用过滤和排序
  const filteredAndSortedMessages = useCallback(() => {
    let filtered = messages;

    // 搜索过滤
    if (searchQuery.trim()) {
      filtered = chatService.searchMessages(filtered, searchQuery);
    }

    // 其他过滤
    filtered = chatService.filterMessages(filtered, filters);

    // 排序
    switch (sortBy) {
      case 'oldest':
        return [...filtered].sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case 'popular':
        return [...filtered].sort((a, b) => b.comments - a.comments);
      case 'newest':
      default:
        return [...filtered].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  }, [messages, searchQuery, filters, sortBy]);

  // 更新过滤条件
  const updateFilters = useCallback((newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // 重置过滤条件
  const resetFilters = useCallback(() => {
    setFilters({
      author: '',
      tags: [],
      hasComments: undefined,
    });
    setSearchQuery('');
  }, []);

  // 获取可用作者列表
  const getAvailableAuthors = useCallback(() => {
    return [...new Set(messages.map(message => message.author))].sort();
  }, [messages]);

  // 获取可用标签列表
  const getAvailableTags = useCallback(() => {
    const allTags = messages.flatMap(message => message.labels.map(label => label.name));
    return [...new Set(allTags)].sort();
  }, [messages]);

  // 获取统计信息
  const getStats = useCallback(() => {
    const total = messages.length;
    const withComments = messages.filter(message => message.comments > 0).length;
    const uniqueAuthors = new Set(messages.map(message => message.author)).size;
    
    return {
      total,
      withComments,
      uniqueAuthors,
      responseRate: total > 0 ? Math.round((withComments / total) * 100) : 0,
    };
  }, [messages]);

  return {
    isSending,
    searchQuery,
    filters,
    sortBy,
    sendMessage,
    searchMessages,
    filteredAndSortedMessages,
    updateFilters,
    resetFilters,
    setSortBy,
    getAvailableAuthors,
    getAvailableTags,
    getStats,
  };
}