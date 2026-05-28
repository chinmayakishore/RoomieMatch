import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import ChatScreen from './ChatScreen';

export default function MatchesScreen({ matches, currentUser }) {
  const [activeChat, setActiveChat] = useState(null);

  if (activeChat) {
    return (
      <ChatScreen
        profile={activeChat.profile}
        currentUser={currentUser}
        matchId={activeChat.matchId}
        onBack={() => setActiveChat(null)}
      />
    );
  }

  if (matches.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No matches yet</Text>
        <Text style={styles.emptySub}>Start swiping to find your roommate</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Matches</Text>
      <FlatList data={matches} keyExtractor={(item) => item.profile.id} contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.matchItem} activeOpacity={0.7} onPress={() => setActiveChat(item)}>
            <View style={[styles.avatar, { backgroundColor: item.profile.color || '#EEEDFE' }]}>
              <Text style={styles.avatarEmoji}>{item.profile.emoji || '🧑'}</Text>
            </View>
            <View style={styles.info}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{item.profile.name}</Text>
                <View style={styles.badge}><Text style={styles.badgeText}>Matched</Text></View>
              </View>
              <Text style={styles.sub}>{item.profile.role}</Text>
              <Text style={styles.sub}>{item.profile.location} - {item.profile.budget}</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f7ff' },
  header: { fontSize: 22, fontWeight: '700', color: '#534AB7', paddingTop: 56, paddingBottom: 16, paddingHorizontal: 20 },
  list: { paddingHorizontal: 16, gap: 10 },
  matchItem: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 16, padding: 14, alignItems: 'center', gap: 14, borderWidth: 0.5, borderColor: '#e8e8e8' },
  avatar: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  avatarEmoji: { fontSize: 26 },
  info: { flex: 1, gap: 3 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { fontSize: 16, fontWeight: '600', color: '#1a1a1a' },
  badge: { backgroundColor: '#EEEDFE', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  badgeText: { fontSize: 11, color: '#534AB7', fontWeight: '500' },
  sub: { fontSize: 13, color: '#666' },
  arrow: { fontSize: 22, color: '#ccc' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f7ff', gap: 10 },
  emptyTitle: { fontSize: 20, fontWeight: '600', color: '#1a1a1a' },
  emptySub: { fontSize: 14, color: '#888' },
});