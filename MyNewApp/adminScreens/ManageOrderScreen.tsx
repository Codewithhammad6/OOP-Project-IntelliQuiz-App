import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import userStore from '../store/userStore.ts';

const ManageOrderScreen = ({ navigation }) => {
  const { getAllOrders,loading } = userStore();
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (error) {
      console.log("Error fetching orders:", error.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  //  Filter by status
  const pendingOrders = orders.filter(o => o.status === "pending");
  const shippedOrders = orders.filter(o => o.status === "shipped");
  const deliveredOrders = orders.filter(o => o.status === "delivered");

  return (

    <ScrollView style={styles.container}>
    {loading ? (
    <View style={{alignItems:'center',justifyContent:'center',marginTop:'100%',gap:60}}>
         <ActivityIndicator size="large" color="#007AFF" />
         <Text style={{}}>Loading orders...</Text>
             </View>
         ):(
              <View>
      <Text style={styles.heading}>Manage Orders</Text>
      <Text style={styles.total}>Total Orders : {orders?.length}</Text>

      <Pressable
        onPress={() => navigation.navigate('PendingOrders', { orders: pendingOrders })}
        style={styles.card}>
        <Text style={styles.cardText}>🛒 Pending Orders ({pendingOrders.length})</Text>
      </Pressable>

      <Pressable
        onPress={() => navigation.navigate('ShippedOrders', { orders: shippedOrders })}
        style={styles.card}>
        <Text style={styles.cardText}>📦 Shipped Orders ({shippedOrders.length})</Text>
      </Pressable>

      <Pressable
        onPress={() => navigation.navigate('DeliveredOrders', { orders: deliveredOrders })}
        style={styles.card}>
        <Text style={styles.cardText}>✅ Delivered Orders ({deliveredOrders.length})</Text>
      </Pressable>
      
      </View>
    )}
    </ScrollView>
)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
    marginTop: 25,
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
  },
  cardText: {
    fontSize: 17,
    fontWeight: '600',
  },
})

export default ManageOrderScreen
