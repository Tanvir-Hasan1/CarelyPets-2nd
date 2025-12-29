import AsyncStorage from '@react-native-async-storage/async-storage';

const RECENT_SEARCHES_KEY = '@recent_searches';

export const saveRecentSearch = async (query: string): Promise<string[]> => {
    if (!query || query.trim() === "") return await getRecentSearches();

    try {
        const stored = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
        let searches: string[] = stored ? JSON.parse(stored) : [];

        // Remove duplicate if exists
        searches = searches.filter(s => s.toLowerCase() !== query.toLowerCase());

        // Prepend new search
        searches.unshift(query);

        // Limit to 5
        if (searches.length > 5) {
            searches = searches.slice(0, 5);
        }

        await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
        return searches;
    } catch (err) {
        console.error("Error saving recent search:", err);
        return [];
    }
};

export const getRecentSearches = async (): Promise<string[]> => {
    try {
        const stored = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (err) {
        console.error("Error getting recent searches:", err);
        return [];
    }
};

export const clearRecentSearches = async () => {
    try {
        await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch (err) {
        console.error("Error clearing recent searches:", err);
    }
};
