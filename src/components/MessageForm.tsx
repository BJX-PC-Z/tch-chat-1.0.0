import React, { useState, useRef, useEffect } from 'react';
import { Send, Hash, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { MessageForm } from '@/types';
import { cn } from '@/utils';

interface MessageFormProps {
  onSubmit: (data: MessageForm) => Promise<boolean>;
  isLoading?: boolean;
  className?: string;
  placeholder?: string;
  onCancel?: () => void;
  existingTags?: string[];
}

export function MessageInputForm({
  onSubmit,
  isLoading = false,
  className,
  placeholder = "分享你的想法...",
  onCancel,
  existingTags = []
}: MessageFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({});

  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);

  // 自动聚焦到标题输入框
  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  // 添加标签
  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
    }
    setTagInput('');
    tagInputRef.current?.focus();
  };

  // 移除标签
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // 处理标签输入
  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      // 删除最后一个标签
      removeTag(tags[tags.length - 1]);
    }
  };

  // 表单验证
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!title.trim()) {
      newErrors.title = '请输入消息标题';
    } else if (title.trim().length < 3) {
      newErrors.title = '标题至少需要3个字符';
    } else if (title.trim().length > 100) {
      newErrors.title = '标题不能超过100个字符';
    }

    if (!content.trim()) {
      newErrors.content = '请输入消息内容';
    } else if (content.trim().length < 10) {
      newErrors.content = '内容至少需要10个字符';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const success = await onSubmit({
      title: title.trim(),
      content: content.trim(),
      tags
    });

    if (success) {
      // 清空表单
      setTitle('');
      setContent('');
      setTags([]);
      setErrors({});
      titleRef.current?.focus();
    }
  };

  // 取消操作
  const handleCancel = () => {
    setTitle('');
    setContent('');
    setTags([]);
    setErrors({});
    onCancel?.();
  };

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="pb-3">
        <h3 className="text-lg font-semibold text-tch-text-primary">
          发送新消息
        </h3>
        <p className="text-sm text-tch-text-secondary">
          分享你的想法，在思维交汇处留下印记
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 标题输入 */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-tch-text-primary">
              标题 <span className="text-red-500">*</span>
            </label>
            <Input
              ref={titleRef}
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="请输入一个吸引人的标题..."
              className={cn(
                'transition-all',
                errors.title && 'border-red-500 focus-visible:ring-red-500'
              )}
              maxLength={100}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
            <p className="text-xs text-tch-text-secondary">
              {title.length}/100 字符
            </p>
          </div>

          {/* 内容输入 */}
          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium text-tch-text-primary">
              内容 <span className="text-red-500">*</span>
            </label>
            <Textarea
              ref={contentRef}
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={placeholder}
              className={cn(
                'min-h-[120px] resize-none transition-all',
                errors.content && 'border-red-500 focus-visible:ring-red-500'
              )}
              maxLength={2000}
            />
            {errors.content && (
              <p className="text-sm text-red-500">{errors.content}</p>
            )}
            <p className="text-xs text-tch-text-secondary">
              {content.length}/2000 字符
            </p>
          </div>

          {/* 标签输入 */}
          <div className="space-y-2">
            <label htmlFor="tags" className="text-sm font-medium text-tch-text-primary">
              标签
            </label>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 px-3 py-2 border rounded-md bg-background focus-within:ring-2 focus-within:ring-tch-accent flex-1">
                <Hash className="w-4 h-4 text-tch-text-secondary" />
                <Input
                  ref={tagInputRef}
                  id="tags"
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  placeholder="添加标签 (回车确认)"
                  className="border-0 bg-transparent p-0 h-auto focus-visible:ring-0"
                />
              </div>
            </div>

            {/* 已添加的标签 */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer hover:bg-red-100 hover:text-red-700 transition-colors"
                    onClick={() => removeTag(tag)}
                  >
                    <Hash className="w-3 h-3 mr-1" />
                    {tag}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}

            {/* 常用标签 */}
            {existingTags.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-tch-text-secondary">常用标签：</p>
                <div className="flex flex-wrap gap-1">
                  {existingTags.slice(0, 8).map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-xs cursor-pointer hover:bg-tch-accent hover:text-white transition-colors"
                      onClick={() => addTag(tag)}
                    >
                      <Hash className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center justify-end space-x-3 pt-2">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                取消
              </Button>
            )}
            <Button
              type="submit"
              disabled={isLoading || !title.trim() || !content.trim()}
              className="min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  发送中...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  发送消息
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// 快速消息输入（简洁版）
interface QuickMessageInputProps {
  onSubmit: (title: string, content: string) => Promise<boolean>;
  isLoading?: boolean;
  className?: string;
}

export function QuickMessageInput({
  onSubmit,
  isLoading = false,
  className
}: QuickMessageInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    // 简单的标题提取：取第一行或前50个字符
    const lines = message.split('\n');
    const title = lines[0].length > 50 
      ? lines[0].slice(0, 50) + '...' 
      : lines[0];
    const content = message;

    const success = await onSubmit(title, content);
    if (success) {
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn('flex gap-2', className)}>
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="快速分享你的想法..."
        className="flex-1 resize-none"
        rows={2}
        disabled={isLoading}
      />
      <Button
        type="submit"
        disabled={!message.trim() || isLoading}
        className="self-end"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
      </Button>
    </form>
  );
}