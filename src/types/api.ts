export interface GeminiResponsePart {
  text: string;
}

export interface GeminiResponseContent {
  parts: GeminiResponsePart[];
}

export interface GeminiResponseCandidate {
  content: GeminiResponseContent;
  finishReason: string;
  safetyRatings: any[];
}

export interface GeminiResponse {
  candidates: GeminiResponseCandidate[];
  promptFeedback: any;
}

export interface GeminiRequestPart {
  text?: string;
  inline_data?: {
    mime_type: string;
    data: string;
  };
}

export interface GeminiRequestContent {
  parts: GeminiRequestPart[];
}

export interface GeminiRequest {
  contents: GeminiRequestContent[];
}
