import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import userStore from '../store/userStore.ts';

const ResetKeyScreen = ({ navigation }) => {
  const [code, setCode] = useState('');
  const { loading, reset} = userStore();


  const handleLogin = () => {
    if (!code) {
      Alert.alert('Error', 'Please enter code');
      return;
    }

    reset({code},navigation);
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
        }}
      >
        <Image
          style={styles.image}
          source={require('../assets/logo.png')}
          resizeMode="contain"
        />
        <Text style={{ marginTop: 10, fontSize: 16, color: '#555' }}>
          Loading...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.header}>
            <Image
              style={styles.image}
              source={require('../assets/logo.png')}
              resizeMode="contain"
            />
            <Text style={styles.title}>Enter PinCode</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Code</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your code"
                placeholderTextColor="#999"
                value={code}
                onChangeText={setCode}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>


            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Verifying...' : 'Verify'}
              </Text>
            </TouchableOpacity>

         
          </View>

         
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ResetKeyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    marginTop:40
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  formContainer: {
    paddingHorizontal: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: '#333',
  },
  loginButton: {
    backgroundColor: '#041E42',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },

});
