import { WeatherData } from '@/types/weather';

export const getCurrentWeather = async (lat: number, lon: number): Promise<WeatherData> => {
  try {
    // Using OpenWeatherMap API - you would need to add your API key
    // For demo purposes, returning mock data
    const mockWeather: WeatherData = {
      location: 'Los Angeles, CA',
      temperature: 28,
      condition: 'Sunny',
      humidity: 65,
      windSpeed: 12,
    };
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return mockWeather;
  } catch (error) {
    console.error('Weather API error:', error);
    // Return fallback data
    return {
      location: 'Unknown Location',
      temperature: 25,
      condition: 'Clear',
      humidity: 60,
      windSpeed: 10,
    };
  }
};