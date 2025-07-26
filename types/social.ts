export interface SocialPost {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  content: string;
  image?: string;
  location: string;
  activity: string;
  timestamp: number;
  stats: {
    distance: number;
    duration: string;
    calories: number;
  };
  sweatPoints: number;
  reactions: Record<string, number>;
  comments: Array<{
    user: string;
    text: string;
  }>;
}