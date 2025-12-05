import React, { useState } from "react";
import useProductStore from "../../store/useProductStore.ts";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  FlatList,
  ActivityIndicator,
  Platform,
  PermissionsAndroid
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import userStore from "../../store/userStore.ts";
import { ADMIN } from '@env';

const AddProduct = () => {
  const navigation = useNavigation();
  const { addProduct, loading, uploadImage } = useProductStore();
const {user} = userStore()
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    oldPrice: "",
    offer: "",
    color: "",
    category: "",
    size: "",
    trendingDeal: "no",
    todayDeal: "no",
    rating:"1.0",
    carouselImages: [],
  });

  const [newImageUrl, setNewImageUrl] = useState("");
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [editingImageIndex, setEditingImageIndex] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  // Request camera permission for Android
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Camera Permission",
            message: "This app needs access to your camera to take photos.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  // Function to pick image from gallery
  const pickImage = async () => {
    try {
      const options = {
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 1000,
        maxWidth: 1000,
      };

      launchImageLibrary(options, async (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
          Alert.alert("Error", "Failed to pick image");
        } else if (response.assets && response.assets.length > 0) {
          const imageUri = response.assets[0].uri;
          
          // Upload image to server
          setUploading(true);
          try {
            const uploadedUrl = await uploadImage(imageUri);
            if (uploadedUrl) {
              const updatedImages = [...formData.carouselImages, uploadedUrl];
              setFormData({ ...formData, carouselImages: updatedImages });
            }
          } catch (error) {
            Alert.alert("Error", "Failed to upload image");
          }
          setUploading(false);
        }
      });
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  // Function to take photo with camera
  const takePhoto = async () => {
    try {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) {
        Alert.alert("Permission denied", "Camera permission is required to take photos");
        return;
      }

      const options = {
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 1000,
        maxWidth: 1000,
        saveToPhotos: true,
      };

      launchCamera(options, async (response) => {
        if (response.didCancel) {
          console.log('User cancelled camera');
        } else if (response.error) {
          console.log('Camera Error: ', response.error);
          Alert.alert("Error", "Failed to take photo");
        } else if (response.assets && response.assets.length > 0) {
          const imageUri = response.assets[0].uri;
          
          // Upload image to server
          setUploading(true);
          try {
            const uploadedUrl = await uploadImage(imageUri);
            if (uploadedUrl) {
              const updatedImages = [...formData.carouselImages, uploadedUrl];
              setFormData({ ...formData, carouselImages: updatedImages });
            }
          } catch (error) {
            Alert.alert("Error", "Failed to upload image");
          }
          setUploading(false);
        }
      });
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert("Error", "Failed to take photo");
    }
  };

  const handleAddImage = () => {
    if (newImageUrl.trim() === "") {
      Alert.alert("Error", "Please enter an image URL");
      return;
    }

    // Basic URL validation
    if (!newImageUrl.startsWith('http')) {
      Alert.alert("Error", "Please enter a valid image URL starting with http/https");
      return;
    }

    const updatedImages = [...formData.carouselImages, newImageUrl];
    setFormData({ ...formData, carouselImages: updatedImages });
    setNewImageUrl("");
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...formData.carouselImages];
    updatedImages.splice(index, 1);
    setFormData({ ...formData, carouselImages: updatedImages });
  };

  const handleEditImage = (index) => {
    setEditingImageIndex(index);
    setNewImageUrl(formData.carouselImages[index]);
    setImageModalVisible(true);
  };

  const handleUpdateImage = () => {
    if (newImageUrl.trim() === "") {
      Alert.alert("Error", "Please enter an image URL");
      return;
    }

    // Basic URL validation
    if (!newImageUrl.startsWith('http')) {
      Alert.alert("Error", "Please enter a valid image URL starting with http/https");
      return;
    }

    const updatedImages = [...formData.carouselImages];
    updatedImages[editingImageIndex] = newImageUrl;
    setFormData({ ...formData, carouselImages: updatedImages });
    setNewImageUrl("");
    setEditingImageIndex(null);
    setImageModalVisible(false);
  };

  const handleAdd = async () => {
    // Validate required fields
    if (!formData.title || !formData.price || !formData.category) {
      Alert.alert("Error", "Title, Price, and Category are required fields");
      return;
    }

    // Validate price is a valid number
    if (isNaN(parseFloat(formData.price))) {
      Alert.alert("Error", "Please enter a valid price");
      return;
    }

    // Validate oldPrice if provided
    if (formData.oldPrice && isNaN(parseFloat(formData.oldPrice))) {
      Alert.alert("Error", "Please enter a valid old price");
      return;
    }

    // Validate images
    if (formData.carouselImages.length === 0) {
      Alert.alert("Error", "Please add at least one product image");
      return;
    }

    // Prepare data for submission - match backend schema
    const addData = {
      title: formData.title.trim(),
      price: parseFloat(formData.price),
      oldPrice: formData.oldPrice ? parseFloat(formData.oldPrice) : 0,
      offer: formData.offer || "",
      color: formData.color || "",
      category: formData.category.trim(),
      size: formData.size || "",
      trendingDeal: formData.trendingDeal,
      todayDeal: formData.todayDeal,
        rating:formData.rating,
      carouselImages: formData.carouselImages
    };

    console.log("Final data being sent to store:", JSON.stringify(addData, null, 2));

    const success = await addProduct(addData);

    if (success) {
      Alert.alert("Success", "Product added successfully!");
      navigation.goBack();
    }
  };

  const renderCarouselImage = ({ item, index }) => (
    <View style={styles.imageItem}>
      <Image source={{ uri: item }} style={styles.thumbnail} />
      <View style={styles.imageActions}>
        <TouchableOpacity
          style={[styles.imageButton, styles.editButton]}
          onPress={() => handleEditImage(index)}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.imageButton, styles.deleteButton]}
          onPress={() => handleRemoveImage(index)}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionHeader}>Basic Information</Text>
      <TextInput
        style={styles.input}
        value={formData.title}
        onChangeText={(t) => handleChange("title", t)}
        placeholder="Product Title"
        placeholderTextColor={"gray"}
      />
      
     
      <Text style={styles.sectionHeader}>Total Pricing (orignal)</Text>
      <TextInput
        style={styles.input}
        value={formData.oldPrice}
        onChangeText={(t) => handleChange("oldPrice", t)}
        keyboardType="numeric"
        placeholder="Original Price (optional)"
        placeholderTextColor={"gray"}
      />
       <Text style={styles.sectionHeader}>After Discount Pricing</Text>
      <TextInput
        style={styles.input}
        value={formData.price}
        onChangeText={(t) => handleChange("price", t)}
        keyboardType="numeric"
        placeholder="Current Price"
        placeholderTextColor={"gray"}
      />
      <Text style={styles.sectionHeader}>Offer (optional)</Text>
      <TextInput
        style={styles.input}
        value={formData.offer}
        onChangeText={(t) => handleChange("offer", t)}
        placeholder="Offer Percentage (e.g., 25)"
        placeholderTextColor={"gray"}
      />

      <Text style={styles.sectionHeader}>Product Category</Text>
      <View>
        <Text style={{fontWeight: '500', fontSize: 13}}>Popular categories :</Text>
        <Text style={{marginBottom: 4, fontSize: 11}}>Men , Jewelery , Ladies , Home , Deals , Electronics , Mobiles , Fashion</Text>
      </View>
      <TextInput
        style={styles.input}
        value={formData.category}
        onChangeText={(t) => handleChange("category", t)}
        placeholder="Category"
        placeholderTextColor={"gray"}
      />
      <Text style={styles.sectionHeader}>Color</Text>
      <TextInput
        style={styles.input}
        value={formData.color}
        onChangeText={(t) => handleChange("color", t)}
        placeholder="Color"
        placeholderTextColor={"gray"}
      />
      <Text style={styles.sectionHeader}>Size</Text>
      <TextInput
        style={styles.input}
        value={formData.size}
        onChangeText={(t) => handleChange("size", t)}
        placeholder="Size"
        placeholderTextColor={"gray"}
      />

