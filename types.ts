
// Define types for prompt data structure
export interface PromptOption {
  value: string;
  label: string;
}

export interface ClothingOption extends PromptOption {
  gender: 'male' | 'female' | 'unisex' | 'child';
}

export interface PromptData {
  presets: PromptOption[];
  framing: PromptOption[];
  gender: PromptOption[];
  ageGroup: PromptOption[];
  clothing: ClothingOption[];
  backgrounds: PromptOption[];
  lighting: PromptOption[];
  cameras: PromptOption[];
  styles: PromptOption[];
  propsObjects: PromptOption[];
  photoSubject: PromptOption[]; // New field for single/group photo
}
