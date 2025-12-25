
// --- Mock Data (Replace with your actual API calls) ---

const MOCK_PROVIDERS = [
  {
    id: 'deepseek',
    name: 'DeepSeek',
    icon: 'text-blue-500',
    isLocked: false,
    availableModels: [{ id: 'deepseek-chat', name: 'DeepSeek Chat' }, { id: 'deepseek-coder', name: 'DeepSeek Coder' }]
  },
  {
    id: 'openai',
    name: 'ChatGPT',
    icon: 'text-green-500',
    isLocked: false,
    availableModels: [{ id: 'gpt-5-mini', name: 'GPT-5 mini' }, { id: 'gpt-4', name: 'GPT-4' }]
  },
  {
    id: 'google',
    name: 'Gemini',
    icon: 'text-blue-400',
    isLocked: false,
    availableModels: [{ id: 'gemini-2.5-lite', name: 'Gemini 2.5 Lite' }, { id: 'gemini-pro', name: 'Gemini Pro' }]
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    icon: 'text-teal-400',
    isLocked: true,
    availableModels: [{ id: 'sonar', name: 'Perplexity Sonar' }]
  },
];

const MOCK_PREFS = [
  { providerId: 'deepseek', enabled: true, selectedModelId: 'deepseek-chat', order: 0 },
  { providerId: 'openai', enabled: true, selectedModelId: 'gpt-5-mini', order: 1 },
  { providerId: 'google', enabled: true, selectedModelId: 'gemini-2.5-lite', order: 2 },
  { providerId: 'perplexity', enabled: false, selectedModelId: 'sonar', order: 3 },
];

// --- API Functions ---

export const fetchModelSettings = async () => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  // Merge static provider data with user preferences
  // In a real app, your backend might return this combined view
  const combined = MOCK_PREFS.map(pref => {
    const provider = MOCK_PROVIDERS.find(p => p.id === pref.providerId);
    if (!provider) return null;
    return { ...provider, ...pref };
  }).filter(Boolean) as any[]; // Type casting for brevity

  return combined.sort((a, b) => a.order - b.order);
};

export const updateModelSettings = async (data: any[]) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("Saving to backend:", data);
  return { success: true };
};