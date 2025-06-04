import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { UserAvatar } from './UserAvatar';
import { useThemeName } from '@/core/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';

interface CommentProps {
  author: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  text: string;
  createdAt: string;
  isAuthor?: boolean;
  onDelete?: () => void;
}

export const Comment: React.FC<CommentProps> = ({ author, text, createdAt, isAuthor, onDelete }) => {
  const theme = useThemeName() || 'light';
  const styles = makeStyles(theme);
  const formattedDate = format(new Date(createdAt), 'd MMMM yyyy, HH:mm', { locale: ru });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <UserAvatar
          firstName={author.firstName}
          lastName={author.lastName}
          avatar={author.avatar}
          size={40}
        />
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>
            {`${author.firstName} ${author.lastName}`}
          </Text>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>
        {isAuthor && onDelete && (
          <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
            <MaterialIcons name="delete-outline" size={20} color={theme === 'dark' ? '#ff4444' : '#ff0000'} />
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const makeStyles = (theme: string) => StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : '#fff',
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: theme === 'dark' ? 0.1 : 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  authorInfo: {
    flex: 1,
    marginLeft: 12,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme === 'dark' ? '#fff' : '#000',
  },
  date: {
    fontSize: 12,
    color: theme === 'dark' ? 'rgba(255,255,255,0.7)' : '#666',
    marginTop: 2,
  },
  text: {
    fontSize: 14,
    color: theme === 'dark' ? '#fff' : '#333',
    lineHeight: 20,
  },
  deleteButton: {
    padding: 8,
  },
}); 