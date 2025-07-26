import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, TextInput, Alert, Platform, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, MessageCircle, Share as ShareIcon, Camera, MapPin, Flame, X } from 'lucide-react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useSocialStore } from '@/store/socialStore';

export default function SocialScreen() {
  const { posts, addReaction, addComment } = useSocialStore();
  const [newComment, setNewComment] = useState('');
  const [activeCommentPost, setActiveCommentPost] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const cameraRef = React.useRef<any>(null);

  const handleReaction = (postId: string, reaction: string) => {
    addReaction(postId, reaction);
  };

  const handleAddComment = (postId: string) => {
    if (newComment.trim()) {
      addComment(postId, newComment.trim());
      setNewComment('');
      setActiveCommentPost(null);
    }
  };

  const handleShare = async (post: any) => {
    const message = `Check out ${post.user.name}'s ${post.activity.toLowerCase()} achievement!\n\n${post.content}\n\nDistance: ${post.stats.distance}km\nDuration: ${post.stats.duration}\nCalories: ${post.stats.calories}\n\n#FitnessAdventure #SummerFitness`;
    
    if (Platform.OS === 'web') {
      // Web sharing fallback
      if (navigator.share) {
        try {
          await navigator.share({
            title: `${post.user.name}'s Fitness Achievement`,
            text: message,
            url: post.image,
          });
        } catch (error) {
          // Fallback to clipboard
          navigator.clipboard?.writeText(message);
          Alert.alert('Copied!', 'Post copied to clipboard!');
        }
      } else {
        navigator.clipboard?.writeText(message);
        Alert.alert('Copied!', 'Post copied to clipboard!');
      }
    } else {
      // Mobile sharing
      try {
        const ReactNative = require('react-native');
        await ReactNative.Share.share({
          message,
          title: `${post.user.name}'s Fitness Achievement`,
          url: post.image,
        });
      } catch (error) {
        console.error('Share error:', error);
        Alert.alert('Error', 'Failed to share post');
      }
    }
  };

  const handleCreatePost = () => {
    Alert.alert(
      '📸 Share Your Adventure',
      'Choose how you want to share your fitness journey:',
      [
        {
          text: 'Take Photo',
          onPress: openCamera,
        },
        {
          text: 'Choose from Gallery',
          onPress: pickImageFromGallery,
        },
        {
          text: 'Text Only',
          onPress: () => Alert.alert('Text Post', 'Text post composer would open here'),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const openCamera = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Camera Not Available', 'Camera is not available on web. Please use gallery instead.');
      return;
    }

    if (!permission) {
      const { status } = await requestPermission();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Camera access is required to take photos!');
        return;
      }
    }

    if (!permission?.granted) {
      Alert.alert('Permission needed', 'Camera access is required to take photos!');
      return;
    }

    setShowCamera(true);
  };

  const pickImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Gallery access is required to select photos!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setCapturedImage(result.assets[0].uri);
      showPostComposer(result.assets[0].uri);
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        setCapturedImage(photo.uri);
        setShowCamera(false);
        showPostComposer(photo.uri);
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  };

  const showPostComposer = (imageUri: string) => {
    Alert.alert(
      '🎉 Great Shot!',
      'Your photo is ready! Add a caption to share your fitness adventure.',
      [
        {
          text: 'Add Caption & Share',
          onPress: () => {
            // In a real app, this would open a post composer
            Alert.alert('Success!', 'Your adventure has been shared! 📸✨');
          },
        },
        {
          text: 'Retake',
          onPress: () => {
            setCapturedImage(null);
            if (Platform.OS !== 'web') {
              setShowCamera(true);
            }
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Social Feed</Text>
        <Text style={styles.headerSubtitle}>Share your fitness journey!</Text>
      </LinearGradient>

      {/* Create Post Button */}
      <TouchableOpacity style={styles.createPostButton} onPress={handleCreatePost}>
        <LinearGradient
          colors={['#FF6B6B', '#FF8E53']}
          style={styles.createPostGradient}
        >
          <Camera size={20} color="white" />
          <Text style={styles.createPostText}>Share Your Adventure</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Camera Modal */}
      {Platform.OS !== 'web' && (
        <Modal
          visible={showCamera}
          animationType="slide"
          presentationStyle="fullScreen"
        >
          <View style={styles.cameraContainer}>
            <CameraView
              style={styles.camera}
              facing={facing}
              ref={cameraRef}
            >
              <View style={styles.cameraOverlay}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowCamera(false)}
                >
                  <X size={24} color="white" />
                </TouchableOpacity>
                
                <View style={styles.cameraControls}>
                  <TouchableOpacity
                    style={styles.flipButton}
                    onPress={toggleCameraFacing}
                  >
                    <Text style={styles.flipButtonText}>Flip</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.captureButton}
                    onPress={takePicture}
                  >
                    <View style={styles.captureButtonInner} />
                  </TouchableOpacity>
                  
                  <View style={styles.placeholder} />
                </View>
              </View>
            </CameraView>
          </View>
        </Modal>
      )}

      <ScrollView style={styles.feed} showsVerticalScrollIndicator={false}>
        {posts.map((post) => (
          <View key={post.id} style={styles.postCard}>
            {/* Post Header */}
            <View style={styles.postHeader}>
              <View style={styles.userInfo}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{post.user.name.charAt(0)}</Text>
                </View>
                <View style={styles.userDetails}>
                  <Text style={styles.userName}>{post.user.name}</Text>
                  <View style={styles.postMeta}>
                    <MapPin size={12} color="#666" />
                    <Text style={styles.location}>{post.location}</Text>
                    <Text style={styles.timestamp}>• {formatTime(post.timestamp)}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.activityBadge}>
                <Text style={styles.activityText}>{post.activity}</Text>
              </View>
            </View>

            {/* Post Image */}
            {post.image && (
              <Image source={{ uri: post.image }} style={styles.postImage} />
            )}

            {/* Post Content */}
            <View style={styles.postContent}>
              <Text style={styles.postText}>{post.content}</Text>
              
              {/* Stats */}
              <View style={styles.statsContainer}>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{post.stats.distance}km</Text>
                  <Text style={styles.statLabel}>Distance</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{post.stats.duration}</Text>
                  <Text style={styles.statLabel}>Duration</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{post.stats.calories}</Text>
                  <Text style={styles.statLabel}>Calories</Text>
                </View>
                <View style={styles.stat}>
                  <Flame size={16} color="#FF6B6B" />
                  <Text style={styles.statValue}>{post.sweatPoints}</Text>
                  <Text style={styles.statLabel}>Sweat Points</Text>
                </View>
              </View>
            </View>

            {/* Reactions */}
            <View style={styles.reactionsContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {['💪', '🔥', '👏', '🏃‍♂️', '💦', '⚡'].map((emoji) => (
                  <TouchableOpacity
                    key={emoji}
                    style={[
                      styles.reactionButton,
                      post.reactions[emoji] > 0 && styles.reactionButtonActive
                    ]}
                    onPress={() => handleReaction(post.id, emoji)}
                  >
                    <Text style={styles.reactionEmoji}>{emoji}</Text>
                    {post.reactions[emoji] > 0 && (
                      <Text style={styles.reactionCount}>{post.reactions[emoji]}</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Actions */}
            <View style={styles.actionsContainer}>
              <TouchableOpacity style={styles.actionButton}>
                <Heart size={20} color="#666" />
                <Text style={styles.actionText}>Like</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => setActiveCommentPost(post.id)}
              >
                <MessageCircle size={20} color="#666" />
                <Text style={styles.actionText}>Comment</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleShare(post)}
              >
                <ShareIcon size={20} color="#666" />
                <Text style={styles.actionText}>Share</Text>
              </TouchableOpacity>
            </View>

            {/* Comments */}
            {post.comments.length > 0 && (
              <View style={styles.commentsContainer}>
                {post.comments.slice(0, 2).map((comment, index) => (
                  <View key={index} style={styles.comment}>
                    <Text style={styles.commentUser}>{comment.user}</Text>
                    <Text style={styles.commentText}>{comment.text}</Text>
                  </View>
                ))}
                {post.comments.length > 2 && (
                  <TouchableOpacity>
                    <Text style={styles.viewMoreComments}>
                      View all {post.comments.length} comments
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Add Comment */}
            {activeCommentPost === post.id && (
              <View style={styles.addCommentContainer}>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Add a comment..."
                  value={newComment}
                  onChangeText={setNewComment}
                  multiline
                />
                <TouchableOpacity
                  style={styles.commentSubmitButton}
                  onPress={() => handleAddComment(post.id)}
                >
                  <Text style={styles.commentSubmitText}>Post</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
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
  createPostButton: {
    margin: 20,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  createPostGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
  createPostText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
  feed: {
    flex: 1,
  },
  postCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4ECDC4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  location: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  activityBadge: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  activityText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  postImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  postContent: {
    padding: 15,
  },
  postText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding: 15,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  reactionsContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  reactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  reactionButtonActive: {
    backgroundColor: '#E3F2FD',
  },
  reactionEmoji: {
    fontSize: 16,
  },
  reactionCount: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    fontWeight: 'bold',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
  },
  commentsContainer: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  comment: {
    marginBottom: 8,
  },
  commentUser: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  commentText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  viewMoreComments: {
    fontSize: 12,
    color: '#4ECDC4',
    fontWeight: 'bold',
  },
  addCommentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 15,
    paddingBottom: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 80,
  },
  commentSubmitButton: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  commentSubmitText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 10,
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingBottom: 50,
  },
  flipButton: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  flipButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF6B6B',
  },
  placeholder: {
    width: 60,
  },
});