{
  user?.email === ADMIN && (
    <> 
 <Text style={styles.sectionHeader}>Deal Status</Text>
      <View style={styles.toggleContainer}>
        <Text>Trending Deal: </Text>
        <View style={styles.toggleGroup}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              formData.trendingDeal === "yes" && styles.toggleButtonActive
            ]}
            onPress={() => handleChange("trendingDeal", "yes")}
          >
            <Text style={formData.trendingDeal === "yes" && styles.toggleButtonTextActive}>
              Yes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              formData.trendingDeal === "no" && styles.toggleButtonActive
            ]}
            onPress={() => handleChange("trendingDeal", "no")}
          >
            <Text style={formData.trendingDeal === "no" && styles.toggleButtonTextActive}>
              No
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.toggleContainer}>
        <Text>Today's Deal: </Text>
        <View style={styles.toggleGroup}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              formData.todayDeal === "yes" && styles.toggleButtonActive
            ]}
            onPress={() => handleChange("todayDeal", "yes")}
          >
            <Text style={formData.todayDeal === "yes" && styles.toggleButtonTextActive}>
              Yes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              formData.todayDeal === "no" && styles.toggleButtonActive
            ]}
            onPress={() => handleChange("todayDeal", "no")}
          >
            <Text style={formData.todayDeal === "no" && styles.toggleButtonTextActive}>
              No
            </Text>
          </TouchableOpacity>
        </View>
      </View>
       </>
  )
}
     


      <Text style={styles.sectionHeader}>Product Images</Text>
      <Text style={styles.subHeader}>Images ({formData.carouselImages.length})</Text>
      
      {formData.carouselImages.length > 0 ? (
        <FlatList
          data={formData.carouselImages}
          renderItem={renderCarouselImage}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.imageList}
        />
      ) : (
        <Text style={styles.noImagesText}>No images added yet</Text>
      )}

      {/* Upload buttons */}
      <View style={styles.uploadButtonsContainer}>
        <TouchableOpacity style={styles.uploadButton} onPress={pickImage} disabled={uploading}>
          {uploading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.uploadButtonText}>Choose from Gallery</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.uploadButton} onPress={takePhoto} disabled={uploading}>
          <Text style={styles.uploadButtonText}>Take Photo</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.orText}>OR</Text>

      <View style={styles.addImageContainer}>
        <TextInput
          style={[styles.input, styles.flexGrow]}
          value={newImageUrl}
          onChangeText={setNewImageUrl}
          placeholder="Enter image URL"
          placeholderTextColor={"gray"}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={editingImageIndex !== null ? handleUpdateImage : handleAddImage}
        >
          <Text style={styles.addButtonText}>
            {editingImageIndex !== null ? "Update" : "Add"}
          </Text>
        </TouchableOpacity>
      </View>

      {editingImageIndex !== null && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => {
            setNewImageUrl("");
            setEditingImageIndex(null);
          }}
        >
          <Text style={styles.cancelButtonText}>Cancel Edit</Text>
        </TouchableOpacity>
      )}

      <View style={styles.saveButtonContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#2196F3" />
        ) : (
          <Button title="Add Product" onPress={handleAdd} />
        )}
      </View>

      <Modal
        visible={imageModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setImageModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Image URL</Text>
            <TextInput
              style={styles.input}
              value={newImageUrl}
              onChangeText={setNewImageUrl}
              placeholder="Enter image URL"
              placeholderTextColor={"gray"}
            />
            <View style={styles.modalButtons}>
              <Button title="Update" onPress={handleUpdateImage} />
              <Button title="Cancel" onPress={() => setImageModalVisible(false)} color="#999" />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    padding: 15,
    marginTop: 25,
    backgroundColor: '#fff',
    flex: 1,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 0,
    marginBottom: 10,
    color: "#333",
  },
  subHeader: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 15,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    justifyContent: "space-between",
  },
  toggleGroup: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  toggleButtonActive: {
    backgroundColor: "#2196F3",
  },
  toggleButtonTextActive: {
    color: "white",
    fontWeight: "bold",
  },
  imageList: {
    marginBottom: 15,
    maxHeight: 120,
  },
  imageItem: {
    marginRight: 15,
    alignItems: "center",
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 5,
  },
  imageActions: {
    flexDirection: "row",
  },
  imageButton: {
    padding: 5,
    borderRadius: 4,
    marginHorizontal: 2,
    minWidth: 50,
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#4CAF50",
  },
  deleteButton: {
    backgroundColor: "#f44336",
  },
  buttonText: {
    color: "white",
    fontSize: 12,
  },
  addImageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  flexGrow: {
    flex: 1,
    marginRight: 10,
    marginBottom: 0,
  },
  addButton: {
    backgroundColor: "#2196F3",
    padding: 12,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#ff9800",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  cancelButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  saveButtonContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  noImagesText: {
    textAlign: "center",
    color: "#999",
    marginVertical: 10,
    fontStyle: "italic",
  },
  uploadButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  uploadButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize:12
  },
  orText: {
    textAlign: 'center',
    marginVertical: 10,
    fontWeight: 'bold',
    color: '#666',
  },
});

export default AddProduct;
