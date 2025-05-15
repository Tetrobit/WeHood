import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { IFlat } from '@/app/types/flat';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { DARK_THEME, useThemeName } from '@/core/hooks/useTheme';

interface FlatCardProps {
  flat: IFlat;
}

const { width } = Dimensions.get('window');

export default function FlatCard({ flat }: FlatCardProps) {
  const theme = useThemeName();
  const styles = makeStyles(theme);

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => router.push(`/+not-found`)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: flat.images[0] }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.price}>{flat.price.toLocaleString()} ₽/мес</Text>
          <View style={styles.viewersContainer}>
            <MaterialCommunityIcons name="eye" size={16} color={theme === DARK_THEME ? '#fff' : '#000'} />
            <Text style={styles.viewersText}>{flat.currentViewers}</Text>
          </View>
        </View>
        <Text style={styles.title} numberOfLines={1}>{flat.title}</Text>
        <Text style={styles.address} numberOfLines={1}>{flat.address}</Text>
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <MaterialCommunityIcons name="bed" size={16} color={theme === DARK_THEME ? '#fff' : '#000'} />
            <Text style={styles.detailText}>{flat.rooms} комн.</Text>
          </View>
          <View style={styles.detailItem}>
            <MaterialCommunityIcons name="ruler" size={16} color={theme === DARK_THEME ? '#fff' : '#000'} />
            <Text style={styles.detailText}>{flat.area} м²</Text>
          </View>
          <View style={styles.detailItem}>
            <MaterialCommunityIcons name="stairs" size={16} color={theme === DARK_THEME ? '#fff' : '#000'} />
            <Text style={styles.detailText}>{flat.floor}/{flat.totalFloors} эт.</Text>
          </View>
        </View>
        <View style={styles.distance}>
          <MaterialCommunityIcons name="map-marker" size={16} color="#4ECDC4" />
          <Text style={styles.distanceText}>
            {flat.distance < 1000 
              ? `${flat.distance} м` 
              : `${(flat.distance / 1000).toFixed(1)} км`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const makeStyles = (theme: string) => StyleSheet.create({
  container: {
    backgroundColor: theme === DARK_THEME ? '#222' : '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    width: width - 32,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  content: {
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme === DARK_THEME ? '#fff' : '#000',
  },
  viewersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme === DARK_THEME ? '#333' : '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  viewersText: {
    marginLeft: 4,
    fontSize: 12,
    color: theme === DARK_THEME ? '#fff' : '#000',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
    color: theme === DARK_THEME ? '#fff' : '#000',
  },
  address: {
    fontSize: 14,
    color: theme === DARK_THEME ? '#aaa' : '#666',
    marginBottom: 8,
  },
  details: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    marginLeft: 4,
    fontSize: 14,
    color: theme === DARK_THEME ? '#fff' : '#000',
  },
  distance: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#4ECDC4',
  },
}); 