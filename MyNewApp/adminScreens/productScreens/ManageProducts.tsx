import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import useProductStore from '../../store/useProductStore.ts';

const ManageProducts = ({ navigation }) => {
  const { products, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts(); 
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Manage Products</Text>
      <Text style={styles.total}>Total Products: {products.length}</Text>

      <Pressable
        onPress={() => navigation.navigate('AllProduct')}
        style={styles.card}>
        <Ionicons name="cart-outline" size={24} color="black" />
        <Text style={styles.cardText}>All Products</Text>
      </Pressable>

      <Pressable
        onPress={() => navigation.navigate('AddProduct')}
        style={styles.card}>
        <Ionicons name="add-circle-outline" size={24} color="black" />
        <Text style={styles.cardText}>Add Products</Text>
      </Pressable>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
    marginTop: 25
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  total: {
    fontSize: 17,
    fontWeight: '500',
    marginBottom: 15,
    textAlign: 'right',
    color: '#696363ff'
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
    flexDirection:'row',
    alignItems:'center',
    gap:10
  },
  cardText: {
    fontSize: 17,
    fontWeight: '600',
  },
})

export default ManageProducts
