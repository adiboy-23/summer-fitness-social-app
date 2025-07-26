import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ShoppingBag, Coins, Zap, X, Check } from 'lucide-react-native';
import { useGameStore } from '@/store/gameStore';
import { StoreItem } from '@/types/game';

export default function StoreScreen() {
  const { user, storeItems, purchaseItem } = useGameStore();
  const [selectedCategory, setSelectedCategory] = useState('avatars');
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  const categories = [
    { id: 'avatars', name: 'Avatars', icon: '👤' },
    { id: 'gear', name: 'Gear', icon: '🎽' },
    { id: 'coupons', name: 'Coupons', icon: '🎫' },
    { id: 'nfts', name: 'NFTs', icon: '🖼️' },
  ];

  const filteredItems = storeItems.filter(item => item.category === selectedCategory);

  const handleItemPress = (item: StoreItem) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handlePurchase = () => {
    if (selectedItem && user.coins >= selectedItem.price) {
      purchaseItem(selectedItem.id);
      setPurchaseSuccess(true);
      setTimeout(() => {
        setPurchaseSuccess(false);
        setShowModal(false);
      }, 2000);
    }
  };

  const canAfford = (price: number) => user.coins >= price;

  const getCurrencyIcon = (currency: string) => {
    switch (currency) {
      case 'coins': return <Coins size={16} color="#FFD700" />;
      case 'steps': return <Text style={styles.stepsIcon}>👣</Text>;
      default: return <Coins size={16} color="#FFD700" />;
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Reward Store</Text>
        <Text style={styles.headerSubtitle}>Spend your hard-earned rewards!</Text>
        
        <View style={styles.balanceContainer}>
          <View style={styles.balanceItem}>
            <Coins size={20} color="#FFD700" />
            <Text style={styles.balanceText}>{user.coins} Coins</Text>
          </View>
          <View style={styles.balanceItem}>
            <Text style={styles.stepsIcon}>👣</Text>
            <Text style={styles.balanceText}>{user.todaySteps.toLocaleString()} Steps</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Categories */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text style={[
              styles.categoryText,
              selectedCategory === category.id && styles.categoryTextActive
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Items Grid */}
      <ScrollView style={styles.itemsContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.itemsGrid}>
          {filteredItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.itemCard,
                !canAfford(item.price) && styles.itemCardDisabled
              ]}
              onPress={() => handleItemPress(item)}
              disabled={!canAfford(item.price)}
            >
              <View style={styles.itemImageContainer}>
                <Text style={styles.itemIcon}>{item.icon}</Text>
                {item.rarity && (
                  <View style={[styles.rarityBadge, { backgroundColor: item.rarity === 'rare' ? '#9B59B6' : item.rarity === 'epic' ? '#E74C3C' : '#F39C12' }]}>
                    <Text style={styles.rarityText}>{item.rarity}</Text>
                  </View>
                )}
              </View>
              
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
              
              <View style={styles.itemPrice}>
                {getCurrencyIcon(item.currency)}
                <Text style={[
                  styles.priceText,
                  !canAfford(item.price) && styles.priceTextDisabled
                ]}>
                  {item.price}
                </Text>
              </View>
              
              {item.owned && (
                <View style={styles.ownedBadge}>
                  <Check size={12} color="white" />
                  <Text style={styles.ownedText}>Owned</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Item Detail Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowModal(false)}
      >
        {selectedItem && (
          <View style={styles.modalContainer}>
            {purchaseSuccess ? (
              <View style={styles.successContainer}>
                <Text style={styles.successIcon}>🎉</Text>
                <Text style={styles.successTitle}>Purchase Successful!</Text>
                <Text style={styles.successMessage}>
                  You've successfully purchased {selectedItem.name}!
                </Text>
              </View>
            ) : (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedItem.name}</Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setShowModal(false)}
                  >
                    <X size={24} color="#666" />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalContent}>
                  <View style={styles.itemPreview}>
                    <Text style={styles.itemPreviewIcon}>{selectedItem.icon}</Text>
                    {selectedItem.rarity && (
                      <View style={[styles.rarityBadgeLarge, { backgroundColor: selectedItem.rarity === 'rare' ? '#9B59B6' : selectedItem.rarity === 'epic' ? '#E74C3C' : '#F39C12' }]}>
                        <Text style={styles.rarityTextLarge}>{selectedItem.rarity.toUpperCase()}</Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.modalDescription}>{selectedItem.description}</Text>

                  {selectedItem.benefits && (
                    <View style={styles.benefitsSection}>
                      <Text style={styles.benefitsTitle}>Benefits:</Text>
                      {selectedItem.benefits.map((benefit, index) => (
                        <Text key={index} style={styles.benefitItem}>• {benefit}</Text>
                      ))}
                    </View>
                  )}

                  <View style={styles.priceSection}>
                    <Text style={styles.priceSectionTitle}>Price</Text>
                    <View style={styles.priceDisplay}>
                      {getCurrencyIcon(selectedItem.currency)}
                      <Text style={styles.priceDisplayText}>{selectedItem.price}</Text>
                    </View>
                  </View>
                </ScrollView>

                <View style={styles.modalFooter}>
                  {selectedItem.owned ? (
                    <View style={styles.ownedButton}>
                      <Check size={20} color="white" />
                      <Text style={styles.ownedButtonText}>Already Owned</Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={[
                        styles.purchaseButton,
                        !canAfford(selectedItem.price) && styles.purchaseButtonDisabled
                      ]}
                      onPress={handlePurchase}
                      disabled={!canAfford(selectedItem.price)}
                    >
                      <LinearGradient
                        colors={canAfford(selectedItem.price) ? ['#4ECDC4', '#44A08D'] : ['#BDC3C7', '#95A5A6']}
                        style={styles.purchaseButtonGradient}
                      >
                        <ShoppingBag size={20} color="white" />
                        <Text style={styles.purchaseButtonText}>
                          {canAfford(selectedItem.price) ? 'Purchase' : 'Insufficient Funds'}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  )}
                </View>
              </>
            )}
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
    marginBottom: 20,
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  balanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  balanceText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  stepsIcon: {
    fontSize: 16,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  categoryButton: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 15,
    borderRadius: 25,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryButtonActive: {
    backgroundColor: '#4ECDC4',
  },
  categoryIcon: {
    fontSize: 20,
    marginBottom: 5,
  },
  categoryText: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
  },
  categoryTextActive: {
    color: 'white',
  },
  itemsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  itemCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemCardDisabled: {
    opacity: 0.5,
  },
  itemImageContainer: {
    alignItems: 'center',
    marginBottom: 10,
    position: 'relative',
  },
  itemIcon: {
    fontSize: 40,
  },
  rarityBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  rarityText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  itemName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  itemDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  itemPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  priceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 5,
  },
  priceTextDisabled: {
    color: '#999',
  },
  ownedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4ECDC4',
    paddingVertical: 5,
    borderRadius: 10,
  },
  ownedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 5,
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
  itemPreview: {
    alignItems: 'center',
    marginBottom: 20,
  },
  itemPreviewIcon: {
    fontSize: 80,
    marginBottom: 10,
  },
  rarityBadgeLarge: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  rarityTextLarge: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  benefitsSection: {
    marginBottom: 20,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  benefitItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  priceSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  priceSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  priceDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 15,
  },
  priceDisplayText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  purchaseButton: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  purchaseButtonDisabled: {
    opacity: 0.5,
  },
  purchaseButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
  },
  purchaseButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  ownedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#95A5A6',
    padding: 18,
    borderRadius: 15,
  },
  ownedButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  successIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  successMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});