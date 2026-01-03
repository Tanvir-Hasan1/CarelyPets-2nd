import SearchIcon from "@/assets/images/icons/search.svg";
import Header from "@/components/ui/Header";
import { Spacing } from "@/constants/colors";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const mockChats = [
  {
    id: '1',
    name: 'John Wick',
    lastMessage: 'Hello Dave, How are you?',
    time: '1 hour ago',
    status: 'sent',
    avatar: 'https://i.pravatar.cc/150?u=1',
  },
  {
    id: '2',
    name: 'Savannah Nguyen',
    lastMessage: 'Hello Dave, How are you?',
    time: '1 hour ago',
    status: 'delivered',
    avatar: 'https://i.pravatar.cc/150?u=2',
  },
  {
    id: '3',
    name: 'Arlene McCoy',
    lastMessage: 'Hello Dave, How are you?',
    time: '1 hour ago',
    status: 'read',
    avatar: 'https://i.pravatar.cc/150?u=3',
  },
  {
    id: '4',
    name: 'Eleanor Pena',
    lastMessage: 'Hello Dave, How are you?',
    time: '1 hour ago',
    unreadCount: 12,
    avatar: 'https://i.pravatar.cc/150?u=4',
  },
  {
    id: '5',
    name: 'Eleanor Pena',
    lastMessage: 'Hello Dave, How are you?',
    time: '1 hour ago',
    status: 'blocked',
    avatar: 'https://i.pravatar.cc/150?u=5',
  },
];

const FilterChip = ({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) => (
  <TouchableOpacity
    style={[styles.filterChip, active && styles.filterChipActive]}
    onPress={onPress}
  >
    <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>{label}</Text>
  </TouchableOpacity>
);

const ChatItem = ({ item, onPress }: { item: typeof mockChats[0]; onPress: () => void }) => {
  const renderStatus = () => {
    if (item.unreadCount) {
      return (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{item.unreadCount}</Text>
        </View>
      );
    }
    if (item.status === 'blocked') {
      return <View style={styles.blockedIcon}><Text style={{ color: '#E53935' }}>🚫</Text></View>;
    }
    if (item.status === 'sent') {
      return <Text style={styles.statusCheck}>✓</Text>;
    }
    if (item.status === 'delivered') {
      return <Text style={styles.statusCheck}>✓✓</Text>;
    }
    if (item.status === 'read') {
      return <Text style={[styles.statusCheck, { color: '#1DAFB6' }]}>✓✓</Text>;
    }
    return null;
  };

  return (
    <TouchableOpacity style={styles.chatItem} onPress={onPress}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={[styles.time, item.unreadCount ? styles.timeUnread : item.status === 'blocked' ? styles.timeBlocked : null]}>
            {item.time}
          </Text>
        </View>
        <View style={styles.chatFooter}>
          <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage}</Text>
          {renderStatus()}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function ChatScreen() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const filteredChats = mockChats.filter(chat => {
    const matchesSearch = chat.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      activeFilter === 'All' ? true :
        activeFilter === 'Unread' ? !!chat.unreadCount :
          activeFilter === 'Blocked' ? chat.status === 'blocked' : true;

    return matchesSearch && matchesFilter;
  });

  return (
    <View style={styles.container}>
      <Header title="Chat" showBackButton={false} />

      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <SearchIcon width={25} height={25} style={styles.searchIcon} />
          <TextInput
            placeholder="Search or start new chat"
            style={styles.searchInput}
            placeholderTextColor="#9EA3AE"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.filterContainer}>
        <FilterChip label="All" active={activeFilter === 'All'} onPress={() => setActiveFilter('All')} />
        <FilterChip label="Unread" active={activeFilter === 'Unread'} onPress={() => setActiveFilter('Unread')} />
        <FilterChip label="Blocked" active={activeFilter === 'Blocked'} onPress={() => setActiveFilter('Blocked')} />
      </View>

      <FlatList
        data={filteredChats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatItem
            item={item}
            onPress={() => router.push({
              pathname: "/chat/[id]",
              params: { id: item.id, name: item.name, avatar: item.avatar }
            })}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 50 }}>
            <Text style={{ color: '#9EA3AE' }}>No chats found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  searchContainer: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: Spacing.md,
    height: 50,
    borderWidth: 1,
    borderColor: '#EDEFF2',
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EDEFF2',
  },
  filterChipActive: {
    backgroundColor: '#B2EBF2',
    borderColor: '#B2EBF2',
  },
  filterChipText: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#006064',
  },
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: 100,
  },
  chatItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: Spacing.md,
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  time: {
    fontSize: 12,
    color: '#6B7280',
  },
  timeUnread: {
    color: '#1DAFB6',
  },
  timeBlocked: {
    color: '#E53935',
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: '#4B5563',
    flex: 1,
    marginRight: 8,
  },
  statusCheck: {
    fontSize: 12,
    color: '#6B7280',
  },
  unreadBadge: {
    backgroundColor: '#B2EBF2',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#006064',
  },
  blockedIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
