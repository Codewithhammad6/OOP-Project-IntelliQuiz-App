import {  
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  Platform, 
  FlatList 
} from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Picker } from '@react-native-picker/picker' 
import userProductStore from '../store/useProductStore.ts'
const UserProductsScreen = ({ route }) => {
  // Assuming you're passing products as a parameter
  const { products: initialProducts } = route.params
  const [products, setProducts] = useState(initialProducts)
  const { deleteProduct } = userProductStore()

  const handlerDeleteProduct = async (productId) => {
    try {
      await deleteProduct(productId);
      setProducts((prevProducts) => prevProducts.filter((p) => p._id !== productId));
    } catch (error) {
      console.log("Failed to delete product:", error.message);
    }
  };


  const renderProduct = ({ item, index }) => (
    <View style={styles.card}>
      {/* Product Header */}
      <Text style={styles.title}>Product #{index + 1}</Text>
      <Text style={styles.subText}>
        Added: {new Date(item.createdAt).toDateString()}
      </Text>

      {/* Product Image */}
      <Image 
        source={{ uri: item.image }} 
        style={styles.productImage} 
        resizeMode="cover"
      />
      
      {/* Product Details */}
      <Text style={styles.productTitle}>{item.title}</Text>
      
      <View style={styles.priceContainer}>
        <Text style={styles.oldPrice}>Rs {item.oldPrice}</Text>
        <Text style={styles.price}>Rs {item.price}</Text>
        <Text style={styles.offer}>{item.offer} off</Text>
      </View>
      
      <View style={styles.detailsRow}>
        <Text style={styles.detailLabel}>Category:</Text>
        <Text style={styles.detailValue}>{item.category}</Text>
      </View>
      
      <View style={styles.detailsRow}>
        <Text style={styles.detailLabel}>Color:</Text>
        <Text style={styles.detailValue}>{item.color}</Text>
      </View>
      
      <View style={styles.detailsRow}>
        <Text style={styles.detailLabel}>Size:</Text>
        <Text style={styles.detailValue}>{item.size}</Text>
      </View>
      
      <View style={styles.detailsRow}>
        <Text style={styles.detailLabel}>Today's Deal:</Text>
        <Text style={styles.detailValue}>{item.todayDeal === "yes" ? "Yes" : "No"}</Text>
      </View>
      
      <View style={styles.detailsRow}>
        <Text style={styles.detailLabel}>Trending:</Text>
        <Text style={styles.detailValue}>{item.trendingDeal === "yes" ? "Yes" : "No"}</Text>
      </View>

 

      {/* 🔹 Delete Button */}
      <TouchableOpacity
        onPress={() => handlerDeleteProduct(item._id)}
        style={[styles.button, { backgroundColor: '#f44336' }]}
      >
        <Text style={styles.btnText}>Delete Product</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView
      style={{
        paddingTop: Platform.OS === 'android' ? 5 : 0,
        flex: 1,
        backgroundColor: '#dfdcdccc',
      }}
    >
      {products.length === 0 ? (
        <Text style={styles.noProducts}>No products found</Text>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.container}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { padding: 12 },
  card: {
    backgroundColor: '#ffffffe4',
    padding: 15,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 3,
  },
  title: { fontSize: 17, fontWeight: 'bold', marginBottom: 6 },
  subText: { fontSize: 13, color: '#555', marginBottom: 10 },
  productImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  oldPrice: {
    fontSize: 16,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 10,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e53935',
    marginRight: 10,
  },
  offer: {
    fontSize: 13,
    color: '#4caf50',
    fontWeight: '500',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
  },
  detailValue: {
    fontSize: 13,
    color: '#333',
  },
  noProducts: { 
    textAlign: 'center', 
    marginTop: 50, 
    fontSize: 16, 
    color: '#666' 
  },

  button: {
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  btnText: { 
    color: '#fff', 
    fontWeight: '600',
    fontSize: 14,
  },
})

export default UserProductsScreen