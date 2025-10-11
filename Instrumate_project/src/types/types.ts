export interface AccessibilitySettings {
  fontSize: 'small' | 'medium' | 'large';
  highContrast: boolean;
  soundEnabled: boolean;
  motionReduced: boolean;
}

export interface SignDetectionStatus {
  isActive: boolean;
  handsDetected: boolean;
  translatedText: string;
  confidence: number;
}

export interface AvatarSettings {
  speed: number;
  showCaptions: boolean;
  repeatMode: boolean;
}