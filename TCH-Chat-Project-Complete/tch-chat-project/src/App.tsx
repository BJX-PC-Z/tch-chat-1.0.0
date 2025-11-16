import React, { useEffect } from 'react';
import { Header } from './components/Header';
import { MessageList } from './components/MessageList';
import { MessageForm } from './components/MessageForm';
import { MessageFilters } from './components/MessageFilters';
import { StatusIndicator } from './components/StatusIndicator';
import { Loading } from './components/ui/loading';
import { DismissibleAlert } from './components/ui/alert';
import { useAppState } from './hooks/useAppState';
import { useMessages } from './hooks/useMessages';
import { useRealtimeConnection } from './hooks/useRealtimeConnection';
import { useTheme } from './hooks/useTheme';
import { chatService } from './services/chat';
import { getErrorMessage } from './utils';
import './index.css';

function App() {
  const {
    state,
    settings,
    syncMessages,
    setApiKey,
    setRepository,
    updateSyncSettings,
    clearError,
    validateConnection
  } = useAppState();

  const {
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
    getStats
  } = useMessages(state.messages);

  const {
    connectionStatus,
    lastPing,
    reconnectAttempts,
    reconnect,
    forceReconnect,
    getConnectionLatency,
    isConnectionHealthy
  } = useRealtimeConnection(state.isConnected);

  const { theme, toggleTheme, getEffectiveTheme, isDark } = useTheme();

  // 组件挂载时验证连接
  useEffect(() => {
    validateConnection();
  }, [validateConnection]);

  // 处理消息发送
  const handleSendMessage = async (formData: { title: string; content: string; tags: string[] }) => {
    try {
      const success = await sendMessage(formData);
      if (success) {
        // 消息发送成功后同步一次
        setTimeout(() => syncMessages(), 1000);
      }
      return success;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  // 处理重连
  const handleReconnect = () => {
    forceReconnect();
  };

  // 过滤后的消息
  const filteredMessages = filteredAndSortedMessages();
  const stats = getStats();

  return (
    <div className={`min-h-screen ${isDark() ? 'dark' : ''}`}>
      <div className="gradient-bg min-h-screen">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* 头部 */}
          <Header
            theme={theme}
            onThemeToggle={toggleTheme}
            repository={state.repository}
            onRepositoryChange={setRepository}
            apiKey={settings.apiKey}
            onApiKeyChange={setApiKey}
          />

          {/* 状态指示器 */}
          <div className="mb-6">
            <StatusIndicator
              isConnected={state.isConnected}
              connectionStatus={connectionStatus}
              lastSyncTime={state.lastSyncTime}
              totalMessages={stats.total}
              activeUsers={stats.uniqueAuthors}
              newMessages={state.messages.filter(m => m.isNew).length}
              lastActivity={state.messages.length > 0 ? state.messages[0].createdAt : '无活动'}
              onReconnect={handleReconnect}
            />
          </div>

          {/* 错误提示 */}
          {state.error && (
            <div className="mb-6">
              <DismissibleAlert
                variant="destructive"
                title="连接错误"
                description={state.error}
                onDismiss={clearError}
              />
            </div>
          )}

          {/* 连接警告 */}
          {connectionStatus === 'disconnected' && (
            <div className="mb-6">
              <DismissibleAlert
                variant="warning"
                title="连接已断开"
                description="正在尝试重新连接，或者检查网络连接..."
                onDismiss={clearError}
              />
            </div>
          )}

          {/* 主要内容区域 */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* 侧边栏 - 消息表单和筛选器 */}
            <div className="lg:col-span-1 space-y-6">
              {/* 消息发送表单 */}
              <div className="sticky top-6">
                <MessageForm
                  onSubmit={handleSendMessage}
                  isLoading={isSending}
                  existingTags={getAvailableTags()}
                />
              </div>

              {/* 筛选器 */}
              <MessageFilters
                searchQuery={searchQuery}
                onSearchChange={searchMessages}
                filters={filters}
                onFiltersChange={updateFilters}
                sortBy={sortBy}
                onSortChange={setSortBy}
                availableAuthors={getAvailableAuthors()}
                availableTags={getAvailableTags()}
              />
            </div>

            {/* 主内容区域 - 消息列表 */}
            <div className="lg:col-span-3">
              <div className="space-y-4">
                {/* 消息统计 */}
                <div className="bg-tch-bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-tch-border/50">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-tch-primary">{stats.total}</div>
                      <div className="text-sm text-tch-text-secondary">总消息</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-tch-accent">{stats.uniqueAuthors}</div>
                      <div className="text-sm text-tch-text-secondary">活跃用户</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-500">{stats.withComments}</div>
                      <div className="text-sm text-tch-text-secondary">有回复</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-tch-secondary">{stats.responseRate}%</div>
                      <div className="text-sm text-tch-text-secondary">回复率</div>
                    </div>
                  </div>
                </div>

                {/* 消息列表 */}
                {state.isLoading ? (
                  <div className="text-center py-12">
                    <Loading text="正在加载消息..." variant="spinner" />
                  </div>
                ) : filteredMessages.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-tch-text-secondary">
                      {searchQuery || Object.keys(filters).some(key => filters[key as keyof typeof filters]) 
                        ? '没有找到匹配的消息' 
                        : '暂无消息，成为第一个发声者吧！'
                      }
                    </div>
                  </div>
                ) : (
                  <MessageList
                    messages={filteredMessages}
                    onMessageClick={(message) => {
                      // 在实际应用中，这里可以打开消息详情
                      window.open(message.html_url, '_blank');
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;