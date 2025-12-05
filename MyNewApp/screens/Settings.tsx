import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Switch,
  Alert,
  Linking,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import userStore from '../store/userStore';

const Settings = ({ navigation }) => {
  const { logout } = userStore();
  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Load settings from storage on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  // Save settings whenever they change
  useEffect(() => {
    saveSettings();
  }, [notifications, sound, darkMode]);

  const loadSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem('appSettings');
      if (settings) {
        const parsedSettings = JSON.parse(settings);
        setNotifications(parsedSettings.notifications ?? true);
        setSound(parsedSettings.sound ?? true);
        setDarkMode(parsedSettings.darkMode ?? false);
      }
    } catch (error) {
      console.log('Error loading settings:', error);
    }
  };

  const saveSettings = async () => {
    try {
      const settings = {
        notifications,
        sound,
        darkMode,
      };
      await AsyncStorage.setItem('appSettings', JSON.stringify(settings));
    } catch (error) {
      console.log('Error saving settings:', error);
    }
  };

  // Real Logout Functionality
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive", 
          onPress: () => {
            logout();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }
        }
      ]
    );
  };



  // Open Email for Support
  const handleSupport = () => {
    Linking.openURL('mailto:hammadp5087@gmail.com?subject=App Support&body=Hello, I need help with...')
      .catch(() => {
        Alert.alert("Error", "Could not open email app");
      });
  };

  // Open Play Store for Rating
  const handleRateApp = () => {
    // For Android - replace with your app's package name
    Linking.openURL('market://details?id=com.quizmaster.app')
      .catch(() => {
        // Fallback to web Play Store
        Linking.openURL('https://play.google.com/store/apps/details?id=com.quizmaster.app')
          .catch(() => {
            Alert.alert("Error", "Could not open app store");
          });
      });
  };





  // Menu Item Component
  const MenuItem = ({ icon, title, onPress, isSwitch = false, value, onValueChange, showArrow = true }) => (
    <TouchableOpacity 
      style={styles.menuItem} 
      onPress={!isSwitch ? onPress : undefined}
      disabled={isSwitch}
    >
      <View style={styles.menuLeft}>
        <Ionicons name={icon} size={24} color="#041E42" />
        <Text style={styles.menuText}>{title}</Text>
      </View>
      
      {isSwitch ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={value ? '#041E42' : '#f4f3f4'}
        />
      ) : showArrow && (
        <Ionicons name="chevron-forward" size={20} color="#666" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#041E42" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        
        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <MenuItem
            icon="notifications"
            title="Push Notifications"
            isSwitch={true}
            value={notifications}
            onValueChange={setNotifications}
            showArrow={false}
          />
          

          
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <MenuItem
            icon="help-circle"
            title="Help & Support"
            onPress={handleSupport}
          />
          
          <MenuItem
            icon="document-text"
            title="Privacy Policy"
            onPress={() => Linking.openURL('https://quizmaster.com/privacy')}
          />
          
          <MenuItem
            icon="shield-checkmark"
            title="Terms of Service"
            onPress={() => Linking.openURL('https://quizmaster.com/terms')}
          />
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <View style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="information-circle" size={24} color="#041E42" />
              <Text style={styles.menuText}>App Version</Text>
            </View>
            <Text style={styles.versionText}>1.0.0</Text>
          </View>

          <MenuItem
            icon="star"
            title="Rate App"
            onPress={handleRateApp}
          />

        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out" size={24} color="#FF3B30" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appName}>Quiz Master</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
          <Text style={styles.copyright}>© 2024 Quiz Master. All rights reserved.</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#041E42",
  },
  header: {
    backgroundColor: "#041E42",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
  },
  placeholder: {
    width: 24,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  section: {
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#041E42",
    marginHorizontal: 16,
    marginVertical: 12,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuText: {
    fontSize: 16,
    color: "#041E42",
    marginLeft: 12,
    flex: 1,
  },
  versionText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
  },
  logoutText: {
    color: "#FF3B30",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  appInfo: {
    alignItems: "center",
    padding: 20,
    marginTop: 10,
  },
  appName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#041E42",
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  copyright: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  },
});

export default Settings;