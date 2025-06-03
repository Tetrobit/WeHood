import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface CommentProps {
  author: {
    firstName: string;
    lastName: string;
    avatar: string;
  };
  text: string;
  createdAt: string;
}

export const Comment: React.FC<CommentProps> = ({ author, text, createdAt }) => {
  const formattedDate = format(new Date(createdAt), 'd MMMM yyyy, HH:mm', { locale: ru });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={{ uri: author.avatar }} 
          style={styles.avatar}
        />
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>
            {`${author.firstName} ${author.lastName}`}
          </Text>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>
      </View>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  text: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
}); 