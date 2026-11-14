import { CanvasApiCourse, CanvasApiAssignment, CanvasApiAnnouncement } from '@/types';

export class GccCanvasClient {
  private baseUrl: string;
  private apiToken: string;

  constructor() {
    this.baseUrl = (process.env.CANVAS_BASE_URL || 'https://glendale.instructure.com').replace(/\/$/, '');
    this.apiToken = process.env.CANVAS_API_TOKEN || '';
  }

  public isConfigured(): boolean {
    return Boolean(this.apiToken && this.apiToken !== 'your_gcc_canvas_api_token_here');
  }

  private async fetchFromCanvas<T>(endpoint: string): Promise<T> {
    if (!this.isConfigured()) {
      throw new Error('CANVAS_API_TOKEN is not configured in environment variables');
    }

    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Accept': 'application/json',
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`GCC Canvas API request failed [HTTP ${response.status}]: ${errorText || response.statusText}`);
    }

    return response.json();
  }

  /**
   * Fetch all active courses for the student from GCC Canvas
   */
  async getActiveCourses(): Promise<CanvasApiCourse[]> {
    const endpoint = '/api/v1/courses?enrollment_state=active&include[]=teachers&include[]=total_scores&include[]=term&per_page=50';
    return this.fetchFromCanvas<CanvasApiCourse[]>(endpoint);
  }

  /**
   * Fetch all assignments for a specific GCC Canvas course
   */
  async getCourseAssignments(courseId: number): Promise<CanvasApiAssignment[]> {
    const endpoint = `/api/v1/courses/${courseId}/assignments?include[]=submission&per_page=100`;
    return this.fetchFromCanvas<CanvasApiAssignment[]>(endpoint);
  }

  /**
   * Fetch latest announcements for active courses
   */
  async getAnnouncements(courseCanvasIds: number[]): Promise<CanvasApiAnnouncement[]> {
    if (courseCanvasIds.length === 0) return [];
    const contextCodes = courseCanvasIds.map(id => `context_codes[]=course_${id}`).join('&');
    const endpoint = `/api/v1/announcements?${contextCodes}&per_page=20`;
    return this.fetchFromCanvas<CanvasApiAnnouncement[]>(endpoint);
  }
}

export const gccCanvasClient = new GccCanvasClient();
