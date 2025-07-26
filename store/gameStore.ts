import { create } from 'zustand';
import { User, Quest, Achievement, StoreItem } from '@/types/game';

interface GameState {
  user: User;
  currentQuest: Quest | null;
  availableQuests: Quest[];
  achievements: Achievement[];
  storeItems: StoreItem[];
  weeklyStats: Array<{ day: string; steps: number }>;
  updateStats: (steps: number, xp: number, calories: number) => void;
  startQuest: (questId: string) => void;
  purchaseItem: (itemId: string) => void;
}

const mockQuests: Quest[] = [
  {
    id: '1',
    name: 'Beach Run Challenge',
    description: 'Run 5km along the beautiful summer coastline and collect seashells along the way!',
    type: 'running',
    distance: 5,
    estimatedTime: '30 min',
    difficulty: 'Medium',
    xpReward: 150,
    coinReward: 25,
    requirements: 'Complete 3 walking quests first',
  },
  {
    id: '2',
    name: 'Sunrise Yoga Walk',
    description: 'Take a peaceful 3km morning walk and discover hidden yoga spots in the park.',
    type: 'walking',
    distance: 3,
    estimatedTime: '25 min',
    difficulty: 'Easy',
    xpReward: 75,
    coinReward: 15,
  },
  {
    id: '3',
    name: 'Mountain Bike Adventure',
    description: 'Cycle through challenging mountain trails and reach the summit viewpoint.',
    type: 'cycling',
    distance: 12,
    estimatedTime: '45 min',
    difficulty: 'Hard',
    xpReward: 250,
    coinReward: 40,
    requirements: 'Level 5+ required',
  },
  {
    id: '4',
    name: 'Urban Explorer',
    description: 'Walk through the city and discover 5 hidden street art locations.',
    type: 'walking',
    distance: 4,
    estimatedTime: '35 min',
    difficulty: 'Easy',
    xpReward: 100,
    coinReward: 20,
  },
  {
    id: '5',
    name: 'Forest Trail Run',
    description: 'Run through enchanted forest paths and spot local wildlife.',
    type: 'running',
    distance: 7,
    estimatedTime: '40 min',
    difficulty: 'Medium',
    xpReward: 180,
    coinReward: 30,
  },
];

const mockAchievements: Achievement[] = [
  {
    id: '1',
    name: 'Early Bird',
    description: 'Complete 5 morning workouts',
    type: 'streak',
    progress: 80,
  },
  {
    id: '2',
    name: 'Distance Master',
    description: 'Run 100km total',
    type: 'distance',
    progress: 65,
  },
  {
    id: '3',
    name: 'Quest Warrior',
    description: 'Complete 20 quests',
    type: 'quest',
    progress: 45,
  },
  {
    id: '4',
    name: 'Social Butterfly',
    description: 'Get 50 reactions on posts',
    type: 'social',
    progress: 30,
  },
];

const mockStoreItems: StoreItem[] = [
  {
    id: '1',
    name: 'Summer Runner',
    description: 'A vibrant summer-themed avatar with beach vibes',
    category: 'avatars',
    price: 150,
    currency: 'coins',
    icon: '🏃‍♂️',
    rarity: 'common',
    owned: false,
  },
  {
    id: '2',
    name: 'Sunset Cyclist',
    description: 'Cool cycling avatar with sunset colors',
    category: 'avatars',
    price: 250,
    currency: 'coins',
    icon: '🚴‍♀️',
    rarity: 'rare',
    owned: false,
  },
  {
    id: '3',
    name: 'Performance Shoes',
    description: 'Boost your running speed by 10%',
    category: 'gear',
    price: 300,
    currency: 'coins',
    icon: '👟',
    benefits: ['10% speed boost', 'Extra comfort', 'Stylish design'],
    owned: false,
  },
  {
    id: '4',
    name: 'Energy Drink',
    description: 'Restore energy instantly',
    category: 'gear',
    price: 50,
    currency: 'coins',
    icon: '🥤',
    benefits: ['Instant energy restore', 'Temporary stamina boost'],
    owned: false,
  },
  {
    id: '5',
    name: 'Gym Membership',
    description: '20% off local gym membership',
    category: 'coupons',
    price: 500,
    currency: 'coins',
    icon: '🏋️‍♂️',
    benefits: ['20% discount', 'Valid for 3 months'],
    owned: false,
  },
  {
    id: '6',
    name: 'Protein Shake',
    description: '15% off protein supplements',
    category: 'coupons',
    price: 200,
    currency: 'coins',
    icon: '🥛',
    benefits: ['15% discount', 'Valid at partner stores'],
    owned: false,
  },
  {
    id: '7',
    name: 'Golden Medal',
    description: 'Rare collectible NFT medal',
    category: 'nfts',
    price: 10000,
    currency: 'steps',
    icon: '🏅',
    rarity: 'epic',
    owned: false,
  },
  {
    id: '8',
    name: 'Summer Badge',
    description: 'Limited edition summer NFT badge',
    category: 'nfts',
    price: 15000,
    currency: 'steps',
    icon: '🌞',
    rarity: 'rare',
    owned: false,
  },
];

export const useGameStore = create<GameState>((set, get) => ({
  user: {
    id: '1',
    name: 'Alex',
    level: 12,
    xp: 2450,
    coins: 485,
    todaySteps: 8750,
    todayCalories: 1250,
    completedQuests: 18,
  },
  currentQuest: mockQuests[0],
  availableQuests: mockQuests,
  achievements: mockAchievements,
  storeItems: mockStoreItems,
  weeklyStats: [
    { day: 'Mon', steps: 12500 },
    { day: 'Tue', steps: 8200 },
    { day: 'Wed', steps: 15000 },
    { day: 'Thu', steps: 9800 },
    { day: 'Fri', steps: 11200 },
    { day: 'Sat', steps: 14500 },
    { day: 'Sun', steps: 8750 },
  ],
  
  updateStats: (steps, xp, calories) => {
    set((state) => ({
      user: {
        ...state.user,
        todaySteps: state.user.todaySteps + steps,
        xp: state.user.xp + xp,
        todayCalories: state.user.todayCalories + calories,
        coins: state.user.coins + Math.floor(xp / 10), // 1 coin per 10 XP
        level: Math.floor((state.user.xp + xp) / 1000) + 1,
      },
    }));
  },
  
  startQuest: (questId) => {
    const quest = get().availableQuests.find(q => q.id === questId);
    if (quest) {
      set({ currentQuest: quest });
    }
  },
  
  purchaseItem: (itemId) => {
    const { user, storeItems } = get();
    const item = storeItems.find(i => i.id === itemId);
    
    if (item && !item.owned) {
      const canAfford = item.currency === 'coins' 
        ? user.coins >= item.price 
        : user.todaySteps >= item.price;
      
      if (canAfford) {
        set((state) => ({
          user: {
            ...state.user,
            coins: item.currency === 'coins' 
              ? state.user.coins - item.price 
              : state.user.coins,
          },
          storeItems: state.storeItems.map(i => 
            i.id === itemId ? { ...i, owned: true } : i
          ),
        }));
      }
    }
  },
}));