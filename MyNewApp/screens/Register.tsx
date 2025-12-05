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
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import userStore from '../store/userStore.ts';

const Register = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [currentStep, setCurrentStep] = useState(0);

  const {loading, register} = userStore();

  const handleRegister = () => {
    if (!name || !email || !password || !confirmPassword || !role) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    if (role === 'student' && !rollNumber) {
      Alert.alert('Error', 'Please enter your roll number');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    register({name,role,rollNumber, email, password}, navigation);
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          {currentStep === 0 && (

         
  <ScrollView
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Image
          style={styles.image}
          source={require('../assets/logo.png')}
          resizeMode="contain"
        />
        <Text style={styles.title}>Select Your Role</Text>
        <Text style={styles.subtitle}>Join us today</Text>
      </View>

      <View style={styles.roleContainer}>
        <TouchableOpacity onPress={() => setRole('student')}>
        <View style={[
          styles.roleOption, 
          { backgroundColor: role === 'student' ? '#041E42' : '#fff',paddingHorizontal: 110 }
        ]}>
            <Text style={[
              styles.roleText, 
              { color: role === 'student' ? '#fff' : '#041E42' }
            ]}>
              Student
            </Text>
        </View>
          </TouchableOpacity>
        
          <TouchableOpacity onPress={() => setRole('teacher')}>
        <View style={[
          styles.roleOption, 
          { backgroundColor: role === 'teacher' ? '#041E42' : '#fff' ,paddingHorizontal: 110 }
        ]}>
            <Text style={[
              styles.roleText, 
              { color: role === 'teacher' ? '#fff' : '#041E42' }
            ]}>
              Teacher
            </Text>
        </View>
          </TouchableOpacity>

          {role && (
            <TouchableOpacity onPress={() => setCurrentStep(1)}>
              <Text style={{ color: '#fff', fontSize: 16, marginTop: 20, backgroundColor: '#43A1DB', padding: 10, borderRadius: 5 ,paddingHorizontal: 30}}>Next</Text>
            </TouchableOpacity>
          )}

      </View>
    </ScrollView>
       )}
          {currentStep === 1 && (
    <ScrollView 
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <Image
                style={styles.image}
                source={require('../assets/logo.png')}
                resizeMode="contain"
              />
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join us today</Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your full name"
                  placeholderTextColor="#999"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
              </View>
            

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                />
              </View>
              {role === 'student' && (
<>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Roll Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your roll number"
                  placeholderTextColor="#999"
                  value={rollNumber}
                  onChangeText={setRollNumber}
                  keyboardType="default"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                />
              </View>

            
              </>
)}
  

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  returnKeyType="next"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm your password"
                  placeholderTextColor="#999"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  returnKeyType="done"
                  onSubmitEditing={handleRegister}
                />
              </View>

              <TouchableOpacity 
                style={[styles.loginButton, loading && styles.disabledButton]} 
                onPress={handleRegister}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'Creating account...' : 'Register'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.signUpText}>Login</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
          )}


        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 20,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
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
   roleContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  roleOption: {
    marginBottom: 10,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#041E42',
  },
  roleText: {
    paddingTop: 20,
    flex:1,
    width: '100%',
    fontSize: 18,
    fontWeight: '600',
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
  disabledButton: {
    backgroundColor: '#7d9cc9',
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
    marginBottom: 20,
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  signUpText: {
    color: '#041E42',
    fontSize: 14,
    fontWeight: 'bold',
  },
});