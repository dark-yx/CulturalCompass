// Qloo API integration using the provided hackathon credentials
const QLOO_API_BASE = 'https://hackathon.api.qloo.com';
const QLOO_API_KEY = 'swv5EqnKP0W4bElCUZOJYCR9C1SMM7A20OeQLOGUJIo';

export interface QlooEntity {
  id: string;
  name: string;
  type: string;
  metadata?: Record<string, any>;
}

export interface QlooRecommendation {
  entity: QlooEntity;
  score: number;
  reasoning?: string;
}

export interface QlooSearchResult {
  entities: QlooEntity[];
  total: number;
}

export interface QlooDemographics {
  age_ranges: Array<{ range: string; percentage: number }>;
  genders: Array<{ gender: string; percentage: number }>;
  locations: Array<{ location: string; percentage: number }>;
}

class QlooAPI {
  private headers = {
    'X-API-Key': QLOO_API_KEY,
    'Content-Type': 'application/json',
  };

  async searchEntities(query: string, type?: string): Promise<QlooSearchResult> {
    try {
      const params = new URLSearchParams({
        q: query,
        ...(type && { type }),
      });

      const response = await fetch(`${QLOO_API_BASE}/v1/entities/search?${params}`, {
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error(`Qloo API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error searching Qloo entities:', error);
      throw error;
    }
  }

  async getRecommendations(entityIds: string[], options?: {
    count?: number;
    domain?: string;
  }): Promise<QlooRecommendation[]> {
    try {
      const response = await fetch(`${QLOO_API_BASE}/v1/recommendations`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          inputs: entityIds.map(id => ({ id, type: 'entity' })),
          count: options?.count || 10,
          ...(options?.domain && { domain: options.domain }),
        }),
      });

      if (!response.ok) {
        throw new Error(`Qloo API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.recommendations || [];
    } catch (error) {
      console.error('Error getting Qloo recommendations:', error);
      throw error;
    }
  }

  async getDemographics(entityId: string): Promise<QlooDemographics> {
    try {
      const response = await fetch(`${QLOO_API_BASE}/v1/demographics/${entityId}`, {
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error(`Qloo API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting Qloo demographics:', error);
      throw error;
    }
  }

  async getHeatmap(entityId: string, region?: string): Promise<any> {
    try {
      const params = new URLSearchParams({
        ...(region && { region }),
      });

      const response = await fetch(`${QLOO_API_BASE}/v1/heatmaps/${entityId}?${params}`, {
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error(`Qloo API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting Qloo heatmap:', error);
      throw error;
    }
  }

  async createSession(entityIds: string[]): Promise<{ sessionId: string }> {
    try {
      const response = await fetch(`${QLOO_API_BASE}/v1/sessions`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          inputs: entityIds.map(id => ({ id, type: 'entity' })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Qloo API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating Qloo session:', error);
      throw error;
    }
  }
}

export const qlooAPI = new QlooAPI();
