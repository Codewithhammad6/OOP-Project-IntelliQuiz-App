import { create } from 'zustand';
import axiosInstance from '../utils/axiosInstance.ts';
import { Alert } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

const userStore = create((set) => ({
  user: null,
  loading: false,
  isAuth: false,
  
  //  Get logged-in user profile
  getUser: async () => {
    try {
      set({ loading: true });
      const { data } = await axiosInstance.get("/user/me");
      set({ 
        user: data.user, 
        isAuth: true,
      });
    } catch (error) {
      console.log(error?.response?.data?.message || "Failed to fetch user")
      set({ isAuth: false, user: null });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  //  Register user
  register: async (formData,navigation) => {
    try {
      set({ loading: true });
      const { data } = await axiosInstance.post("/user/register", formData);
   Alert.alert(
      "Success",
      "Registration successful, please verify your email",
      [
        {
          text: "OK",
          onPress: () => navigation.navigate("VerifyEmail"),
        },
      ]
    );
      return data;
    } catch (error) {
      Alert.alert(error?.response?.data?.message || "Registration failed");
      throw error;
    } finally {
      set({ loading: false });
    }
  },

 
  //  Login user
  login: async (formData) => {
    try {
      set({ loading: true });
      const { data } = await axiosInstance.post("/user/login", formData);


// Save token & user in local storage
    await AsyncStorage.setItem("token", data.token);
    await AsyncStorage.setItem("user", JSON.stringify(data.user));

console.log(data.token)

      set({
        user: data.user,
        isAuth: true,
      });

      Alert.alert("Login Successful");
      return data;
    } catch (error) {
      Alert.alert(error?.response?.data?.message || "Login failed");
      set({ isAuth: false });
      throw error;
    } finally {
      set({ loading: false });
    }
  },



// initAuth : async () => {
//   try {
//     const token = await AsyncStorage.getItem("token");
//     const storedUser = await AsyncStorage.getItem("user");
// console.log(token)
// console.log(storedUser)
//     if (token && storedUser) {
//       set({
//         user: JSON.parse(storedUser),
//         isAuth: true,
//       });
//     }
//   } catch (error) {
//     console.log("Auth init error:", error);
//   }
// },
 initAuth: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const storedUser = await AsyncStorage.getItem("user");

      console.log("🔐 Token from storage:", token ? "Exists" : "Missing");
      console.log("👤 User from storage:", storedUser ? "Exists" : "Missing");

      if (token && storedUser) {
        console.log("✅ Token and user found in storage");
        
        // DIRECTLY SET AUTH FROM STORAGE WITHOUT API CALL
        try {
          const userData = JSON.parse(storedUser);
          set({
            user: userData,
            isAuth: true,
          });
          console.log("🚀 User authenticated from storage:", userData.email);
          
        } catch (parseError) {
          console.log("❌ Error parsing stored user:", parseError);
          await this.clearStorage();
          set({ isAuth: false, user: null });
        }
      } else {
        console.log("❌ No token or user found in storage");
        set({ isAuth: false, user: null });
      }
    } catch (error) {
      console.log("🔥 Auth init error:", error);
      set({ isAuth: false, user: null });
    }
  },

//forgot password
forgot: async (email,navigation) => {
    try {
      set({ loading: true });
      const { data } = await axiosInstance.post("/user/forgot", email);
   Alert.alert(
      "Success",
      "Please verify your email",
      [
        {
          text: "OK",
          onPress: () => navigation.replace("Reset"),
        },
      ]
    );
      return data;
    } catch (error) {
      Alert.alert(error?.response?.data?.message || "Forgot failed");
      set({ isAuth: false });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

//reset key
reset: async (code,navigation) => {
    try {
      set({ loading: true });
      const { data } = await axiosInstance.post("/user/verify", code);
Alert.alert(
      "Success",
      "verified successfully",
      [
        {
          text: "OK",
          onPress: () => navigation.replace("NewPassword",code),
        },
      ]
    );
      return data;
    } catch (error) {
      Alert.alert(error?.response?.data?.message || "Reset failed");
      set({ isAuth: false });
      throw error;
    } finally {
      set({ loading: false });
    }
  },




// In your userStore.ts - Fix the Verify function
Verify: async (code, navigation) => {
  try {
    set({ loading: true });
    
    // Send the code in the request body properly
    const { data } = await axiosInstance.post("/user/verifyEmail", code);
    
    //  Save token & user in AsyncStorage
    await AsyncStorage.setItem("token", data.token);
    await AsyncStorage.setItem("user", JSON.stringify(data.user));
    
    // Update state
    set({ 
      user: data.user, 
      isAuth: true 
    });
    // Show success alert and navigate
    Alert.alert(
      "Success",
      "Email verified successfully!",
      [
        {
          text: "OK",
          onPress: () => {
            console.log("Navigating to Home");
            navigation.navigate('Home');
          }
        },
      ]
    );
    
    return data;
  } catch (error) {
    console.log("Verification error:", error);
    Alert.alert("Error", error?.response?.data?.message || "Verification failed");
    throw error;
  } finally {
    set({ loading: false });
  }
},







//sendNew password
newPassword: async (password,code,navigation) => {
    try {
      set({ loading: true });
      const { data } = await axiosInstance.post("/user/newpassword", {password,code});
Alert.alert(
      "Success",
      "Change successfully",
      [
        {
          text: "OK",
          onPress: () => navigation.replace("Login"),
        },
      ]
    );
      return data;
    } catch (error) {
      Alert.alert(error?.response?.data?.message || "NewPassword failed");
      set({ isAuth: false });
      throw error;
    } finally {
      set({ loading: false });
    }
  },










  //  Logout user
  logout: async () => {
    try {
      set({ loading: true });
      await axiosInstance.get("/user/logout", { withCredentials: true });
  
      await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");

      set({
        user: null,
        isAuth: false,
      });

      Alert.alert("Logout Successful");
    } catch (error: any) {
      console.error("Logout error:", error);
      Alert.alert(error?.response?.data?.message || "Logout failed");
      set({ user: null, isAuth: false });
    } finally {
      set({ loading: false });
    }
  },







  //  quiz result user
quizResult: async (formData) => {
  console.log('Saving quiz result:', formData);
  try {
    set({ loading: true });
    const { data } = await axiosInstance.post("/user/quizResult", formData);
    console.log('Quiz result saved successfully:', data);
    return data;
  } catch (error) {
    const errorMessage = error?.response?.data?.message || "Result saving failed";
    console.log('Quiz result save error:', errorMessage);
    Alert.alert("Error", errorMessage);
    throw error;
  } finally {
    set({ loading: false });
  }
},



updateUser: async (formData) => {
    try {
      set({ loading: true });
      const { data } = await axiosInstance.put("/user/update", formData);
      set({ user: data.user });
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      Alert.alert(error?.response?.data?.message || "Profile update failed");
      throw error;
    } finally {
      set({ loading: false });
    }
  },

}));





export default userStore;
