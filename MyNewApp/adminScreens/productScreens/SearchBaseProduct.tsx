import { 
  View, 
  Text, 
  TextInput, 
  FlatList, 
  RefreshControl, 
  ActivityIndicator, 
  StyleSheet,
  Pressable,
  Image 
} from 'react-native'
import React, { useState, useEffect } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import useProductStore from "../../store/useProductStore.ts";

const SearchBaseProduct = ({ route, navigation }) => {
  const { item } = route.params; 
  const [searchQuery, setSearchQuery] = useState('')
  const { products, fetchProducts, loading } = useProductStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  // First filter by category, then by search query
  const categoryProducts = products.filter(product => 
    product.category.toLowerCase().includes(item.toLowerCase())
  );
  
  const filteredProducts = categoryProducts.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };

  const renderProduct = ({ item }) => (
    <Pressable
      onPress={() => navigation.navigate('Info', { item: item })}
      style={styles.productItem}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.productImage}
        resizeMode="contain"
      />
      <View style={styles.productInfo}>
        <Text style={styles.productTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.productPrice}>${item.price}</Text>
        {item.offer && (
          <Text style={styles.productOffer}>Upto {item.offer}</Text>
        )}
      </View>
    </Pressable>
  );

  if (loading && products.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={{ marginTop: 10 }}>Loading products...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
     
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="gray" />
          <TextInput
            placeholder={`Search in ${item}`}
            placeholderTextColor="#A9A9A9"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="gray" />
            </Pressable>
          )}
        </View>
      </View>

      <View style={styles.resultsInfo}>
        <Text style={styles.resultsText}>
          {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
          {searchQuery ? ` for "${searchQuery}"` : ''} in {item}
        </Text>
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item._id || item.id}
        renderItem={renderProduct}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.centered}>
            <Ionicons name="search-outline" size={50} color="#ccc" />
            <Text style={styles.noResultsText}>
              {searchQuery 
                ? `No products found for "${searchQuery}" in ${item}`
                : `No products available in ${item}`
              }
            </Text>
            <Text style={styles.noResultsSubText}>
              Try different keywords or check back later
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  searchContainer: {
    backgroundColor: '#4199c7ff',
    padding: 10,
  },
  searchInputContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 6,
    alignItems: 'center',
    height: 40,
    paddingHorizontal: 10,
  },
  searchInput: {
    fontSize: 12,
    flex: 1,
    marginLeft: 6,
    marginBottom:3,
    color: '#000',
    paddingBottom:7
  },
  resultsInfo: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    justifyContent:'space-between',
    flexDirection:'row'
  },
  resultsText: {
    fontSize: 12,
    color: '#666',
  },
  listContainer: { 
    padding: 10,
  },
  productItem: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    padding: 10,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2a9d8f',
    marginBottom: 3,
  },
  productOffer: {
    fontSize: 12,
    color: '#e63946',
    fontWeight: '500',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  noResultsSubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default SearchBaseProduct;