import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeName, DARK_THEME } from '@/core/hooks/useTheme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@realm/react';
import { NearbyPostModel } from '@/core/models/nearby-post';
import { getFileUrl } from '@/core/utils/url';
import { AutoVideoPlayer } from '@/app/components/AutoVideoPlayer';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useThemeName();
  const styles = makeStyles(theme!);

  const userPosts = useQuery(NearbyPostModel).filtered('authorId = $0', id);
  const firstPost = userPosts[0];

  if (!firstPost) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Пользователь не найден</Text>
      </View>
    );
  }

  const author = firstPost.author;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileHeader}>
          {author.avatar ? (
            <Image source={{ uri: author.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <MaterialIcons name="person" size={40} color="#fff" />
            </View>
          )}
          <Text style={styles.name}>{`${author.firstName} ${author.lastName}`}</Text>
          <Text style={styles.joinDate}>
            На сайте с {new Date(author.createdAt).toLocaleDateString('ru-RU')}
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userPosts.length}</Text>
            <Text style={styles.statLabel}>Публикаций</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {userPosts.reduce((sum, post) => sum + post.likes, 0)}
            </Text>
            <Text style={styles.statLabel}>Лайков</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {userPosts.reduce((sum, post) => sum + (post.views || 0), 0)}
            </Text>
            <Text style={styles.statLabel}>Просмотров</Text>
          </View>
        </View>

        <View style={styles.postsContainer}>
          <Text style={styles.sectionTitle}>Публикации</Text>
          <View style={styles.postsGrid}>
            {userPosts.map((post) => (
              <TouchableOpacity
                key={post.id}
                style={styles.postItem}
                onPress={() => router.push(`/services/nearby/view?id=${post.id}`)}
              >
                {post.type === 'image' ? (
                  <Image source={{ uri: getFileUrl(post.fileId) }} style={styles.postImage} />
                ) : (
                  <View style={styles.postImage}>
                    <AutoVideoPlayer source={getFileUrl(post.fileId)} style={styles.postImage} />
                    <View style={styles.videoIndicator}>
                      <MaterialIcons name="play-circle-filled" size={24} color="#fff" />
                    </View>
                  </View>
                )}
                <View style={styles.postStats}>
                  <View style={styles.postStat}>
                    <MaterialIcons 
                      name="visibility" 
                      size={16} 
                      color={theme === DARK_THEME ? '#fff' : '#000'} 
                    />
                    <Text style={styles.postStatText}>{post.views || 0}</Text>
                  </View>
                  <View style={styles.postStat}>
                    <MaterialIcons 
                      name="thumb-up" 
                      size={16} 
                      color={theme === DARK_THEME ? '#fff' : '#000'} 
                    />
                    <Text style={styles.postStatText}>{post.likes || 0}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const makeStyles = (theme: string) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme === DARK_THEME ? '#000' : '#fff',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: theme === DARK_THEME ? '#fff' : '#000',
    fontSize: 16,
  },
  header: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 100,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    color: theme === DARK_THEME ? '#fff' : '#000',
    marginBottom: 5,
  },
  joinDate: {
    fontSize: 14,
    color: theme === DARK_THEME ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme === DARK_THEME ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
    color: theme === DARK_THEME ? '#fff' : '#000',
  },
  statLabel: {
    fontSize: 12,
    color: theme === DARK_THEME ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
    marginTop: 5,
  },
  postsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme === DARK_THEME ? '#fff' : '#000',
    marginBottom: 15,
  },
  postsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  postItem: {
    width: (width - 50) / 2,
    margin: 5,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: theme === DARK_THEME ? '#222' : '#f5f5f5',
  },
  postImage: {
    width: '100%',
    height: (width - 50) / 2,
    backgroundColor: theme === DARK_THEME ? '#333' : '#eee',
  },
  videoIndicator: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
  },
  postStats: {
    flexDirection: 'row',
    padding: 8,
    justifyContent: 'space-between',
  },
  postStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postStatText: {
    color: theme === DARK_THEME ? '#fff' : '#000',
    marginLeft: 4,
    fontSize: 12,
  },
}); 