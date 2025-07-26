import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Trophy, Award, Zap, Coins, Target, Calendar, TrendingUp, Settings } from 'lucide-react-native';
import { useGameStore } from '@/store/gameStore';

export default function ProfileScreen() {
  const { user, achievements, weeklyStats } = useGameStore();

  const getBadgeIcon = (type: string) => {
    switch (type) {
      case 'distance': return '🏃‍♂️';
      case 'streak': return '🔥';
      case 'quest': return '⚡';
      case 'social': return '👥';
      default: return '🏆';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return '#4ECDC4';
    if (progress >= 50) return '#FFD93D';
    return '#FF6B6B';
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <View style={styles.profileInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userTitle}>Summer Adventurer</Text>
        </View>

        <View style={styles.levelContainer}>
          <Text style={styles.levelText}>Level {user.level}</Text>
          <View style={styles.xpBar}>
            <View style={[styles.xpFill, { width: `${(user.xp % 1000) / 10}%` }]} />
          </View>
          <Text style={styles.xpText}>{user.xp % 1000}/1000 XP</Text>
        </View>
      </LinearGradient>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Zap size={24} color="#FF6B6B" />
          <Text style={styles.statValue}>{user.xp.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Total XP</Text>
        </View>
        <View style={styles.statCard}>
          <Coins size={24} color="#FFD700" />
          <Text style={styles.statValue}>{user.coins}</Text>
          <Text style={styles.statLabel}>Coins</Text>
        </View>
        <View style={styles.statCard}>
          <Trophy size={24} color="#4ECDC4" />
          <Text style={styles.statValue}>{achievements.length}</Text>
          <Text style={styles.statLabel}>Badges</Text>
        </View>
        <View style={styles.statCard}>
          <Target size={24} color="#9B59B6" />
          <Text style={styles.statValue}>{user.completedQuests}</Text>
          <Text style={styles.statLabel}>Quests</Text>
        </View>
      </View>

      {/* Weekly Progress */}
      <View style={styles.weeklyContainer}>
        <Text style={styles.sectionTitle}>This Week</Text>
        <View style={styles.weeklyStats}>
          {weeklyStats.map((day, index) => (
            <View key={index} style={styles.dayColumn}>
              <Text style={styles.dayLabel}>{day.day}</Text>
              <View style={styles.dayBar}>
                <View 
                  style={[
                    styles.dayBarFill, 
                    { 
                      height: `${(day.steps / 15000) * 100}%`,
                      backgroundColor: getProgressColor((day.steps / 15000) * 100)
                    }
                  ]} 
                />
              </View>
              <Text style={styles.daySteps}>{(day.steps / 1000).toFixed(1)}k</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Achievements */}
      <View style={styles.achievementsContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {achievements.map((achievement) => (
            <View key={achievement.id} style={styles.achievementCard}>
              <Text style={styles.achievementIcon}>{getBadgeIcon(achievement.type)}</Text>
              <Text style={styles.achievementName}>{achievement.name}</Text>
              <Text style={styles.achievementDescription}>{achievement.description}</Text>
              <View style={styles.achievementProgress}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${achievement.progress}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>{achievement.progress}%</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Recent Activity */}
      <View style={styles.activityContainer}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityList}>
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Text>🏃‍♂️</Text>
            </View>
            <View style={styles.activityDetails}>
              <Text style={styles.activityTitle}>Completed "Beach Run Challenge"</Text>
              <Text style={styles.activityTime}>2 hours ago</Text>
            </View>
            <Text style={styles.activityReward}>+50 XP</Text>
          </View>
          
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Text>🏆</Text>
            </View>
            <View style={styles.activityDetails}>
              <Text style={styles.activityTitle}>Earned "Early Bird" badge</Text>
              <Text style={styles.activityTime}>1 day ago</Text>
            </View>
            <Text style={styles.activityReward}>+25 Coins</Text>
          </View>
          
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Text>🚴‍♀️</Text>
            </View>
            <View style={styles.activityDetails}>
              <Text style={styles.activityTitle}>Completed cycling quest</Text>
              <Text style={styles.activityTime}>2 days ago</Text>
            </View>
            <Text style={styles.activityReward}>+75 XP</Text>
          </View>
        </View>
      </View>

      {/* Settings */}
      <TouchableOpacity style={styles.settingsButton}>
        <Settings size={20} color="#666" />
        <Text style={styles.settingsText}>Settings & Privacy</Text>
      </TouchableOpacity>
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
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  avatarText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  userTitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  levelContainer: {
    alignItems: 'center',
    width: '100%',
  },
  levelText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  xpBar: {
    width: '80%',
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    marginBottom: 5,
  },
  xpFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 4,
  },
  xpText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 20,
    marginTop: -30,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flex: 1,
    marginHorizontal: 5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  weeklyContainer: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  weeklyStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
  },
  dayColumn: {
    alignItems: 'center',
    flex: 1,
  },
  dayLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  dayBar: {
    width: 20,
    height: 80,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  dayBarFill: {
    width: '100%',
    borderRadius: 10,
  },
  daySteps: {
    fontSize: 10,
    color: '#666',
    marginTop: 5,
  },
  achievementsContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  viewAllText: {
    color: '#4ECDC4',
    fontSize: 14,
    fontWeight: 'bold',
  },
  achievementCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginRight: 15,
    width: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementIcon: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 10,
  },
  achievementName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  achievementDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  achievementProgress: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginBottom: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4ECDC4',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
  },
  activityContainer: {
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
  activityList: {
    gap: 15,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  activityDetails: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  activityTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  activityReward: {
    fontSize: 12,
    color: '#4ECDC4',
    fontWeight: 'bold',
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingsText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
});