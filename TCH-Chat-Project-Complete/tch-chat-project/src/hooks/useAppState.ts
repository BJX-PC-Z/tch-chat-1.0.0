import { useState, useEffect, useCallback } from 'react';
import { ChatMessage, AppState, SyncSettings } from '@/types';
import { chatService } from '@/services/chat';
import { githubService } from '@/services/github';
import { loadFromLocalStorage, saveToLocalStorage, debounce, getErrorMessage } from '@/utils';

export function useAppState() {
  const [state, setState] = useState<AppState>(() => {
    const savedSettings = loadFromLocalStorage('tch-settings', {
      repository: 'BJX-PC-Z/tch-chat',
      syncInterval: 30,
      autoSync: true,
      apiKey: null
    });

    return {
      isLoading: true,
      isConnected: false,
      error: null,
      messages: [],
      users: [],
      currentUser: null,
      repository: savedSettings.repository,
      lastSyncTime: null
    };
  });

  const [settings, setSettings] = useState<SyncSettings>(() => {
    const saved = loadFromLocalStorage('tch-settings', {
      syncInterval: 30,
      autoSync: true,
      apiKey: null
    });
    return {
      interval: saved.syncInterval * 1000, // 转换为毫秒
      enabled: true,
      autoSync: saved.autoSync
    };
  });

  // 初始化
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // 同步初始消息
      const result = await chatService.syncMessages();
      
      if (result.success) {
        setState(prev => ({
          ...prev,
          messages: result.data || [],
          isLoading: false,
          isConnected: true,
          lastSyncTime: new Date()
        }));

        // 启动自动同步
        if (settings.autoSync) {
          chatService.startAutoSync(settings.interval);
        }
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: result.error || '连接失败',
          isConnected: false
        }));
      }

      // 订阅聊天事件
      const unsubscribe = chatService.subscribe(handleChatEvent);
      
      return unsubscribe;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: getErrorMessage(error),
        isConnected: false
      }));
    }
  }, [settings.autoSync, settings.interval]);

  const handleChatEvent = useCallback((event) => {
    switch (event.type) {
      case 'message_added':
        setState(prev => ({
          ...prev,
          messages: [event.data, ...prev.messages]
        }));
        break;
      
      case 'sync_completed':
        setState(prev => ({
          ...prev,
          messages: event.data.messages,
          lastSyncTime: event.data.timestamp,
          isConnected: true,
          error: null
        }));
        break;
      
      case 'error':
        setState(prev => ({
          ...prev,
          error: event.data.message,
          isConnected: false
        }));
        break;
    }
  }, []);

  // 手动同步
  const syncMessages = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, error: null }));
      const result = await chatService.syncMessages();
      
      if (!result.success) {
        setState(prev => ({ ...prev, error: result.error || '同步失败' }));
        return false;
      }
      
      return true;
    } catch (error) {
      setState(prev => ({ ...prev, error: getErrorMessage(error) }));
      return false;
    }
  }, []);

  // 设置API密钥
  const setApiKey = useCallback((apiKey: string | null) => {
    if (apiKey) {
      chatService.setApiKey(apiKey);
      githubService.setApiKey(apiKey);
    } else {
      chatService.setApiKey('');
      githubService.clearApiKey();
    }

    // 保存到本地存储
    const currentSettings = loadFromLocalStorage('tch-settings', {});
    saveToLocalStorage('tch-settings', {
      ...currentSettings,
      apiKey
    });

    // 重新连接
    setTimeout(() => syncMessages(), 100);
  }, [syncMessages]);

  // 设置仓库配置
  const setRepository = useCallback((repository: string) => {
    const [owner, repo] = repository.split('/');
    chatService.setConfig({ owner, repo });
    
    setState(prev => ({ ...prev, repository }));
    
    // 保存设置
    const currentSettings = loadFromLocalStorage('tch-settings', {});
    saveToLocalStorage('tch-settings', {
      ...currentSettings,
      repository
    });

    // 重新连接
    syncMessages();
  }, [syncMessages]);

  // 更新同步设置
  const updateSyncSettings = useCallback((newSettings: Partial<SyncSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);

    // 更新自动同步
    if (updatedSettings.autoSync) {
      chatService.startAutoSync(updatedSettings.interval);
    } else {
      chatService.stopAutoSync();
    }

    // 保存设置
    const currentSettings = loadFromLocalStorage('tch-settings', {});
    saveToLocalStorage('tch-settings', {
      ...currentSettings,
      syncInterval: Math.floor(updatedSettings.interval / 1000),
      autoSync: updatedSettings.autoSync
    });
  }, [settings]);

  // 清除错误
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // 验证连接
  const validateConnection = useCallback(async () => {
    try {
      const result = await chatService.validateRepository();
      
      if (result.success) {
        const validation = result.data!;
        setState(prev => ({
          ...prev,
          isConnected: validation.accessible && validation.canRead,
          error: validation.error || null
        }));
        return validation;
      } else {
        setState(prev => ({
          ...prev,
          isConnected: false,
          error: result.error || '验证失败'
        }));
        return null;
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isConnected: false,
        error: getErrorMessage(error)
      }));
      return null;
    }
  }, []);

  return {
    state,
    settings,
    syncMessages,
    setApiKey,
    setRepository,
    updateSyncSettings,
    clearError,
    validateConnection,
    initializeApp
  };
}