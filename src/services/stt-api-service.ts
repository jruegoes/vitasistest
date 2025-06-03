import { getValidToken } from '../api/auth';
import { ENDPOINTS } from '../config/api';
import type { PipelineStage, STTAPIService } from '../types/stt';

/**
 * Service for handling STT API operations
 */
class STTAPIServiceImpl implements STTAPIService {
  /**
   * Fetch pipeline stages from the API
   */
  async getPipelineStages(): Promise<PipelineStage[]> {
    const token = await getValidToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(ENDPOINTS.STT.PIPELINE_STAGES, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const stagesData = await response.json();
    return stagesData as PipelineStage[];
  }

  /**
   * Extract available ASR models that support online processing
   */
  async getAvailableModels(): Promise<string[]> {
    const stages = await this.getPipelineStages();
    
    const asrStage = stages.find(stage => stage.task === "ASR");
    if (!asrStage || !asrStage.configOptions) {
      return [];
    }

    const models = asrStage.configOptions
      .filter(option => option.features && option.features.includes("onlineAsr"))
      .map(option => option.tag);

    console.log("Available ASR models (supporting onlineAsr):", models);
    return models;
  }
}

// Export singleton instance
export const sttAPIService = new STTAPIServiceImpl();

// Export class for testing purposes
export { STTAPIServiceImpl }; 