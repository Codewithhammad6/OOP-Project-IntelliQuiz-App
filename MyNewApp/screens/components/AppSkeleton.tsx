// AppSkeleton.tsx
import React from 'react';
import { View, Dimensions, StyleSheet, Animated } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const { width, height } = Dimensions.get('window');

const AppSkeleton = () => {
  return (
    <View style={styles.container}>
      <SkeletonPlaceholder borderRadius={8} backgroundColor="#e8e8e8" highlightColor="#f5f5f5">
        <View style={styles.content}>
          {/* Header Skeleton */}
          <View style={styles.header}>
            <View style={styles.logo} />
            <View style={styles.headerRight}>
              <View style={styles.icon} />
              <View style={styles.icon} />
            </View>
          </View>

          {/* Search Bar Skeleton */}
          <View style={styles.searchBar} />

          {/* Categories Skeleton */}
          <View style={styles.categories}>
            {[...Array(5)].map((_, index) => (
              <View key={index} style={styles.categoryItem}>
                <View style={styles.categoryIcon} />
                <View style={styles.categoryText} />
              </View>
            ))}
          </View>

          {/* Banner Skeleton */}
          <View style={styles.banner} />

          {/* Section Title Skeleton */}
          <View style={styles.sectionTitle} />

          {/* Product Grid Skeleton */}
          <View style={styles.productGrid}>
            {[...Array(4)].map((_, index) => (
              <View key={index} style={styles.productCard}>
                <View style={styles.productImage} />
                <View style={styles.productTitle} />
                <View style={styles.productPrice} />
              </View>
            ))}
          </View>

          {/* Bottom Navigation Skeleton */}
          <View style={styles.navigation}>
            <View style={styles.navItem}>
              <View style={styles.navIcon} />
              <View style={styles.navText} />
            </View>
            <View style={styles.navItem}>
              <View style={styles.navIcon} />
              <View style={styles.navText} />
            </View>
            <View style={styles.navItem}>
              <View style={styles.navIcon} />
              <View style={styles.navText} />
            </View>
          </View>
        </View>
      </SkeletonPlaceholder>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    height: 50,
  },
  logo: {
    width: 120,
    height: 40,
    borderRadius: 8,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 16,
  },
  icon: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  searchBar: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    marginBottom: 16,
  },
  categories: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  categoryItem: {
    alignItems: 'center',
    width: 60,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 8,
  },
  categoryText: {
    width: 40,
    height: 12,
    borderRadius: 4,
  },
  banner: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    width: 200,
    height: 24,
    borderRadius: 4,
    marginBottom: 16,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 70,
  },
  productCard: {
    width: (width - 48) / 2,
    marginBottom: 16,
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: 140,
    borderRadius: 8,
    marginBottom: 8,
  },
  productTitle: {
    width: '80%',
    height: 16,
    borderRadius: 4,
    marginBottom: 8,
  },
  productPrice: {
    width: '40%',
    height: 18,
    borderRadius: 4,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingHorizontal: 16,
  },
  navItem: {
    alignItems: 'center',
  },
  navIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginBottom: 4,
  },
  navText: {
    width: 40,
    height: 12,
    borderRadius: 3,
  },
});

export default AppSkeleton;