import { View, Text, FlatList, StyleSheet, Pressable, TextInput, Platform, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import userStore from '../store/userStore.ts'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useFocusEffect } from '@react-navigation/native'

const UsersScreen = ({navigation}) => {
  const [users, setUsers] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const { getUsers ,deleteUser,loading} = userStore()

  // fetch users from store
  const fetchUsers = async () => {
    try {
      const result = await getUsers()
      setUsers(result)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])



  useFocusEffect(
    useCallback(() => {
      fetchUsers();
    }, [])
  );




const handleDeleteUser = async (userId) => {
  Alert.alert(
    "Confirm Delete",
    "Are you sure you want to delete this user and all their orders?",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteUser(userId);
            setUsers((prev) => prev.filter((u) => u._id !== userId));
          } catch (error) {
            console.error("Failed to delete user:", error.message);
          }
        },
      },
    ]
  );
};




  // filter users by searchQuery (case-insensitive)
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{flexDirection:'row',justifyContent:'space-between',paddingVertical:8,alignItems:'center',flexWrap:'wrap'}}>
      <Text style={styles.name}>{item.name}</Text>
             <Text style={styles.address}>
                    Date: {new Date(item.createdAt).toDateString()}-{new Date(item.createdAt).toLocaleTimeString()}
                  </Text>
                  </View>
      <Text style={styles.email}>{item.email}</Text>
      <Text>Verified: {item.verified ? '✅' : '❌'}</Text>

      {/* Show addresses */}
      {item.addresses && item.addresses.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Addresses:</Text>
          {item.addresses.map((addr, index) => (
            <Text key={index} style={styles.address}>
              {addr.houseNo}, {addr.street}, {addr.landmark} ({addr.mobileNo})
            </Text>
          ))}
          
        </View>
      )}
      <View style={{alignItems:'center',justifyContent:'space-around',flexDirection:'row'}}>
      <TouchableOpacity 
      onPress={()=>{navigation.navigate('UserOrders',{orders:item.orders});}}
  style={{
    marginTop: 10,
    backgroundColor: '#4794bdff',
    alignItems: 'center',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal:20
  }}
>
  <Text style={{ fontSize: 13, fontWeight: '500' }}>
    Orders ({item.orders?.length || 0})
  </Text>
</TouchableOpacity>

      <TouchableOpacity 
      onPress={()=>{navigation.navigate('UserProducts',{products:item.products});}}
  style={{
    marginTop: 10,
    backgroundColor: '#4794bdff',
    alignItems: 'center',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal:20
  }}
>
  <Text style={{ fontSize: 13, fontWeight: '500' }}>
    Products ({item.products?.length || 0})
  </Text>
</TouchableOpacity>


 <TouchableOpacity 
      onPress={()=>{handleDeleteUser(item._id)}}
  style={{
    backgroundColor: '#babbbcff',
    alignItems: 'center',
    borderRadius: 20,
    padding:10
  }}
>
<Ionicons name="trash-outline" size={22} color="black" />
</TouchableOpacity>
</View>

    </View>
  )

  // search header
  const renderHeader = () => (
    <>
    <View
      style={{
        backgroundColor: '#4199c7ff',
        padding: 10,
        alignItems: 'center',
        flexDirection: 'row',
        gap: 9,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: 'white',
          borderRadius: 6,
          alignItems: 'center',
          flex: 1,
          height: 40,
          paddingHorizontal: 10,
        }}
      >
        <Ionicons name="search" size={20} color="gray" />
        <TextInput
          placeholder="Search by name"
          placeholderTextColor="#A9A9A9"
          style={{ fontSize: 16, flex: 1, marginLeft: 6,paddingBottom:7, color: '#000' }}
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
      </View>
    </View>
      <View style={{alignItems:'flex-end',marginTop:10,marginHorizontal:40}}>
        <View style={{flexDirection:'row'}}>
        <Text style={{color:'#6b6767ff',fontWeight:'600',fontSize:15}}>Total Users : </Text>
        <Text style={{color:'#6b6767ff',fontWeight:'600',fontSize:15}}>{users?.length}</Text>
        </View>
        </View>
      </>
  )

  return (
    <SafeAreaView
      style={{
        paddingTop: Platform.OS === 'android' ? 0 : 0,
        flex: 1,
        backgroundColor: '#beb5b584',
      }}
    >
      {loading ? (
 <View style={{alignItems:'center',justifyContent:'center',height:'100%',gap:70}}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={{}}>Loading user...</Text>
          </View>
      ):(
 <FlatList
        data={filteredUsers}   //  use filtered list
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}   //  sticky header
        contentContainerStyle={{ paddingBottom: 50 }}
      />
      )}
     
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  card: {
    backgroundColor: '#ffffffe0',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
    margin: 10,
  },
  name: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  email: {
    color: 'gray',
    marginBottom: 5,
  },
  section: {
    marginTop: 10,
  },
  sectionTitle: {
    fontWeight: '600',
  },
  address: {
    fontSize: 12,
    color: '#444',
    
  },
})

export default UsersScreen
