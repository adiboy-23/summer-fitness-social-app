import { create } from 'zustand';
import { SocialPost } from '@/types/social';

interface SocialState {
  posts: SocialPost[];
  addReaction: (postId: string, reaction: string) => void;
  addComment: (postId: string, comment: string) => void;
}

const mockPosts: SocialPost[] = [
  {
    id: '1',
    user: {
      id: '2',
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9c0b5c9?w=150&h=150&fit=crop&crop=face',
    },
    content: 'Just completed my morning beach run! The sunrise was absolutely breathtaking 🌅 Nothing beats starting the day with some cardio by the ocean!',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    location: 'Santa Monica Beach',
    activity: 'Running',
    timestamp: Date.now() - 7200000, // 2 hours ago
    stats: {
      distance: 5.2,
      duration: '32 min',
      calories: 420,
    },
    sweatPoints: 85,
    reactions: {
      '💪': 12,
      '🔥': 8,
      '👏': 15,
      '🏃‍♂️': 6,
    },
    comments: [
      { user: 'Mike Johnson', text: 'Amazing view! Great job on the run!' },
      { user: 'Emma Davis', text: 'You inspire me to wake up early too! 💪' },
    ],
  },
  {
    id: '2',
    user: {
      id: '3',
      name: 'Marcus Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    },
    content: 'Conquered the mountain bike trail today! 🚵‍♂️ The climb was tough but the downhill was pure adrenaline. Summer adventures are the best!',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    location: 'Mountain Trail Park',
    activity: 'Cycling',
    timestamp: Date.now() - 14400000, // 4 hours ago
    stats: {
      distance: 12.8,
      duration: '1h 15min',
      calories: 680,
    },
    sweatPoints: 120,
    reactions: {
      '💪': 18,
      '🔥': 22,
      '👏': 10,
      '⚡': 5,
    },
    comments: [
      { user: 'Lisa Park', text: 'That trail looks intense! Well done!' },
      { user: 'Alex Thompson', text: 'Need to try this trail next weekend!' },
      { user: 'Jordan Kim', text: 'Beast mode activated! 🔥' },
    ],
  },
  {
    id: '3',
    user: {
      id: '4',
      name: 'Zoe Williams',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    },
    content: 'Perfect evening for a yoga walk in the park! 🧘‍♀️ Found this amazing spot for some stretches. Mind and body feeling refreshed!',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    location: 'Central Park',
    activity: 'Walking',
    timestamp: Date.now() - 21600000, // 6 hours ago
    stats: {
      distance: 3.5,
      duration: '45 min',
      calories: 180,
    },
    sweatPoints: 45,
    reactions: {
      '💪': 8,
      '👏': 12,
      '💦': 3,
    },
    comments: [
      { user: 'David Lee', text: 'So peaceful! Love the combination of walking and yoga' },
    ],
  },
  {
    id: '4',
    user: {
      id: '5',
      name: 'Tyler Brooks',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    },
    content: 'Early morning sprint session at the track! 🏃‍♂️ Working on my speed for the upcoming 5K race. Every second counts!',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    location: 'City Athletics Track',
    activity: 'Running',
    timestamp: Date.now() - 28800000, // 8 hours ago
    stats: {
      distance: 2.0,
      duration: '18 min',
      calories: 250,
    },
    sweatPoints: 65,
    reactions: {
      '💪': 15,
      '🔥': 20,
      '⚡': 8,
    },
    comments: [
      { user: 'Rachel Green', text: 'Speed demon! Good luck with the race!' },
      { user: 'Chris Wilson', text: 'Those sprint intervals are killer! 💪' },
    ],
  },
];

export const useSocialStore = create<SocialState>((set) => ({
  posts: mockPosts,
  
  addReaction: (postId, reaction) => {
    set((state) => ({
      posts: state.posts.map(post => 
        post.id === postId 
          ? {
              ...post,
              reactions: {
                ...post.reactions,
                [reaction]: (post.reactions[reaction] || 0) + 1,
              },
            }
          : post
      ),
    }));
  },
  
  addComment: (postId, comment) => {
    set((state) => ({
      posts: state.posts.map(post => 
        post.id === postId 
          ? {
              ...post,
              comments: [
                ...post.comments,
                { user: 'You', text: comment },
              ],
            }
          : post
      ),
    }));
  },
}));