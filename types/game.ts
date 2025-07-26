export interface User {
  id: string;
  name: string;
  level: number;
  xp: number;
  coins: number;
  todaySteps: number;
  todayCalories: number;
  completedQuests: number;
}

export interface Quest {
  id: string;
  name: string;
  description: string;
  type: 'walking' | 'running' | 'cycling' | 'hiking';
  distance: number;
  estimatedTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  xpReward: number;
  coinReward: number;
  requirements?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  type: 'distance' | 'streak' | 'quest' | 'social';
  progress: number;
}

export interface StoreItem {
  id: string;
  name: string;
  description: string;
  category: 'avatars' | 'gear' | 'coupons' | 'nfts';
  price: number;
  currency: 'coins' | 'steps';
  icon: string;
  rarity?: 'common' | 'rare' | 'epic';
  benefits?: string[];
  owned: boolean;
}