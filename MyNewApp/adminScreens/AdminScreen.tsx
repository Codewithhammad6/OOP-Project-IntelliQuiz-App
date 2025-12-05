import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native'
import React from 'react'

const AdminScreen = ({navigation}) => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Admin Dashboard</Text>

    
      <Pressable
      onPress={()=>navigation.navigate('Users')}
      style={styles.card}>
        <Text style={styles.cardText}>👤 Manage Users</Text>
      </Pressable>

      <Pressable
      onPress={()=>navigation.navigate('ManageOrders')}
      style={styles.card}>
        <Text style={styles.cardText}>🛒 Manage Orders</Text>
      </Pressable>

      <Pressable
        onPress={()=>navigation.navigate('ManageProducts')}
      style={styles.card}>
        <Text style={styles.cardText}>📦 Manage Products</Text>
      </Pressable>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
    marginTop:15
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
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

export default AdminScreen
