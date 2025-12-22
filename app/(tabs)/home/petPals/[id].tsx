import FeedItem from '@/components/accounts/profile/FeedItem';
import PetPalInfo from '@/components/home/petPals/PetPalInfo';
import PetPalPetList from '@/components/home/petPals/PetPalPetList';
import PetPalPhotoGrid from '@/components/home/petPals/PetPalPhotoGrid';
import PetPalProfileHeader from '@/components/home/petPals/PetPalProfileHeader';
import PetPalTabSwitcher, { PetPalTab } from '@/components/home/petPals/PetPalTabSwitcher';
import Header from '@/components/ui/Header';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useLayoutEffect, useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, View } from 'react-native';

const MOCK_PALS_DATA: Record<string, any> = {
    '1': {
        name: 'Kesha Saha',
        location: 'California, USA',
        cover: 'https://images.unsplash.com/photo-1518331483807-f639071f3dd5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=60',
        posts: [
            {
                id: 1,
                userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=60',
                userName: 'Kesha Saha',
                actionText: 'updated her profile picture',
                timeAgo: '1h ago',
                contentImage: 'https://images.unsplash.com/photo-1518331483807-f639071f3dd5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                likesCount: '1.2 K',
                commentsCount: '1.2 K',
                sharesCount: '1.2 K'
            },
            {
                id: 2,
                userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=60',
                userName: 'Kesha Saha',
                actionText: 'updated her cover photo',
                timeAgo: '1h ago',
                contentImage: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                likesCount: '1.2 K',
                commentsCount: '1.2 K',
                sharesCount: '1.2 K'
            }
        ],
        photos: [
            {
                uri: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop',
                userName: 'John Wick',
                dateText: 'MON AT 6:06 PM',
                caption: 'He is very diligent pet, save you whatever the situation',
                likesCount: '1.2 K',
                commentsCount: '1.2 K',
                sharesCount: '1.2 K'
            },
            {
                uri: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&auto=format&fit=crop',
                userName: 'John Wick',
                dateText: 'TUE AT 2:15 PM',
                caption: 'Playtime at the park is always the best part of the day!',
                likesCount: '850',
                commentsCount: '45',
                sharesCount: '12'
            },
            {
                uri: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=400&auto=format&fit=crop',
                userName: 'John Wick',
                dateText: 'WED AT 10:30 AM',
                caption: 'Someone is waiting for treats...',
                likesCount: '2.1 K',
                commentsCount: '156',
                sharesCount: '89'
            },
            {
                uri: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&auto=format&fit=crop',
                userName: 'John Wick',
                dateText: 'THU AT 4:00 PM',
                caption: 'Nap time sequence initiated.',
                likesCount: '1.5 K',
                commentsCount: '92',
                sharesCount: '34'
            },
            {
                uri: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=400&auto=format&fit=crop',
                userName: 'John Wick',
                dateText: 'FRI AT 8:20 PM',
                caption: 'Gazing at the sunset with my best pal.',
                likesCount: '3.2 K',
                commentsCount: '245',
                sharesCount: '120'
            },
            {
                uri: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&auto=format&fit=crop',
                userName: 'John Wick',
                dateText: 'SAT AT 12:00 PM',
                caption: 'Weekend vibes are officially here!',
                likesCount: '1.1 K',
                commentsCount: '67',
                sharesCount: '22'
            },
        ],
        pets: [
            { id: 'p1', name: 'Buddy', gender: 'Female', breed: 'Persian Cat', age: '2 years old', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&auto=format&fit=crop' },
            { id: 'p2', name: 'Buddy', gender: 'Male', breed: 'Persian Cat', age: '2 years old', image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&auto=format&fit=crop' },
            { id: 'p3', name: 'Buddy', gender: 'Female', breed: 'Persian Cat', age: '2 years old', image: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=400&auto=format&fit=crop' },
            { id: 'p4', name: 'Buddy', gender: 'Male', breed: 'Persian Cat', age: '2 years old', image: 'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?w=400&auto=format&fit=crop' },
        ]
    }
};

const PetPalProfileScreen = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState<PetPalTab>('Posts');
    const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    // Default to mock data if ID not found, using '1' as fallback
    const palData = MOCK_PALS_DATA[id] || MOCK_PALS_DATA['1'];

    const renderContent = () => {
        switch (activeTab) {
            case 'Posts':
                return palData.posts.map((post: any) => (
                    <FeedItem
                        key={post.id}
                        postId={post.id}
                        userAvatar={post.userAvatar}
                        userName={post.userName}
                        actionText={post.actionText}
                        timeAgo={post.timeAgo}
                        contentImage={post.contentImage}
                        likesCount={post.likesCount}
                        commentsCount={post.commentsCount}
                        sharesCount={post.sharesCount}
                        isDropdownVisible={activeDropdownId === post.id}
                        onToggleDropdown={() => {
                            setActiveDropdownId(activeDropdownId === post.id ? null : post.id);
                        }}
                        onCloseDropdown={() => setActiveDropdownId(null)}
                        onEditPost={() => { }}
                        onDeletePost={() => { }}
                    />
                ));
            case 'Photos':
                return <PetPalPhotoGrid photos={palData.photos} />;
            case 'My Pets':
                return <PetPalPetList pets={palData.pets} />;
            default:
                return null;
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Header title="Pet Pals" showActions />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <PetPalProfileHeader
                    coverUri={palData.cover}
                    avatarUri={palData.avatar}
                />

                <PetPalInfo
                    name={palData.name}
                    location={palData.location}
                    onMessagePress={() => console.log('Message pressed')}
                />

                <PetPalTabSwitcher
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />

                <View style={styles.tabContent}>
                    {renderContent()}
                </View>

                {/* Bottom spacing for balance */}
                <View style={{ height: 70 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        flexGrow: 1,
    },
    tabContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    }
});

export default PetPalProfileScreen;
