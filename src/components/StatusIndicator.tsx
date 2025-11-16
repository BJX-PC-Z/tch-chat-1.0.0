import React from 'react';
import { ConnectionStatus } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Wifi, 
  WifiOff, 
  Clock, 
  Users, 
  MessageCircle, 
  Activity,
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { formatRelativeTime, cn } from '@/utils';

interface StatusIndicatorProps {
  isConnected: boolean;
  connectionStatus: ConnectionStatus;
  lastSyncTime: Date | null;
  totalMessages: number;
  activeUsers: number;
  newMessages: number;
  lastActivity: string;
  onReconnect?: () => void;
  className?: string;
}

export function StatusIndicator({
  isConnected,
  connectionStatus,
  lastSyncTime,
  totalMessages,
  activeUsers,
  newMessages,
  lastActivity,
  onReconnect,
  className
}: StatusIndicatorProps) {
  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'success';
      case 'connecting':
        return 'info';
      case 'disconnected':
        return 'warning';
      case 'error':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return '已连接';
      case 'connecting':
        return '连接中...';
      case 'disconnected':
        return '已断开';
      case 'error':
        return '连接错误';
      default:
        return '未知状态';
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Wifi className="w-4 h-4" />;
      case 'connecting':
        return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'disconnected':
        return <WifiOff className="w-4 h-4" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <Card className={cn('w-full', className)}>
      <CardContent className="p-4">
        {/* 连接状态 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <Badge variant={getStatusColor() as any}>
              {getStatusText()}
            </Badge>
            {connectionStatus === 'error' && onReconnect && (
              <button
                onClick={onReconnect}
                className="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                重连
              </button>
            )}
          </div>
          
          {lastSyncTime && (
            <div className="flex items-center text-sm text-tch-text-secondary">
              <Clock className="w-4 h-4 mr-1" />
              {formatRelativeTime(lastSyncTime)}
            </div>
          )}
        </div>

        {/* 统计信息 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <MessageCircle className="w-5 h-5 text-tch-primary" />
            </div>
            <div className="text-2xl font-bold text-tch-text-primary">
              {totalMessages}
            </div>
            <div className="text-xs text-tch-text-secondary">
              总消息
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Users className="w-5 h-5 text-tch-accent" />
            </div>
            <div className="text-2xl font-bold text-tch-text-primary">
              {activeUsers}
            </div>
            <div className="text-xs text-tch-text-secondary">
              活跃用户
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Activity className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-tch-text-primary">
              {newMessages}
            </div>
            <div className="text-xs text-tch-text-secondary">
              新消息
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Clock className="w-5 h-5 text-tch-secondary" />
            </div>
            <div className="text-sm font-semibold text-tch-text-primary">
              {lastActivity}
            </div>
            <div className="text-xs text-tch-text-secondary">
              最后活动
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// 紧凑版状态指示器
interface CompactStatusProps {
  isConnected: boolean;
  connectionStatus: ConnectionStatus;
  lastSyncTime: Date | null;
  onReconnect?: () => void;
  className?: string;
}

export function CompactStatus({
  isConnected,
  connectionStatus,
  lastSyncTime,
  onReconnect,
  className
}: CompactStatusProps) {
  return (
    <div className={cn('flex items-center justify-between p-3 bg-tch-bg-card rounded-lg', className)}>
      <div className="flex items-center space-x-2">
        <div className={cn(
          'w-2 h-2 rounded-full',
          connectionStatus === 'connected' ? 'bg-green-500' : 
          connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' :
          'bg-red-500'
        )} />
        <span className="text-sm text-tch-text-primary">
          {connectionStatus === 'connected' ? '在线' : '离线'}
        </span>
        {lastSyncTime && (
          <span className="text-xs text-tch-text-secondary">
            • {formatRelativeTime(lastSyncTime)}
          </span>
        )}
      </div>

      {connectionStatus === 'error' && onReconnect && (
        <button
          onClick={onReconnect}
          className="text-xs text-blue-600 hover:text-blue-800 underline"
        >
          重连
        </button>
      )}
    </div>
  );
}

// 弹窗状态提示
interface StatusTooltipProps {
  isConnected: boolean;
  connectionStatus: ConnectionStatus;
  lastSyncTime: Date | null;
  totalMessages: number;
  activeUsers: number;
  newMessages: number;
}

export function StatusTooltip({
  isConnected,
  connectionStatus,
  lastSyncTime,
  totalMessages,
  activeUsers,
  newMessages
}: StatusTooltipProps) {
  return (
    <div className="space-y-2 text-sm">
      <div className="flex items-center space-x-2">
        <div className={cn(
          'w-2 h-2 rounded-full',
          isConnected ? 'bg-green-500' : 'bg-red-500'
        )} />
        <span className="font-medium">
          {isConnected ? '已连接' : '已断开'}
        </span>
      </div>
      
      {lastSyncTime && (
        <div className="text-xs text-tch-text-secondary">
          最后同步: {formatRelativeTime(lastSyncTime)}
        </div>
      )}
      
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-tch-border">
        <div className="text-center">
          <div className="font-semibold text-tch-primary">{totalMessages}</div>
          <div className="text-xs text-tch-text-secondary">消息</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-tch-accent">{activeUsers}</div>
          <div className="text-xs text-tch-text-secondary">用户</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-green-500">{newMessages}</div>
          <div className="text-xs text-tch-text-secondary">新消息</div>
        </div>
      </div>
    </div>
  );
}

// 连接健康度指示器
interface ConnectionHealthProps {
  connectionStatus: ConnectionStatus;
  latency?: number;
  lastPing?: Date | null;
  className?: string;
}

export function ConnectionHealth({
  connectionStatus,
  latency,
  lastPing,
  className
}: ConnectionHealthProps) {
  const getHealthColor = () => {
    if (connectionStatus !== 'connected') return 'red';
    if (latency === undefined || latency === null) return 'gray';
    if (latency < 100) return 'green';
    if (latency < 500) return 'yellow';
    return 'red';
  };

  const getHealthText = () => {
    if (connectionStatus !== 'connected') return '未连接';
    if (latency === undefined || latency === null) return '检测中';
    if (latency < 100) return '优秀';
    if (latency < 500) return '良好';
    return '较慢';
  };

  const color = getHealthColor();

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <div className={cn(
        'w-2 h-2 rounded-full',
        color === 'green' && 'bg-green-500',
        color === 'yellow' && 'bg-yellow-500',
        color === 'red' && 'bg-red-500',
        color === 'gray' && 'bg-gray-500'
      )} />
      <span className="text-xs text-tch-text-secondary">
        {getHealthText()}
      </span>
      {latency && (
        <span className="text-xs text-tch-text-secondary">
          {latency}ms
        </span>
      )}
    </div>
  );
}