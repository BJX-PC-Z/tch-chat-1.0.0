import React, { useState } from 'react';
import { Search, Filter, X, Calendar, User, MessageCircle, SortAsc, SortDesc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/utils';

interface FilterOptions {
  author: string;
  tags: string[];
  hasComments?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

interface MessageFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  sortBy: 'newest' | 'oldest' | 'popular';
  onSortChange: (sort: 'newest' | 'oldest' | 'popular') => void;
  availableAuthors: string[];
  availableTags: string[];
  className?: string;
}

export function MessageFilters({
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
  sortBy,
  onSortChange,
  availableAuthors,
  availableTags,
  className
}: MessageFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [tempFilters, setTempFilters] = useState<FilterOptions>(filters);

  // 应用筛选条件
  const applyFilters = () => {
    onFiltersChange(tempFilters);
    setShowAdvanced(false);
  };

  // 重置筛选条件
  const resetFilters = () => {
    const emptyFilters: FilterOptions = {
      author: '',
      tags: [],
      hasComments: undefined
    };
    setTempFilters(emptyFilters);
    onFiltersChange(emptyFilters);
    onSearchChange('');
  };

  // 切换作者筛选
  const toggleAuthor = (author: string) => {
    const newAuthor = tempFilters.author === author ? '' : author;
    setTempFilters(prev => ({ ...prev, author: newAuthor }));
  };

  // 切换标签筛选
  const toggleTag = (tag: string) => {
    const newTags = tempFilters.tags.includes(tag)
      ? tempFilters.tags.filter(t => t !== tag)
      : [...tempFilters.tags, tag];
    setTempFilters(prev => ({ ...prev, tags: newTags }));
  };

  // 切换评论筛选
  const toggleComments = () => {
    const newValue = tempFilters.hasComments === true 
      ? false 
      : tempFilters.hasComments === false 
        ? undefined 
        : true;
    setTempFilters(prev => ({ ...prev, hasComments: newValue }));
  };

  // 获取活跃筛选条件数量
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.author) count++;
    if (filters.tags.length > 0) count++;
    if (filters.hasComments !== undefined) count++;
    if (filters.dateRange) count++;
    return count;
  };

  const activeCount = getActiveFiltersCount();

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-tch-text-primary">
            筛选消息
          </h3>
          <div className="flex items-center space-x-2">
            {activeCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {activeCount} 个筛选条件
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <Filter className="w-4 h-4 mr-2" />
              {showAdvanced ? '收起' : '高级筛选'}
            </Button>
            {activeCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
              >
                <X className="w-4 h-4 mr-2" />
                清空
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 搜索框 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-tch-text-secondary" />
          <Input
            type="text"
            placeholder="搜索消息标题、内容或作者..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* 排序选项 */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-tch-text-primary">排序：</span>
          <div className="flex space-x-1">
            <Button
              variant={sortBy === 'newest' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onSortChange('newest')}
              className="text-xs"
            >
              <SortDesc className="w-3 h-3 mr-1" />
              最新
            </Button>
            <Button
              variant={sortBy === 'oldest' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onSortChange('oldest')}
              className="text-xs"
            >
              <SortAsc className="w-3 h-3 mr-1" />
              最旧
            </Button>
            <Button
              variant={sortBy === 'popular' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onSortChange('popular')}
              className="text-xs"
            >
              <MessageCircle className="w-3 h-3 mr-1" />
              热门
            </Button>
          </div>
        </div>

        {/* 快速筛选按钮 */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filters.hasComments === true ? 'default' : 'outline'}
            size="sm"
            onClick={toggleComments}
            className="text-xs"
          >
            <MessageCircle className="w-3 h-3 mr-1" />
            有回复
          </Button>
          <Button
            variant={filters.hasComments === false ? 'default' : 'outline'}
            size="sm"
            onClick={toggleComments}
            className="text-xs"
          >
            <MessageCircle className="w-3 h-3 mr-1" />
            无回复
          </Button>
        </div>

        {/* 高级筛选 */}
        {showAdvanced && (
          <div className="space-y-4 pt-4 border-t border-tch-border">
            {/* 作者筛选 */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-tch-text-primary">作者</h4>
              <div className="flex flex-wrap gap-2">
                {availableAuthors.slice(0, 10).map((author) => (
                  <Button
                    key={author}
                    variant={filters.author === author ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleAuthor(author)}
                    className="text-xs"
                  >
                    <User className="w-3 h-3 mr-1" />
                    {author}
                  </Button>
                ))}
              </div>
            </div>

            {/* 标签筛选 */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-tch-text-primary">标签</h4>
              <div className="flex flex-wrap gap-2">
                {availableTags.slice(0, 12).map((tag) => (
                  <Button
                    key={tag}
                    variant={filters.tags.includes(tag) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleTag(tag)}
                    className="text-xs"
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>

            {/* 应用按钮 */}
            <div className="flex justify-end pt-2">
              <Button onClick={applyFilters}>
                应用筛选条件
              </Button>
            </div>
          </div>
        )}

        {/* 当前筛选条件显示 */}
        {activeCount > 0 && (
          <div className="space-y-2 pt-4 border-t border-tch-border">
            <h4 className="text-sm font-medium text-tch-text-primary">当前筛选条件：</h4>
            <div className="flex flex-wrap gap-2">
              {filters.author && (
                <Badge variant="secondary">
                  <User className="w-3 h-3 mr-1" />
                  作者: {filters.author}
                </Badge>
              )}
              {filters.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
              {filters.hasComments !== undefined && (
                <Badge variant={filters.hasComments ? 'success' : 'warning'}>
                  <MessageCircle className="w-3 h-3 mr-1" />
                  {filters.hasComments ? '有回复' : '无回复'}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// 简单的筛选器（紧凑版）
interface SimpleFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: 'newest' | 'oldest' | 'popular';
  onSortChange: (sort: 'newest' | 'oldest' | 'popular') => void;
  className?: string;
}

export function SimpleFilters({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  className
}: SimpleFiltersProps) {
  return (
    <Card className={cn('w-full', className)}>
      <CardContent className="py-4">
        <div className="flex items-center space-x-4">
          {/* 搜索框 */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-tch-text-secondary" />
            <Input
              type="text"
              placeholder="搜索..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* 排序选项 */}
          <div className="flex space-x-1">
            <Button
              variant={sortBy === 'newest' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onSortChange('newest')}
              className="text-xs"
            >
              最新
            </Button>
            <Button
              variant={sortBy === 'popular' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onSortChange('popular')}
              className="text-xs"
            >
              热门
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}