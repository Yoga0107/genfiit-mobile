import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ActivityIndicator, Alert, Modal, RefreshControl, Image, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getID } from '../utils/handlingDataRegister';
import HeaderComponent from '../components/Header';
import { fetchPosts, addPost, deletePost, editPost } from '../api/forumApi';
import Icon from 'react-native-vector-icons/FontAwesome';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

type Post = {
  id: number;
  attributes: {
    title: string;
    comment: string;
    createdAt: string;
    users_permissions_user: { data: { id: number; attributes: { username: string } } };
  };
};

const ForumScreen: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [showMyPosts, setShowMyPosts] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [selectedPostAction, setSelectedPostAction] = useState<'edit' | 'delete' | null>(null);
  const [dropdownVisiblePostId, setDropdownVisiblePostId] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  useEffect(() => {
    fetchUserID();
  }, []);

  useEffect(() => {
    if (userId !== null) {
      fetchPostsData();
    }
  }, [userId, showMyPosts]);

  const fetchUserID = async () => {
    try {
      const id: any = await getID();
      const numericId = id ? parseInt(id, 10) : null;
      setUserId(numericId);
    } catch (error) {
      console.error('Error fetching user ID:', error);
    }
  };

  const fetchPostsData = async () => {
    try {
      setLoading(true);
      const postsData = await fetchPosts(userId, showMyPosts);
      setPosts(postsData);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleAddPost = async () => {
    if (!newTitle.trim() || !newComment.trim()) {
      Alert.alert('Validation Error', 'Both title and comment cannot be empty.');
      return;
    }

    try {
      const numericUserId = Number(await getID()) || null;
      if (!numericUserId) {
        Alert.alert('Error', 'User ID is missing or invalid.');
        return;
      }

      const newPostData = await addPost(newTitle, newComment, numericUserId);
      setPosts((prevPosts) => [newPostData, ...prevPosts]);
      setNewTitle('');
      setNewComment('');
    } catch (error) {
      console.error('Error adding post:', error);
      Alert.alert('Error', 'Failed to add post.');
    }
  };

  const handleDeletePost = async () => {
    if (selectedPostId) {
      try {
        await deletePost(selectedPostId);
        setPosts(posts.filter((post) => post.id !== selectedPostId));
        setDropdownVisiblePostId(null);
        setModalVisible(false);
      } catch (error) {
        console.error('Error deleting post:', error);
        Alert.alert('Error', 'Failed to delete post.');
      }
    }
  };

  const handleEditPost = async () => {
    if (selectedPostId && selectedPostAction === 'edit') {
      setShowConfirmationModal(true);
    }
  };

  const confirmEditPost = async () => {
    if (selectedPostId) {
      try {
        await editPost(selectedPostId, newTitle, newComment);
        setPosts(posts.map(post => post.id === selectedPostId ? { ...post, attributes: { ...post.attributes, title: newTitle, comment: newComment } } : post));
        setDropdownVisiblePostId(null);
        setNewTitle('');
        setNewComment('');
        setModalVisible(false);
        setShowConfirmationModal(false);
      } catch (error) {
        console.error('Error editing post:', error);
        Alert.alert('Error', 'Failed to edit post.');
        setShowConfirmationModal(false);
      }
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPostsData();
  };

  const renderPost = ({ item }: { item: Post }) => {
    const { id, attributes } = item;
    const { title, comment, createdAt, users_permissions_user } = attributes;
    const username = users_permissions_user?.data?.attributes?.username || 'Unknown User';
    const isMyPost = userId === users_permissions_user?.data?.id;

    const shortenedUsername = `${username.slice(0, 3)}*****`;

    return (
      <View style={styles.postContainer}>
        <Image source={require('../../assets/avatar-chara.png')} style={styles.postImage} />
        <View style={styles.postHeader}>
          <Text style={styles.postDate}>{new Date(createdAt).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}</Text>
          {isMyPost && (
            <TouchableOpacity 
              onPress={() => setDropdownVisiblePostId(dropdownVisiblePostId === id ? null : id)}  
              style={styles.postOptionsButton}
            >
              <Ionicons name="ellipsis-vertical" size={24} color="#333" />
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.postTitle}>{title}</Text>
        <Text style={styles.postComment}>{comment}</Text>

        <View style={styles.postFooter}>
          <Text style={styles.postPostedBy}>Posted by: {shortenedUsername}</Text>
        </View>

        {dropdownVisiblePostId === id && isMyPost && (
          <View style={styles.dropdownMenu}>
            <TouchableOpacity
              onPress={() => { 
                setSelectedPostId(id); 
                setSelectedPostAction('edit'); 
                setNewTitle(title); 
                setNewComment(comment); 
                setModalVisible(true); 
                setDropdownVisiblePostId(null);  
              }}
              style={styles.dropdownItem}
            >
              <Text>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => { 
                setSelectedPostId(id); 
                setSelectedPostAction('delete'); 
                setModalVisible(true); 
                setDropdownVisiblePostId(null);  
              }} 
              style={styles.dropdownItem}
            >
              <Text>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#18B2A0" />
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <HeaderComponent title="Forum" />
      <Image source={require('../../assets/forum-chara.png')} style={styles.headerImage} />
      <Text style={styles.descriptionText}>
      This is a place for those who want to express themselves about Nutrition or Mental Health. Feel free to share here!
        </Text>
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.descriptionContainer}>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputTitle}
          placeholder="Enter title"
          value={newTitle}
          onChangeText={setNewTitle}
        />
        <TextInput
          style={styles.inputComment}
          placeholder="Add your thoughts..."
          value={newComment}
          onChangeText={setNewComment}
          multiline
        />
        <TouchableOpacity style={styles.button} onPress={handleAddPost}>
          <Text style={styles.buttonText}>POST</Text>
          <Icon name="paper-plane" size={20} color="#fff" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.toggleButton} 
          onPress={() => setShowMyPosts(!showMyPosts)}
        >
          <Text style={styles.toggleButtonText}>
            {showMyPosts ? 'Show All Posts' : 'Show My Posts'}
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>No posts available.</Text>
        )}
      />

      {/* Modal for Edit or Delete Confirmation */}
      <Modal
  visible={modalVisible}
  transparent
  animationType="fade"
  onRequestClose={() => setModalVisible(false)}
>
  <BlurView intensity={50} style={styles.blurBackground}>
    <View style={styles.modalContent}>
      {selectedPostAction === 'edit' ? (
        <>
          <Text style={styles.modalTitle}>Edit Post</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Update title"
            value={newTitle}
            onChangeText={setNewTitle}
          />
          <TextInput
            style={styles.modalInput}
            placeholder="Update comment"
            value={newComment}
            onChangeText={setNewComment}
            multiline
          />
          <TouchableOpacity
            style={styles.modalButton}
            onPress={confirmEditPost}
          >
            <Text style={styles.modalButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.modalTitle}>Delete Post</Text>
          <Text>Are you sure you want to delete this post?</Text>
          <TouchableOpacity
            style={[styles.modalButton, { backgroundColor: '#ff4d4d' }]}
            onPress={handleDeletePost}
          >
            <Text style={styles.modalButtonText}>Delete</Text>
          </TouchableOpacity>
        </>
      )}
      <TouchableOpacity
        style={styles.modalCloseButton}
        onPress={() => setModalVisible(false)}
      >
        <Text style={styles.modalCloseButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </BlurView>
</Modal>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmationModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirmationModal(false)}
      >
        <View style={styles.confirmationModalContainer}>
          <View style={styles.confirmationModalContent}>
            <Text style={styles.confirmationModalText}>
              Are you sure you want to save these changes?
            </Text>
            <View style={styles.confirmationButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#4CAF50' }]}
                onPress={confirmEditPost}
              >
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#ff4d4d' }]}
                onPress={() => setShowConfirmationModal(false)}
              >
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',  // Overlay background
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 12,
    width: '85%',
    maxWidth: 400,
    alignItems: 'center',
    elevation: 10,  // Shadow effect for elevation
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  modalInput: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
    paddingLeft: 15,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  modalButton: {
    backgroundColor: '#18B2A0',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalCloseButton: {
    marginTop: 15,
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  modalCloseButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },

  // Confirmation Modal Styles
  confirmationModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0,5)',  // Slightly dimmer overlay for confirmation
  },
  confirmationModalContent: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 12,
    width: '85%',
    maxWidth: 400,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  confirmationModalText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  confirmationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  confirmationButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmationButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  confirmButtonYes: {
    backgroundColor: '#4CAF50',
  },
  confirmButtonNo: {
    backgroundColor: '#FF4D4D',
  },
  confirmationCancelButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    width: '40%',
    elevation: 3,
  },
  confirmationCancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#f9f9f9',
    paddingBottom: 20,
  },
  descriptionContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  descriptionText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
  },
  inputContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputTitle: {
    height: 40,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    paddingLeft: 10,
    fontSize: 16,
  },
  inputComment: {
    height: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    paddingLeft: 10,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#18B2A0',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginRight: 8,
  },
  icon: {
    marginTop: 3,
  },
  toggleButton: {
    marginTop: 10,
    alignSelf: 'center',
  },
  toggleButtonText: {
    color: '#18B2A0',
    fontSize: 16,
  },
  postContainer: {
    backgroundColor: '#fff',
    marginBottom: 16,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postDate: {
    fontSize: 14,
    color: '#999',
  },
  postOptionsButton: {
    padding: 8,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  postComment: {
    fontSize: 16,
    color: '#555',
    marginTop: 8,
  },
  postFooter: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  postPostedBy: {
    fontSize: 14,
    color: '#333',
  },
  dropdownMenu: {
    backgroundColor: '#fff',
    borderRadius: 8,
    position: 'absolute',
    top: 30,
    right: 0,
    width: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  emptyText: {
    textAlign: 'center',
    color: '#555',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  // Missing styles
  postImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  mainContainer: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: '#fff', 
  },
  blurBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparansi tambahan di atas blur
  },
  headerImage: {
    width: 200,
    height: 200,
    alignSelf: 'center',  // Centers the image horizontally
    borderRadius: 75, // Optional: rounded corners (circle)
  }
});

export default ForumScreen;
