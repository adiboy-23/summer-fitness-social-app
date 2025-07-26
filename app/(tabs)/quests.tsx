import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, Clock, Zap, Coins, X, Trophy } from 'lucide-react-native';
import { useGameStore } from '@/store/gameStore';
import { Quest } from '@/types/game';

export default function QuestsScreen() {
  const { availableQuests, startQuest } = useGameStore();
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleQuestPress = (quest: Quest) => {
    setSelectedQuest(quest);
    setShowModal(true);
  };

  const handleStartQuest = () => {
    if (selectedQuest) {
      startQuest(selectedQuest.id);
      setShowModal(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#4ECDC4';
      case 'Medium': return '#FFD93D';
      case 'Hard': return '#FF6B6B';
      default: return '#4ECDC4';
    }
  };

  const getQuestIcon = (type: string) => {
    switch (type) {
      case 'walking': return '🚶‍♂️';
      case 'running': return '🏃‍♂️';
      case 'cycling': return '🚴‍♀️';
      case 'hiking': return '🥾';
      default: return '🏃‍♂️';
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Summer Quests</Text>
        <Text style={styles.headerSubtitle}>Choose your adventure!</Text>
      </LinearGradient>

      <ScrollView style={styles.questsList} showsVerticalScrollIndicator={false}>
        {availableQuests.map((quest) => (
          <TouchableOpacity
            key={quest.id}
            style={styles.questCard}
            onPress={() => handleQuestPress(quest)}
          >
            <View style={styles.questHeader}>
              <Text style={styles.questIcon}>{getQuestIcon(quest.type)}</Text>
              <View style={styles.questInfo}>
                <Text style={styles.questName}>{quest.name}</Text>
                <Text style={styles.questDescription}>{quest.description}</Text>
              </View>
              <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(quest.difficulty) }]}>
                <Text style={styles.difficultyText}>{quest.difficulty}</Text>
              </View>
            </View>

            <View style={styles.questDetails}>
              <View style={styles.questDetail}>
                <MapPin size={16} color="#666" />
                <Text style={styles.questDetailText}>{quest.distance}km</Text>
              </View>
              <View style={styles.questDetail}>
                <Clock size={16} color="#666" />
                <Text style={styles.questDetailText}>{quest.estimatedTime}</Text>
              </View>
              <View style={styles.questDetail}>
                <Zap size={16} color="#FF6B6B" />
                <Text style={styles.questDetailText}>{quest.xpReward} XP</Text>
              </View>
              <View style={styles.questDetail}>
                <Coins size={16} color="#FFD700" />
                <Text style={styles.questDetailText}>{quest.coinReward}</Text>
              </View>
            </View>

            {quest.requirements && (
              <View style={styles.requirements}>
                <Text style={styles.requirementsTitle}>Requirements:</Text>
                <Text style={styles.requirementsText}>{quest.requirements}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Quest Detail Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowModal(false)}
      >
        {selectedQuest && (
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedQuest.name}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowModal(false)}
              >
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.questIconLarge}>
                <Text style={styles.questIconLargeText}>{getQuestIcon(selectedQuest.type)}</Text>
              </View>

              <Text style={styles.modalDescription}>{selectedQuest.description}</Text>

              <View style={styles.modalStats}>
                <View style={styles.modalStat}>
                  <MapPin size={20} color="#4ECDC4" />
                  <Text style={styles.modalStatLabel}>Distance</Text>
                  <Text style={styles.modalStatValue}>{selectedQuest.distance}km</Text>
                </View>
                <View style={styles.modalStat}>
                  <Clock size={20} color="#FFD93D" />
                  <Text style={styles.modalStatLabel}>Time</Text>
                  <Text style={styles.modalStatValue}>{selectedQuest.estimatedTime}</Text>
                </View>
                <View style={styles.modalStat}>
                  <Trophy size={20} color="#FF6B6B" />
                  <Text style={styles.modalStatLabel}>Difficulty</Text>
                  <Text style={styles.modalStatValue}>{selectedQuest.difficulty}</Text>
                </View>
              </View>

              <View style={styles.rewardsSection}>
                <Text style={styles.rewardsSectionTitle}>Rewards</Text>
                <View style={styles.rewardsGrid}>
                  <View style={styles.rewardItem}>
                    <Zap size={24} color="#FF6B6B" />
                    <Text style={styles.rewardValue}>{selectedQuest.xpReward}</Text>
                    <Text style={styles.rewardLabel}>XP</Text>
                  </View>
                  <View style={styles.rewardItem}>
                    <Coins size={24} color="#FFD700" />
                    <Text style={styles.rewardValue}>{selectedQuest.coinReward}</Text>
                    <Text style={styles.rewardLabel}>Coins</Text>
                  </View>
                </View>
              </View>

              {selectedQuest.requirements && (
                <View style={styles.requirementsSection}>
                  <Text style={styles.requirementsSectionTitle}>Requirements</Text>
                  <Text style={styles.requirementsSectionText}>{selectedQuest.requirements}</Text>
                </View>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.startButton} onPress={handleStartQuest}>
                <LinearGradient
                  colors={['#4ECDC4', '#44A08D']}
                  style={styles.startButtonGradient}
                >
                  <Text style={styles.startButtonText}>Start Quest</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Modal>
    </View>
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
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  questsList: {
    flex: 1,
    padding: 20,
  },
  questCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  questIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  questInfo: {
    flex: 1,
  },
  questName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  questDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  difficultyText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  questDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  questDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  questDetailText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666',
  },
  requirements: {
    marginTop: 10,
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  requirementsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  requirementsText: {
    fontSize: 12,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  questIconLarge: {
    alignItems: 'center',
    marginBottom: 20,
  },
  questIconLargeText: {
    fontSize: 60,
  },
  modalDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 30,
  },
  modalStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  modalStat: {
    alignItems: 'center',
  },
  modalStatLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  modalStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  rewardsSection: {
    marginBottom: 30,
  },
  rewardsSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  rewardsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  rewardItem: {
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 20,
    borderRadius: 15,
    minWidth: 100,
  },
  rewardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  rewardLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  requirementsSection: {
    backgroundColor: '#FFF3CD',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  requirementsSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 8,
  },
  requirementsSectionText: {
    fontSize: 14,
    color: '#856404',
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  startButton: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  startButtonGradient: {
    padding: 18,
    alignItems: 'center',
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});