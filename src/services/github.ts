import { GitHubIssue, GitHubComment, ApiResponse } from '@/types';
import { getErrorMessage } from '@/utils';

const GITHUB_API_BASE = 'https://api.github.com';
const DEFAULT_HEADERS = {
  'Accept': 'application/vnd.github.v3+json',
  'Content-Type': 'application/json',
};

class GitHubService {
  private apiKey: string | null = null;

  setApiKey(key: string): void {
    this.apiKey = key;
  }

  clearApiKey(): void {
    this.apiKey = null;
  }

  private getHeaders(): Record<string, string> {
    const headers = { ...DEFAULT_HEADERS };
    if (this.apiKey) {
      headers['Authorization'] = `token ${this.apiKey}`;
    }
    return headers;
  }

  private async makeRequest<T>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`GitHub API错误: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error),
      };
    }
  }

  // 获取仓库信息
  async getRepository(owner: string, repo: string) {
    return this.makeRequest(`${GITHUB_API_BASE}/repos/${owner}/${repo}`);
  }

  // 获取Issues列表
  async getIssues(owner: string, repo: string, options: {
    state?: 'open' | 'closed' | 'all';
    labels?: string;
    since?: string;
    per_page?: number;
    page?: number;
  } = {}): Promise<ApiResponse<GitHubIssue[]>> {
    const params = new URLSearchParams();
    
    if (options.state) params.append('state', options.state);
    if (options.labels) params.append('labels', options.labels);
    if (options.since) params.append('since', options.since);
    if (options.per_page) params.append('per_page', options.per_page.toString());
    if (options.page) params.append('page', options.page.toString());

    const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/issues?${params.toString()}`;
    return this.makeRequest<GitHubIssue[]>(url);
  }

  // 创建Issue
  async createIssue(owner: string, repo: string, issue: {
    title: string;
    body?: string;
    labels?: string[];
    assignees?: string[];
  }): Promise<ApiResponse<GitHubIssue>> {
    const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/issues`;
    return this.makeRequest<GitHubIssue>(url, {
      method: 'POST',
      body: JSON.stringify(issue),
    });
  }

  // 更新Issue
  async updateIssue(owner: string, repo: string, issueNumber: number, updates: {
    title?: string;
    body?: string;
    state?: 'open' | 'closed';
    labels?: string[];
    assignees?: string[];
  }): Promise<ApiResponse<GitHubIssue>> {
    const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/issues/${issueNumber}`;
    return this.makeRequest<GitHubIssue>(url, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  // 获取Issue评论
  async getIssueComments(owner: string, repo: string, issueNumber: number, options: {
    since?: string;
    per_page?: number;
    page?: number;
  } = {}): Promise<ApiResponse<GitHubComment[]>> {
    const params = new URLSearchParams();
    
    if (options.since) params.append('since', options.since);
    if (options.per_page) params.append('per_page', options.per_page.toString());
    if (options.page) params.append('page', options.page.toString());

    const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/issues/${issueNumber}/comments?${params.toString()}`;
    return this.makeRequest<GitHubComment[]>(url);
  }

  // 创建评论
  async createComment(owner: string, repo: string, issueNumber: number, body: string): Promise<ApiResponse<GitHubComment>> {
    const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/issues/${issueNumber}/comments`;
    return this.makeRequest<GitHubComment>(url, {
      method: 'POST',
      body: JSON.stringify({ body }),
    });
  }

  // 更新评论
  async updateComment(owner: string, repo: string, commentId: number, body: string): Promise<ApiResponse<GitHubComment>> {
    const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/issues/comments/${commentId}`;
    return this.makeRequest<GitHubComment>(url, {
      method: 'PATCH',
      body: JSON.stringify({ body }),
    });
  }

  // 获取仓库标签
  async getLabels(owner: string, repo: string): Promise<ApiResponse<Array<{
    id: number;
    name: string;
    color: string;
    description: string;
    default: boolean;
  }>>> {
    const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/labels`;
    return this.makeRequest(url);
  }

  // 创建标签
  async createLabel(owner: string, repo: string, label: {
    name: string;
    color: string;
    description?: string;
  }): Promise<ApiResponse<any>> {
    const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/labels`;
    return this.makeRequest(url, {
      method: 'POST',
      body: JSON.stringify(label),
    });
  }

  // 获取用户信息
  async getUser(username: string) {
    return this.makeRequest(`${GITHUB_API_BASE}/users/${username}`);
  }

  // 搜索Issues
  async searchIssues(query: string, options: {
    sort?: 'created' | 'updated' | 'comments';
    order?: 'asc' | 'desc';
    per_page?: number;
    page?: number;
  } = {}): Promise<ApiResponse<{
    total_count: number;
    items: GitHubIssue[];
  }>> {
    const params = new URLSearchParams();
    params.append('q', query);
    
    if (options.sort) params.append('sort', options.sort);
    if (options.order) params.append('order', options.order);
    if (options.per_page) params.append('per_page', options.per_page.toString());
    if (options.page) params.append('page', options.page.toString());

    const url = `${GITHUB_API_BASE}/search/issues?${params.toString()}`;
    return this.makeRequest(url);
  }

  // 验证仓库权限
  async validateRepositoryAccess(owner: string, repo: string): Promise<{
    accessible: boolean;
    canRead: boolean;
    canWrite: boolean;
    error?: string;
  }> {
    try {
      // 首先尝试获取仓库信息
      const repoResult = await this.getRepository(owner, repo);
      if (!repoResult.success) {
        return {
          accessible: false,
          canRead: false,
          canWrite: false,
          error: repoResult.error,
        };
      }

      // 尝试获取Issues来验证读取权限
      const issuesResult = await this.getIssues(owner, repo, { per_page: 1 });
      if (!issuesResult.success) {
        return {
          accessible: true,
          canRead: false,
          canWrite: false,
          error: issuesResult.error,
        };
      }

      // 尝试创建Issues来验证写入权限（这里用创建issue测试）
      const testResult = await this.createIssue(owner, repo, {
        title: '权限测试',
        body: '这是一个权限测试消息，会被自动删除',
        labels: ['test'],
      });

      // 如果能创建issue，说明有写入权限，然后删除它
      if (testResult.success && testResult.data) {
        // 关闭测试issue
        await this.updateIssue(owner, repo, testResult.data.number, { state: 'closed' });
      }

      return {
        accessible: true,
        canRead: true,
        canWrite: testResult.success,
        error: testResult.success ? undefined : '无法创建Issues',
      };
    } catch (error) {
      return {
        accessible: false,
        canRead: false,
        canWrite: false,
        error: getErrorMessage(error),
      };
    }
  }
}

// 导出单例实例
export const githubService = new GitHubService();
export default githubService;