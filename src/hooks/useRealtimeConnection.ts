import { useState, useEffect, useCallback, useRef } from 'react';
import { chatService } from '@/services/chat';
import { ConnectionStatus } from '@/types';

export function useRealtimeConnection(isConnected: boolean) {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    isConnected ? 'connected' : 'disconnected'
  );
  const [lastPing, setLastPing] = useState<Date | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 模拟ping/pong机制
  const startPingPong = useCallback(() => {
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
    }

    pingIntervalRef.current = setInterval(() => {
      setLastPing(new Date());
      // 这里可以添加实际的ping逻辑
    }, 30000); // 每30秒ping一次
  }, []);

  const stopPingPong = useCallback(() => {
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
    }
    setLastPing(null);
  }, []);

  // 手动重连
  const reconnect = useCallback(async () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    setConnectionStatus('connecting');
    setReconnectAttempts(prev => prev + 1);

    try {
      const isValid = await chatService.validateRepository();
      
      if (isValid) {
        setConnectionStatus('connected');
        setReconnectAttempts(0);
        startPingPong();
        
        // 同步消息
        await chatService.syncMessages();
      } else {
        throw new Error('连接验证失败');
      }
    } catch (error) {
      setConnectionStatus('error');
      
      // 指数退避重连
      const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
      reconnectTimeoutRef.current = setTimeout(() => {
        reconnect();
      }, delay);
    }
  }, [reconnectAttempts]);

  // 连接状态变化处理
  useEffect(() => {
    if (isConnected) {
      if (connectionStatus === 'disconnected' || connectionStatus === 'error') {
        setConnectionStatus('connected');
        setReconnectAttempts(0);
      }
      startPingPong();
    } else {
      setConnectionStatus('disconnected');
      stopPingPong();
    }

    return () => {
      stopPingPong();
    };
  }, [isConnected, startPingPong, stopPingPong]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  // 获取连接延迟
  const getConnectionLatency = useCallback(() => {
    if (!lastPing) return null;
    
    // 这里可以返回实际的延迟值
    // 暂时返回模拟值
    return Math.floor(Math.random() * 200) + 50; // 50-250ms
  }, [lastPing]);

  // 强制重连
  const forceReconnect = useCallback(() => {
    setReconnectAttempts(0);
    reconnect();
  }, [reconnect]);

  // 检查连接健康状态
  const isConnectionHealthy = useCallback(() => {
    if (!lastPing) return false;
    
    const timeSinceLastPing = Date.now() - lastPing.getTime();
    return timeSinceLastPing < 60000; // 1分钟内认为健康
  }, [lastPing]);

  return {
    connectionStatus,
    lastPing,
    reconnectAttempts,
    reconnect,
    forceReconnect,
    getConnectionLatency,
    isConnectionHealthy,
  };
}