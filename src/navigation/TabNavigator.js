import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { supabase } from '../lib/supabase';
import DiscoverScreen from '../screens/DiscoverScreen';
import MatchesScreen from '../screens/MatchesScreen';
import ProfileScreen from '../screens/ProfileScreen';

const TABS = [
  { id: 'discover', label: 'Discover', icon: 'D' },
  { id: 'matches', label: 'Matches', icon: 'M' },
  { id: 'profile', label: 'Profile', icon: 'P' },
];

export default function TabNavigator({ userProfile }) {
  const [activeTab, setActiveTab] = useState('discover');
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    if (!userProfile?.id) return;
    loadMatches();
  }, [userProfile]);

  const loadMatches = async () => {
    const myId = userProfile.id;

    // Get matches where I swiped right
    const { data: sentMatches } = await supabase
      .from('matches')
      .select('id, matched_user_id, profiles!matches_matched_user_id_fkey(*)')
      .eq('user_id', myId);

    // Get matches where someone swiped right on me
    const { data: receivedMatches } = await supabase
      .from('matches')
      .select('id, user_id, profiles!matches_user_id_fkey(*)')
      .eq('matched_user_id', myId);

    const sent = (sentMatches || []).map(m => ({ matchId: m.id, profile: m.profiles }));
    const received = (receivedMatches || []).map(m => ({ matchId: m.id, profile: m.profiles }));
    const all = [...sent, ...received].filter(m => m.profile);
    const unique = all.filter((m, i, arr) => arr.findIndex(x => x.profile.id === m.profile.id) === i);
    setMatches(unique);
  };

  const handleMatch = async (profile) => {
    if (matches.find(m => m.profile.id === profile.id)) return;

    // Check if other user already swiped right on me first
    const { data: existing } = await supabase
      .from('matches')
      .select('id')
      .eq('user_id', profile.id)
      .eq('matched_user_id', userProfile.id)
      .single();

    if (existing) {
      // Reuse their match row instead of creating a new one
      setMatches(prev => [{ matchId: existing.id, profile }, ...prev]);
      return;
    }

    // Create new match row
    const { data, error } = await supabase
      .from('matches')
      .insert({ user_id: userProfile.id, matched_user_id: profile.id })
      .select()
      .single();
    if (error) { console.log('Error saving match:', error); return; }
    setMatches(prev => [{ matchId: data.id, profile }, ...prev]);
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'discover': return <DiscoverScreen onMatch={handleMatch} userProfile={userProfile} />;
      case 'matches': return <MatchesScreen matches={matches} currentUser={userProfile} />;
      case 'profile': return <ProfileScreen userProfile={userProfile} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.screenArea}>{renderScreen()}</View>
      <View style={styles.tabBar}>
        {TABS.map(tab => {
          const isActive = activeTab === tab.id;
          const showBadge = tab.id === 'matches' && matches.length > 0;
          return (
            <TouchableOpacity key={tab.id} style={styles.tab} onPress={() => setActiveTab(tab.id)} activeOpacity={0.7}>
              <View style={styles.iconWrapper}>
                <Text style={[styles.icon, isActive && styles.iconActive]}>{tab.icon}</Text>
                {showBadge && <View style={styles.badge}><Text style={styles.badgeText}>{matches.length}</Text></View>}
              </View>
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f7ff' },
  screenArea: { flex: 1 },
  tabBar: { flexDirection: 'row', backgroundColor: '#fff', borderTopWidth: 0.5, borderTopColor: '#e5e5e5', paddingBottom: 20 },
  tab: { flex: 1, alignItems: 'center', paddingTop: 10, paddingBottom: 4, gap: 3 },
  iconWrapper: { position: 'relative' },
  icon: { fontSize: 20, color: '#aaa' },
  iconActive: { color: '#534AB7' },
  tabLabel: { fontSize: 11, color: '#aaa' },
  tabLabelActive: { color: '#534AB7', fontWeight: '500' },
  badge: { position: 'absolute', top: -4, right: -8, backgroundColor: '#534AB7', borderRadius: 8, minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
  badgeText: { fontSize: 10, color: '#fff', fontWeight: '600' },
});