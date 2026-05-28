import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { supabase } from '../lib/supabase';

export default function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      let result;
      if (mode === 'signup') {
        result = await supabase.auth.signUp({ email, password });
      } else {
        result = await supabase.auth.signInWithPassword({ email, password });
      }
      if (result.error) throw result.error;
      onAuth(result.data.user);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Text style={styles.logo}>🏠</Text>
      <Text style={styles.title}>RoomieMatch</Text>
      <Text style={styles.subtitle}>{mode === 'signup' ? 'Create your account' : 'Welcome back'}</Text>

      <View style={styles.form}>
        <TextInput style={styles.input} placeholder='Email' placeholderTextColor='#aaa' value={email} onChangeText={setEmail} autoCapitalize='none' keyboardType='email-address' />
        <TextInput style={styles.input} placeholder='Password' placeholderTextColor='#aaa' value={password} onChangeText={setPassword} secureTextEntry />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TouchableOpacity style={styles.btn} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color='#fff' /> : <Text style={styles.btnText}>{mode === 'signup' ? 'Sign Up' : 'Sign In'}</Text>}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setMode(mode === 'signup' ? 'signin' : 'signup')}>
          <Text style={styles.toggle}>{mode === 'signup' ? 'Already have an account? Sign in' : 'No account? Sign up'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f7ff', alignItems: 'center', justifyContent: 'center', padding: 24 },
  logo: { fontSize: 64, marginBottom: 12 },
  title: { fontSize: 28, fontWeight: '700', color: '#534AB7', marginBottom: 6 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 32 },
  form: { width: '100%', gap: 12 },
  input: { backgroundColor: '#fff', borderRadius: 12, padding: 16, fontSize: 16, color: '#1a1a1a', borderWidth: 0.5, borderColor: '#e0e0e0' },
  btn: { backgroundColor: '#534AB7', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 4 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  toggle: { textAlign: 'center', color: '#534AB7', fontSize: 14, marginTop: 8 },
  error: { color: '#E24B4A', fontSize: 13, textAlign: 'center' },
});