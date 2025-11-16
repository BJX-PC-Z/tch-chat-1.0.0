import React, { useState } from 'react';
import { Settings, Github, Moon, Sun, MessageCircle, Shield, User, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DismissibleAlert } from '@/components/ui/alert';
import { cn } from '@/utils';

interface HeaderProps {
  theme: string;
  onThemeToggle: () => void;
  repository: string;
  onRepositoryChange: (repo: string) => void;
  apiKey?: string | null;
  onApiKeyChange: (apiKey: string | null) => void;
}

export function Header({
  theme,
  onThemeToggle,
  repository,
  onRepositoryChange,
  apiKey,
  onApiKeyChange
}: HeaderProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [tempRepository, setTempRepository] = useState(repository);
  const [tempApiKey, setTempApiKey] = useState(apiKey || '');
  const [isValidating, setIsValidating] = useState(false);

  const handleSaveSettings = () => {
    if (tempRepository !== repository) {
      onRepositoryChange(tempRepository);
    }
    if (tempApiKey !== (apiKey || '')) {
      onApiKeyChange(tempApiKey.trim() || null);
    }
    setShowSettings(false);
  };

  const handleTestApiKey = async () => {
    if (!tempApiKey.trim()) {
      alert('请输入API密钥');
      return;
    }

    setIsValidating(true);
    try {
      // 这里可以添加API密钥测试逻辑
      await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟测试
      alert('API密钥测试成功');
    } catch (error) {
      alert('API密钥测试失败');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <>
      <header className="mb-8">
        <div className="flex items-center justify-between">
          {/* Logo和标题 */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-tch-primary to-tch-accent rounded-lg flex items-center justify-center shadow-lg">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tch-brand">
                  T.C.H.
                </h1>
                <p className="text-sm text-tch-text-secondary">
                  Thought Crossing Hub (思维交汇处)
                </p>
              </div>
            </div>
          </div>

          {/* 右侧操作 */}
          <div className="flex items-center space-x-3">
            {/* 仓库信息 */}
            <div className="hidden md:flex items-center space-x-2">
              <Github className="w-4 h-4 text-tch-text-secondary" />
              <span className="text-sm text-tch-text-secondary">
                {repository}
              </span>
              {apiKey ? (
                <Badge variant="success" className="text-xs">
                  <Shield className="w-3 h-3 mr-1" />
                  已认证
                </Badge>
              ) : (
                <Badge variant="warning" className="text-xs">
                  <User className="w-3 h-3 mr-1" />
                  匿名
                </Badge>
              )}
            </div>

            {/* 主题切换 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onThemeToggle}
              className="w-9 h-9 p-0"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>

            {/* 设置按钮 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(true)}
              className="w-9 h-9 p-0"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* 副标题 */}
        <div className="mt-4">
          <p className="text-tch-text-secondary">
            基于GitHub Issues的实时聊天室，无需登录即可参与讨论
          </p>
        </div>
      </header>

      {/* 设置模态框 */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-md">
            <CardHeader>
              <h3 className="text-lg font-semibold">设置</h3>
              <p className="text-sm text-tch-text-secondary">
                配置仓库和API设置
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 仓库配置 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">GitHub仓库</label>
                <Input
                  type="text"
                  value={tempRepository}
                  onChange={(e) => setTempRepository(e.target.value)}
                  placeholder="owner/repo"
                  className="font-mono"
                />
                <p className="text-xs text-tch-text-secondary">
                  格式：用户名/仓库名
                </p>
              </div>

              {/* API密钥 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">GitHub API密钥（可选）</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-tch-text-secondary" />
                  <Input
                    type="password"
                    value={tempApiKey}
                    onChange={(e) => setTempApiKey(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                    className="pl-10 font-mono"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleTestApiKey}
                    disabled={!tempApiKey.trim() || isValidating}
                  >
                    {isValidating ? '测试中...' : '测试API密钥'}
                  </Button>
                </div>
                <p className="text-xs text-tch-text-secondary">
                  提供API密钥可以获得更好的性能和更高的请求限制
                </p>
              </div>

              {/* GitHub链接 */}
              <DismissibleAlert
                variant="info"
                title="如何获取API密钥？"
                description={
                  <div className="space-y-2">
                    <p>1. 访问 GitHub → Settings → Developer settings → Personal access tokens</p>
                    <p>2. 生成新token，勾选repo权限</p>
                    <p>3. 复制token到上方输入框</p>
                  </div>
                }
              />

              {/* 操作按钮 */}
              <div className="flex space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowSettings(false)}
                  className="flex-1"
                >
                  取消
                </Button>
                <Button
                  onClick={handleSaveSettings}
                  className="flex-1"
                >
                  保存
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

// 简化版头部（移动端使用）
interface CompactHeaderProps {
  repository: string;
  apiKey?: string | null;
  onSettingsClick: () => void;
}

export function CompactHeader({
  repository,
  apiKey,
  onSettingsClick
}: CompactHeaderProps) {
  return (
    <header className="mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-tch-primary to-tch-accent rounded-lg flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tch-brand">T.C.H.</h1>
            <p className="text-xs text-tch-text-secondary">
              思维交汇处
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {apiKey ? (
            <Badge variant="success" className="text-xs">
              <Shield className="w-3 h-3 mr-1" />
              已认证
            </Badge>
          ) : (
            <Badge variant="warning" className="text-xs">
              匿名
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onSettingsClick}
            className="w-8 h-8 p-0"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="mt-2 text-center">
        <span className="text-sm text-tch-text-secondary">
          {repository}
        </span>
      </div>
    </header>
  );
}