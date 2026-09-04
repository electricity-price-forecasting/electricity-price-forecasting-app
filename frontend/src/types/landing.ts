export type CardType = 'small' | 'large';
export type PreviewType = 'icons' | 'chart' | 'list' | 'dashboard';

export interface FeatureCard {
  id: string;
  title: string;
  type: CardType;
  previewType: PreviewType;
}