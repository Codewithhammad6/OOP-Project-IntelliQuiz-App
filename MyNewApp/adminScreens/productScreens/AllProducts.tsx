import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
  ActivityIndicator,
  Modal,
  ScrollView,
  TextInput,
} from "react-native";
import useProductStore from "../../store/useProductStore.ts";
import { Product } from "../../types/product"; // Assuming you have a Product type
import Ionicons from 'react-native-vector-icons/Ionicons';
import userStore from "../../store/userStore.ts";
import { ADMIN } from '@env';



interface AllProductsProps {
  navigation: any;
}

const AllProducts: React.FC<AllProductsProps> = ({ navigation }) => {
  const { products, fetchProducts, deleteProduct, updateProduct, loading, error } =
    useProductStore();
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('')
const {user}=userStore()
  // filter product by searchQuery (case-insensitive)
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  )



  useEffect(() => {
    fetchProducts();
  }, []);
console.log(products)
  useEffect(() => {
    if (error) {
      Alert.alert("Error", error);
    }
  }, [error]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };

  const handleUpdateTrending = async (item: Product) => {
    setUpdatingId(item._id);
    try {
      const updatedData = {
        ...item,
        trendingDeal: item.trendingDeal === "yes" ? "no" : "yes",
      };
      await updateProduct(item._id, updatedData);
    } catch (err) {
      Alert.alert("Update Failed", "Could not update trending status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleUpdateTodayDeal = async (item: Product) => {
    setUpdatingId(item._id);
    try {
      const updatedData = {
        ...item,
        todayDeal: item.todayDeal === "yes" ? "no" : "yes",
      };
      await updateProduct(item._id, updatedData);
    } catch (err) {
      Alert.alert("Update Failed", "Could not update today's deal status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSetMainImage = async (item: Product, imageIndex: number) => {
    setUpdatingId(item._id);
    try {
      // Set the selected carousel image as the main image
      const newMainImage = item.carouselImages[imageIndex];
      const updatedData = {
        ...item,
        image: newMainImage,
      };
      await updateProduct(item._id, updatedData);
      setImageModalVisible(false);
      Alert.alert("Success", "Main image updated successfully");
    } catch (err) {
      Alert.alert("Update Failed", "Could not update main image");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this product?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setDeletingId(id);
            try {
              await deleteProduct(id);
            } catch (err) {
              Alert.alert("Delete Failed", "Could not delete product");
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]
    );
  };

  const openImageSelector = (product: Product) => {
    setSelectedProduct(product);
    setImageModalVisible(true);
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <>
    
    <View style={styles.card}>
      {/* Product Image with selection option */}
      <TouchableOpacity onPress={() => openImageSelector(item)}>
        <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
        <View style={styles.imageOverlay}>
          <Text style={styles.imageOverlayText}>Tap to change main image</Text>
        </View>
      </TouchableOpacity>
 <View>
      <Text style={{marginVertical:5,fontSize:11}}>
              Date: {new Date(item.createdAt).toDateString()} - {new Date(item.createdAt).toLocaleTimeString()}
            </Text>
      </View>
      <View>
      <Text style={{marginVertical:5}}>
             <Text style={{fontWeight:'500',fontSize:17}}>Seller:</Text>  {item?.user?.name}
            </Text>
      </View>
     

      {/* Title */}
      <Text style={styles.title} numberOfLines={2}>
        {item.title}
      </Text>

      {/* Price + Offer */}
      <View style={styles.priceRow}>
        <Text style={styles.price}>Rs.{item.price}</Text>
        <Text style={styles.oldPrice}>Rs.{item.oldPrice}</Text>
        <Text style={styles.offer}>{item.offer} OFF</Text>
      </View>

      {/* Category / Deals */}
      <Text style={styles.subText}>Category: <Text style={styles.subTex}>{item.category}</Text></Text>
      <Text style={styles.subText}>Color: <Text style={styles.subTex}>{item.color}</Text></Text>
      <Text style={styles.subText}>Size: <Text style={styles.subTex}>{item.size}</Text></Text>
      <Text style={styles.subText}>Rating: <Text style={styles.subTex}>{item.rating}</Text></Text>
      

 {/* Status indicators */}
{ user?.email === ADMIN && (
      <View style={styles.statusContainer}>
        <View style={[
          styles.statusIndicator, 
          { backgroundColor: item.trendingDeal === "yes" ? "#4CAF50" : "#ccc" }
        ]}>
          <Text style={styles.statusText}>
            Trending: {item.trendingDeal === "yes" ? "Yes" : "No"}
          </Text>
        </View>
        <View style={[
          styles.statusIndicator, 
          { backgroundColor: item.todayDeal === "yes" ? "#FF9800" : "#ccc" }
        ]}>
          <Text style={styles.statusText}>
            Today's Deal: {item.todayDeal === "yes" ? "Yes" : "No"}
          </Text>
        </View>
      </View>
)}
     

      {/* Carousel Images */}
      {item.carouselImages && item.carouselImages.length > 0 && (
        <View>
          <Text style={styles.carouselTitle}>Additional Images:</Text>
          <FlatList
            horizontal
            data={item.carouselImages}
            keyExtractor={(img, idx) => `${idx}-${img.substring(0, 10)}`}
            renderItem={({ item: img, index }) => (
              <TouchableOpacity onPress={() => openImageSelector(item)}>
                <Image 
                  source={{ uri: img }} 
                  style={[
                    styles.carouselImg, 
                    item.image === img && styles.selectedCarouselImg
                  ]} 
                  resizeMode="cover" 
                />
                {item.image === img && (
                  <Text style={styles.currentImageText}>Main</Text>
                )}
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
            style={{ marginVertical: 8 }}
          />
        </View>
      )}

      <TouchableOpacity
        style={styles.editBtn}
        onPress={() => navigation.navigate("EditProduct", { product: item })}
      >
        <Text style={styles.editText}>Edit Product</Text>
      </TouchableOpacity>

      {/* Buttons Row */}
      <View style={styles.actionsRow}>
       {user?.email === ADMIN && (
<>
 <TouchableOpacity
          style={[styles.btn, { backgroundColor: "#4CAF50" }]}
          onPress={() => handleUpdateTrending(item)}
          disabled={updatingId === item._id}
        >
          {updatingId === item._id ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.btnText}>
              {item.trendingDeal === "yes" ? "Remove Trend" : "Make Trend"}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, { backgroundColor: "#FF9800" }]}
          onPress={() => handleUpdateTodayDeal(item)}
          disabled={updatingId === item._id}
        >
          {updatingId === item._id ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.btnText}>
              {item.todayDeal === "yes" ? "Remove Today's Deal" : "Add Today's Deal"}
            </Text>
          )}
        </TouchableOpacity>
</>
       )}
       

        <TouchableOpacity
          style={[styles.btn, { backgroundColor: "#f44336" }]}
          onPress={() => handleDelete(item._id)}
          disabled={deletingId === item._id}
        >
          {deletingId === item._id ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.btnText}>Delete</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
    </>
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
    <>
    <View style={{marginTop:0,backgroundColor:'#d0d0d0d3',flex:1}}>

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
              style={{ fontSize: 11, flex: 1, marginLeft: 6, color: '#000',marginBottom:-1 }}
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)}
            />
          </View>
        </View>
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item._id}
        renderItem={renderProduct}
        contentContainerStyle={{ padding: 10 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text>No products found</Text>
          </View>
        }
      />

      {/* Image Selection Modal */}
      <Modal
        visible={imageModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setImageModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Main Image</Text>
            <Text style={styles.modalSubtitle}>Choose which image to display as the main product image</Text>
            
            <ScrollView>
              {selectedProduct && selectedProduct.carouselImages && (
                <View style={styles.imageGrid}>
                  {selectedProduct.carouselImages.map((img, index) => (
                    <TouchableOpacity 
                      key={index} 
                      style={[
                        styles.imageOption,
                        selectedProduct.image === img && styles.selectedImageOption
                      ]}
                      onPress={() => handleSetMainImage(selectedProduct, index)}
                    >
                      <Image 
                        source={{ uri: img }} 
                        style={styles.modalImage} 
                        resizeMode="cover" 
                      />
                      {selectedProduct.image === img && (
                        <View style={styles.currentSelection}>
                          <Text style={styles.currentSelectionText}>Current Main Image</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </ScrollView>
            
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setImageModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f9f8f8ff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginBottom: 8,
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 5,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  imageOverlayText: {
    color: "white",
    fontSize: 12,
    textAlign: "center",
  },
  title: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    flexWrap: "wrap",
  },
  oldPrice: {
    textDecorationLine: "line-through",
    color: "#5e5c5cff",
    marginRight: 8,
    fontSize: 14,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
    marginRight: 8,
  },
  offer: {
    fontSize: 13,
    fontWeight: "600",
    color: "green",
  },
  subText: {
    fontSize: 14,
    color: "#gray",
    fontWeight:'500',
    marginVertical: 2,
  },
  subTex: {
    fontSize: 13,
    color: "#gray",
    fontWeight:'400',
    marginVertical: 2,
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  statusIndicator: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  carouselTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
    marginBottom: 4,
    color: "#5f5e5eff",
  },
  carouselImg: {
    width: 60,
    height: 60,
    marginRight: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedCarouselImg: {
    borderColor: "#2196F3",
    borderWidth: 2,
  },
  currentImageText: {
    position: "absolute",
    bottom: 0,
    right: 6,
    backgroundColor: "#2196F3",
    color: "white",
    fontSize: 10,
    paddingHorizontal: 4,
    borderRadius: 3,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  editBtn: {
    marginTop: 10,
    backgroundColor: "#2196F3",
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
    
  },
  editText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  btn: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
    minHeight: 40,
    justifyContent: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
    textAlign: "center",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 14,
    marginBottom: 15,
    textAlign: "center",
    color: "#666",
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  imageOption: {
    width: "48%",
    marginBottom: 15,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedImageOption: {
    borderColor: "#4CAF50",
  },
  modalImage: {
    width: "100%",
    height: 120,
  },
  currentSelection: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(76, 175, 80, 0.8)",
    padding: 3,
  },
  currentSelectionText: {
    color: "white",
    fontSize: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  closeButton: {
    backgroundColor: "#f44336",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 10,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default AllProducts;