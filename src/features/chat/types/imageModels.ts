import { RouteSel } from "./models";

export interface MultiImageResponse {
  id: string;
  object: string;
  created: number;
  results: SingleUnifiedImageResponse[];
}

export interface SingleUnifiedImageResponse {
  id: string;
  provider: string;
  model: string;
  created: number;
  text: string;
  image_data: ImageResult[];
  usage: UsageMetadata | null;
  error: ResponseError | null;
  output_background?: string | null;
  output_format?: string | null;
  output_quality?: string | null;
  output_size_used?: string | null;
}

export interface ImageResult {
  url?: string | null;
  base64_data?: string | null;
  size?: string | null;
  error?: ResponseError | null;
}

export interface UsageMetadata {
  generated_image_count?: number | null;
  input_tokens?: number | null;
  output_tokens?: number | null;
  total_tokens?: number | null;
  image_tokens?: number | null;
  text_tokens?: number | null;
}

export interface ResponseError {
  code?: string | null;
  message?: string | null;
  block_reason?: string | null;
  safety_ratings?: SafetyRating[] | null;
}

export interface SafetyRating {
  category: string;
  probability: string;
}


//Image Request Body


export interface ImageRequestBody {
  mode: string | null;
  routes: RouteSel[] | null;
  prompt: string;
  images: ImageInput[] | null;
  stream: boolean;
  provider_response: boolean;
  isImageGeneration?: boolean; // Add this flag
}

export type ImageInput = { type: string; mimeType: string; base64: string; fileName: string };
