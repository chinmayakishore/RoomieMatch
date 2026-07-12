import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import useCompatibility from '../hooks/useCompatibility';

function badgeColor(score) {
  if (score >= 85) return '#1D9E75';
  if (score >= 70) return '#534AB7';
  return '#F59E0B';
}

export default function ProfileCard({ profile, userProfile }) {
  const color = profile.color || '#EEEDFE';
  const emoji = profile.emoji || '🧑';
  const { score, reason, loading } = useCompatibility(userProfile, profile);

  return (
    <View style={styles.card}>
      <View style={[styles.avatarBox, { backgroundColor: color }]}>
        <Text style={styles.avatarEmoji}>{emoji}</Text>
        {score !== null && (
          <View style={[styles.scoreBadge, { backgroundColor: badgeColor(score) }]}>
            <Text style={styles.scoreBadgeText}>{score}% Match</Text>
          </View>
        )}
      </View>
      <View style={styles.body}>
        <Text style={styles.name}>{profile.name}{profile.age ? ', ' + profile.age : ''}</Text>
        <Text style={styles.sub}>{profile.role}</Text>
        <Text style={styles.sub}>{profile.location}</Text>
        <Text style={styles.budget}>{profile.budget}</Text>

        {loading && (
          <View style={styles.aiBox}>
            <ActivityIndicator size="small" color="#534AB7" style={styles.aiSpinner} />
            <Text style={styles.aiLoadingText}>Analyzing compatibility...</Text>
          </View>
        )}
        {!loading && reason ? (
          <View style={styles.aiBox}>
            <Text style={styles.aiLabel}>✨ AI Insight</Text>
            <Text style={styles.aiReason}>{reason}</Text>
          </View>
        ) : null}

        {profile.tags && profile.tags.length > 0 && (
          <View style={styles.tags}>
            {profile.tags.map((tag, i) => (
              <View key={i} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
        <Text style={styles.bio}>{profile.bio}</Text>
        <View style={styles.details}>
          {[['Lifestyle', profile.lifestyle], ['Smoking', profile.smoking], ['Pets', profile.pets]].filter(([, v]) => v).map(([label, value]) => (
            <View key={label} style={styles.detailRow}>
              <Text style={styles.detailLabel}>{label}</Text>
              <Text style={styles.detailValue}>{value}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 },
  avatarBox: { height: 180, alignItems: 'center', justifyContent: 'center' },
  avatarEmoji: { fontSize: 72 },
  scoreBadge: { position: 'absolute', bottom: 10, right: 10, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  scoreBadgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  body: { padding: 18 },
  name: { fontSize: 22, fontWeight: '600', color: '#1a1a1a' },
  sub: { fontSize: 14, color: '#666', marginTop: 3 },
  budget: { fontSize: 14, color: '#444', marginTop: 6, fontWeight: '500' },
  aiBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0eefe', borderRadius: 10, padding: 10, marginTop: 10, gap: 8 },
  aiSpinner: { flexShrink: 0 },
  aiLoadingText: { fontSize: 13, color: '#534AB7' },
  aiLabel: { fontSize: 12, fontWeight: '700', color: '#534AB7', flexShrink: 0 },
  aiReason: { flex: 1, fontSize: 13, color: '#333', lineHeight: 18 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 },
  tag: { backgroundColor: '#f0eefe', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  tagText: { fontSize: 12, color: '#534AB7', fontWeight: '500' },
  bio: { fontSize: 14, color: '#555', lineHeight: 21, marginTop: 12 },
  details: { marginTop: 14, borderTopWidth: 0.5, borderTopColor: '#e5e5e5', paddingTop: 12, gap: 8 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between' },
  detailLabel: { fontSize: 13, color: '#888' },
  detailValue: { fontSize: 13, color: '#333', fontWeight: '500' },
});
