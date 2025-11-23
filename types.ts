export enum ViewMode {
  SPLIT = 'SPLIT',
  CODE = 'CODE',
  PREVIEW = 'PREVIEW'
}

export interface GenerationState {
  isGenerating: boolean;
  error: string | null;
}

export type CodeUpdateHandler = (newCode: string) => void;