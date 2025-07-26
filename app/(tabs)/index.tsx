import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sun, MapPin, Zap, Coins, Trophy, Thermometer, Droplets, Play, Square } from 'lucide-react-native';
import * as Location from 'expo-location';
import { useGameStore } from '@/store/gameStore';
import { getCurrentWeather } from '@/services/weatherService';
import { WeatherData } from '@/types/weather';

interface TrackingData {
  startLocation: Location.LocationObject;
  currentLocation: Location.LocationObject;
  distance: number;
  duration: number;
  path: Location.LocationObject[];
}

export default function HomeScreen() {
  const { user, currentQuest, updateStats } = useGameStore();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [activityType, setActivityType] = useState<'run' | 'bike' | 'walk' | null>(null);
  const trackingInterval = useRef<NodeJS.Timeout | null>(null);
  const startTime = useRef<number>(0);

  useEffect(() => {
    getLocationAndWeather();
  }, []);

  const getLocationAndWeather = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location access is needed for quests!');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      const weatherData = await getCurrentWeather(
        location.coords.latitude,
        location.coords.longitude
      );
      setWeather(weatherData);

      // Check for heat warnings
      if (weatherData.temperature > 32) {
        Alert.alert(
          '🌡️ Heat Warning',
          'High temperature detected! Stay hydrated and take breaks in shade.',
          [{ text: 'Got it!' }]
        );
      }
    } catch (error) {
      console.error('Location/Weather error:', error);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const startActivity = async (type: 'run' | 'bike' | 'walk') => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Location access is required to track your activity!');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setActivityType(type);
      setIsTracking(true);
      startTime.current = Date.now();
      setTrackingData({
        startLocation: currentLocation,
        currentLocation,
        distance: 0,
        duration: 0,
        path: [currentLocation],
      });

      // Start tracking location updates
      trackingInterval.current = setInterval(async () => {
        try {
          const newLocation = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });

          setTrackingData(prev => {
            if (!prev) return null;
            
            const newDistance = calculateDistance(
              prev.currentLocation.coords.latitude,
              prev.currentLocation.coords.longitude,
              newLocation.coords.latitude,
              newLocation.coords.longitude
            );

            const totalDistance = prev.distance + newDistance;
            const duration = Math.floor((Date.now() - startTime.current) / 1000);

            return {
              ...prev,
              currentLocation: newLocation,
              distance: totalDistance,
              duration,
              path: [...prev.path, newLocation],
            };
          });
        } catch (error) {
          console.error('Location tracking error:', error);
        }
      }, 5000); // Update every 5 seconds

      Alert.alert(
        `🏃‍♂️ ${type.charAt(0).toUpperCase() + type.slice(1)} Started!`,
        'Your activity is now being tracked. Stay safe and have fun!'
      );
    } catch (error) {
      console.error('Start activity error:', error);
      Alert.alert('Error', 'Failed to start activity tracking.');
    }
  };

  const stopActivity = () => {
    if (trackingInterval.current) {
      clearInterval(trackingInterval.current);
      trackingInterval.current = null;
    }

    if (trackingData && activityType) {
      const distance = trackingData.distance;
      const duration = trackingData.duration;
      const avgSpeed = distance > 0 ? (distance / (duration / 3600)) : 0; // km/h
      
      // Calculate rewards based on activity type and performance
      let baseXP = Math.floor(distance * 20); // 20 XP per km
      let calories = Math.floor(distance * 60); // Rough estimate
      let steps = Math.floor(distance * 1300); // Rough estimate

      // Bonus for different activity types
      if (activityType === 'run') {
        baseXP *= 1.5;
        calories *= 1.2;
      } else if (activityType === 'bike') {
        baseXP *= 1.2;
        calories *= 0.8;
        steps *= 0.3; // Cycling doesn't count as many steps
      }

      updateStats(steps, baseXP, calories);

      Alert.alert(
        '🎉 Activity Complete!',
        `Distance: ${distance.toFixed(2)}km\nDuration: ${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}\nAvg Speed: ${avgSpeed.toFixed(1)} km/h\n\nRewards: ${baseXP} XP, ${Math.floor(baseXP / 10)} coins!`,
        [
          {
            text: 'Share Achievement',
            onPress: () => shareActivity(distance, duration, activityType),
          },
          { text: 'Done', style: 'default' },
        ]
      );
    }

    setIsTracking(false);
    setTrackingData(null);
    setActivityType(null);
  };

  const shareActivity = async (distance: number, duration: number, type: string) => {
    const message = `Just completed a ${distance.toFixed(2)}km ${type} in ${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}! 🏃‍♂️💪 #FitnessAdventure #SummerFitness`;
    
    if (Platform.OS === 'web') {
      // Web sharing fallback
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'My Fitness Achievement',
            text: message,
          });
        } catch (error) {
          // Fallback to clipboard
          navigator.clipboard?.writeText(message);
          Alert.alert('Copied!', 'Achievement copied to clipboard!');
        }
      } else {
        navigator.clipboard?.writeText(message);
        Alert.alert('Copied!', 'Achievement copied to clipboard!');
      }
    } else {
      // Mobile sharing
      try {
        const ReactNative = require('react-native');
        await ReactNative.Share.share({
          message,
          title: 'My Fitness Achievement',
        });
      } catch (error) {
        console.error('Share error:', error);
      }
    }
  };

  const startQuest = () => {
    setIsTracking(true);
    // Simulate quest progress
    setTimeout(() => {
      updateStats(150, 25, 500); // steps, xp, calories
      setIsTracking(false);
      Alert.alert('🎉 Quest Complete!', 'You earned 25 XP and 10 coins!');
    }, 3000);
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return <Sun size={24} color="#FFD700" />;
      case 'rainy':
        return <Droplets size={24} color="#4A90E2" />;
      default:
        return <Sun size={24} color="#FFD700" />;
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#FF6B6B', '#FF8E53', '#FF6B9D']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>Good morning, {user.name}! ☀️</Text>
          <Text style={styles.subtitle}>Ready for your summer adventure?</Text>
        </View>
      </LinearGradient>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Zap size={20} color="#FF6B6B" />
          <Text style={styles.statValue}>{user.xp}</Text>
          <Text style={styles.statLabel}>XP</Text>
        </View>
        <View style={styles.statCard}>
          <Coins size={20} color="#FFD700" />
          <Text style={styles.statValue}>{user.coins}</Text>
          <Text style={styles.statLabel}>Coins</Text>
        </View>
        <View style={styles.statCard}>
          <Trophy size={20} color="#4ECDC4" />
          <Text style={styles.statValue}>{user.level}</Text>
          <Text style={styles.statLabel}>Level</Text>
        </View>
      </View>

      {/* Weather Card */}
      {weather && (
        <View style={styles.weatherCard}>
          <View style={styles.weatherHeader}>
            <MapPin size={16} color="#666" />
            <Text style={styles.locationText}>{weather.location}</Text>
          </View>
          <View style={styles.weatherContent}>
            {getWeatherIcon(weather.condition)}
            <View style={styles.weatherInfo}>
              <Text style={styles.temperature}>{weather.temperature}°C</Text>
              <Text style={styles.condition}>{weather.condition}</Text>
            </View>
            <View style={styles.weatherDetails}>
              <Text style={styles.humidity}>Humidity: {weather.humidity}%</Text>
              <Text style={styles.windSpeed}>Wind: {weather.windSpeed} km/h</Text>
            </View>
          </View>
        </View>
      )}

      {/* Current Quest */}
      {currentQuest && (
        <View style={styles.questCard}>
          <LinearGradient
            colors={['#4ECDC4', '#44A08D']}
            style={styles.questGradient}
          >
            <Text style={styles.questTitle}>🏃‍♂️ Active Quest</Text>
            <Text style={styles.questName}>{currentQuest.name}</Text>
            <Text style={styles.questDescription}>{currentQuest.description}</Text>
            
            <View style={styles.questRewards}>
              <Text style={styles.rewardText}>Rewards: {currentQuest.xpReward} XP • {currentQuest.coinReward} Coins</Text>
            </View>

            <TouchableOpacity
              style={[styles.questButton, isTracking && styles.questButtonActive]}
              onPress={startQuest}
              disabled={isTracking}
            >
              <Text style={styles.questButtonText}>
                {isTracking ? 'Tracking...' : 'Start Quest'}
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      )}

      {/* Today's Progress */}
      <View style={styles.progressCard}>
        <Text style={styles.progressTitle}>Today's Progress</Text>
        
        <View style={styles.progressItem}>
          <Text style={styles.progressLabel}>Steps</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(user.todaySteps / 10000) * 100}%` }]} />
          </View>
          <Text style={styles.progressValue}>{user.todaySteps.toLocaleString()}/10,000</Text>
        </View>

        <View style={styles.progressItem}>
          <Text style={styles.progressLabel}>Calories</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(user.todayCalories / 2000) * 100}%` }]} />
          </View>
          <Text style={styles.progressValue}>{user.todayCalories}/2,000</Text>
        </View>
      </View>

      {/* Activity Tracking */}
      {isTracking && trackingData && (
        <View style={styles.trackingCard}>
          <LinearGradient
            colors={['#FF6B6B', '#FF8E53']}
            style={styles.trackingGradient}
          >
            <Text style={styles.trackingTitle}>🏃‍♂️ Tracking {activityType?.charAt(0).toUpperCase()}{activityType?.slice(1)}</Text>
            
            <View style={styles.trackingStats}>
              <View style={styles.trackingStat}>
                <Text style={styles.trackingStatValue}>{trackingData.distance.toFixed(2)}</Text>
                <Text style={styles.trackingStatLabel}>km</Text>
              </View>
              <View style={styles.trackingStat}>
                <Text style={styles.trackingStatValue}>
                  {Math.floor(trackingData.duration / 60)}:{(trackingData.duration % 60).toString().padStart(2, '0')}
                </Text>
                <Text style={styles.trackingStatLabel}>time</Text>
              </View>
              <View style={styles.trackingStat}>
                <Text style={styles.trackingStatValue}>
                  {trackingData.distance > 0 ? (trackingData.distance / (trackingData.duration / 3600)).toFixed(1) : '0.0'}
                </Text>
                <Text style={styles.trackingStatLabel}>km/h</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.stopButton}
              onPress={stopActivity}
            >
              <Square size={20} color="white" fill="white" />
              <Text style={styles.stopButtonText}>Stop Activity</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => isTracking ? stopActivity() : startActivity('run')}
          disabled={isTracking && activityType !== 'run'}
        >
          <LinearGradient colors={['#FF6B6B', '#FF8E53']} style={styles.actionGradient}>
            {isTracking && activityType === 'run' ? (
              <Square size={20} color="white" fill="white" />
            ) : (
              <Play size={20} color="white" fill="white" />
            )}
            <Text style={styles.actionText}>
              {isTracking && activityType === 'run' ? 'Stop Run' : '🏃‍♂️ Start Run'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => isTracking ? stopActivity() : startActivity('bike')}
          disabled={isTracking && activityType !== 'bike'}
        >
          <LinearGradient colors={['#4ECDC4', '#44A08D']} style={styles.actionGradient}>
            {isTracking && activityType === 'bike' ? (
              <Square size={20} color="white" fill="white" />
            ) : (
              <Play size={20} color="white" fill="white" />
            )}
            <Text style={styles.actionText}>
              {isTracking && activityType === 'bike' ? 'Stop Ride' : '🚴‍♀️ Bike Ride'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => isTracking ? stopActivity() : startActivity('walk')}
          disabled={isTracking && activityType !== 'walk'}
        >
          <LinearGradient colors={['#667eea', '#764ba2']} style={styles.actionGradient}>
            {isTracking && activityType === 'walk' ? (
              <Square size={18} color="white" fill="white" />
            ) : (
              <Play size={18} color="white" fill="white" />
            )}
            <Text style={styles.actionText}>
              {isTracking && activityType === 'walk' ? 'Stop Walk' : '🚶‍♂️ Start Walk'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      
      {/* Bottom padding for better scrolling */}
      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 20,
    marginTop: -30,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 80,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  weatherCard: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  weatherHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  locationText: {
    marginLeft: 5,
    color: '#666',
    fontSize: 14,
  },
  weatherContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherInfo: {
    marginLeft: 15,
    flex: 1,
  },
  temperature: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  condition: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  weatherDetails: {
    alignItems: 'flex-end',
  },
  humidity: {
    fontSize: 12,
    color: '#666',
  },
  windSpeed: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  questCard: {
    margin: 20,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questGradient: {
    padding: 20,
  },
  questTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  questName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  questDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 15,
  },
  questRewards: {
    marginBottom: 15,
  },
  rewardText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  questButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  questButtonActive: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  questButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  progressCard: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  progressItem: {
    marginBottom: 15,
  },
  progressLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4ECDC4',
    borderRadius: 4,
  },
  progressValue: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 15,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fullWidthButton: {
    flex: 1,
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    minHeight: 55,
  },
  actionText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 8,
    textAlign: 'center',
  },
  trackingCard: {
    margin: 20,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  trackingGradient: {
    padding: 20,
  },
  trackingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  trackingStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  trackingStat: {
    alignItems: 'center',
  },
  trackingStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  trackingStatLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  stopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    padding: 15,
  },
  stopButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
}); 