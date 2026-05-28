import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { supabase } from '../lib/supabase';

export default function ProfileScreen({ userProfile }) {
  const p = userProfile || {};

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>My Profile</Text>
      <View style={styles.avatarSection}>
        <View style={styles.avatar}><Text style={styles.avatarEmoji}>🧑</Text></View>
        <Text style={styles.name}>{p.name || 'Your Name'}</Text>
        <Text style={styles.sub}>{p.location || 'Your Location'} - {p.role || 'Your Role'}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>MY PREFERENCES</Text>
        {[['Budget', p.budget || '-'], ['Lifestyle', p.lifestyle || '-'], ['Pets', p.pets || '-'], ['Smoking', p.smoking || '-']].map(([label, value], i, arr) => (
          <View key={label} style={[styles.prefRow, i === arr.length - 1 && { borderBottomWidth: 0 }]}>
            <Text style={styles.prefLabel}>{label}</Text>
            <Text style={styles.prefValue}>{value}</Text>
          </View>
        ))}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ABOUT ME</Text>
        <Text style={styles.bio}>{p.bio || 'No bio yet.'}</Text>
      </View>
      <TouchableOpacity style={styles.signOutBtn} onPress={signOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f7ff' },
  content: { paddingBottom: 40 },
  header: { fontSize: 22, fontWeight: '700', color: '#534AB7', paddingTop: 56, paddingBottom: 20, paddingHorizontal: 20 },
  avatarSection: { alignItems: 'center', marginBottom: 24, gap: 6 },
  avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#EEEDFE', alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  avatarEmoji: { fontSize: 46 },
  name: { fontSize: 22, fontWeight: '600', color: '#1a1a1a' },
  sub: { fontSize: 14, color: '#888' },
  section: { backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 14, borderRadius: 16, padding: 16, borderWidth: 0.5, borderColor: '#e8e8e8' },
  sectionTitle: { fontSize: 11, fontWeight: '600', color: '#999', letterSpacing: 0.8, marginBottom: 12 },
  prefRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: '#f0f0f0' },
  prefLabel: { fontSize: 14, color: '#555' },
  prefValue: { fontSize: 14, fontWeight: '500', color: '#1a1a1a' },
  bio: { fontSize: 14, color: '#555', lineHeight: 22 },
  signOutBtn: { marginHorizontal: 16, marginTop: 8, padding: 16, borderRadius: 16, backgroundColor: '#fff', borderWidth: 0.5, borderColor: '#e8e8e8', alignItems: 'center' },
  signOutText: { fontSize: 15, color: '#E24B4A', fontWeight: '500' },
});