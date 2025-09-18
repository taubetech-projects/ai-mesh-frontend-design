export interface AIModel {
  id: string
  name: string
  icon: string
}

export interface ModelProvider {
  id: string
  name: string
  models: AIModel[]
}

export interface ChatMessage {
  id: string
  content: string
  role: "user" | "assistant"
  modelId: string
  timestamp: Date
}

export interface ChatTab {
  id: string
  modelId: string
  messages: ChatMessage[]
  isActive: boolean
}
