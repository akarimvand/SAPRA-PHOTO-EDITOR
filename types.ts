
// Define types for prompt data structure
export interface PromptOption {
  value: string;
  label: string;
  tags?: string[]; // Add optional tags for filtering
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
  hairStyles: PromptOption[]; // New field
  makeup: PromptOption[]; // New field
  accessories: PromptOption[]; // New field
  facialExpressions: PromptOption[]; // New field
}
