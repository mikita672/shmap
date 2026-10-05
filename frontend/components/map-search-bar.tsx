import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Pressable,
  FlatList,
  Keyboard,
  ActivityIndicator,
  type TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@/lib/icons";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar } from "@/components/ui/avatar";
import { useProfile } from "@/hooks/useProfile";
import { useGeocoding } from "@/hooks/useGeocoding";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import type { SearchPlace } from "@/lib/api/geocoding";

const AVATAR_RING_WIDTH = 3;
const ENTER_KEY_BLUR_DELAY_MS = 300;

interface MapSearchBarProps {
  mapCenter?: { lat: number; lon: number };
  onPlaceSelect: (place: SearchPlace) => void;
  onClear?: () => void;
  query: string;
  onQueryChange: (text: string) => void;
  onAvatarPress?: () => void;
}

export function MapSearchBar({
  mapCenter,
  onPlaceSelect,
  onClear,
  query,
  onQueryChange,
  onAvatarPress,
}: MapSearchBarProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [searchBarHeight, setSearchBarHeight] = useState<number>(48);
  const { data: profile } = useProfile();

  const handleAvatarPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onAvatarPress) {
      onAvatarPress();
    } else {
      router.push("/profile" as any);
    }
  }, [onAvatarPress, router]);

  const { results, isSearching, searchNow } = useGeocoding(
    query,
    mapCenter,
    isFocused,
  );
  const { history, addPlace, removePlace, clearAll } = useSearchHistory();
  const submitIdRef = useRef(0);

  const showDropdown = isFocused;
  const showHistory =
    isFocused && query.trim().length < 2 && history.length > 0;
  const showResults = isFocused && query.trim().length >= 2;

  const handleSelect = useCallback(
    (place: SearchPlace, { fromEnterKey = false } = {}) => {
      onQueryChange(place.name);
      setIsFocused(false);
      if (fromEnterKey) {
        setTimeout(Keyboard.dismiss, ENTER_KEY_BLUR_DELAY_MS);
      } else {
        Keyboard.dismiss();
      }
      addPlace(place);
      onPlaceSelect(place);
    },
    [addPlace, onPlaceSelect, onQueryChange],
  );

  const handleChangeText = useCallback(
    (text: string) => {
      submitIdRef.current++;
      onQueryChange(text);
    },
    [onQueryChange],
  );

  const handleSubmit = useCallback(async () => {
    const submitId = ++submitIdRef.current;
    let places: SearchPlace[];
    try {
      places = await searchNow();
    } catch {
      return;
    }
    // Ignore if the user edited the text or closed the search in the meantime
    if (submitId !== submitIdRef.current || places.length === 0) return;
    handleSelect(places[0], { fromEnterKey: true });
  }, [searchNow, handleSelect]);

  const handleClear = useCallback(() => {
    onQueryChange("");
    inputRef.current?.focus();
    onClear?.();
  }, [onQueryChange, onClear]);

  const handleDismiss = useCallback(() => {
    submitIdRef.current++;
    setIsFocused(false);
    Keyboard.dismiss();
  }, []);

  const renderResultItem = ({ item }: { item: SearchPlace }) => (
    <Pressable
      className="flex-row items-center px-4 py-3 active:bg-black/5"
      onPress={() => handleSelect(item)}
    >
      <Ionicons
        name="location-outline"
        size={18}
        className="text-on-surface-muted mr-3"
      />
      <View className="flex-1 mr-2">
        <Text className="text-on-surface text-sm font-medium" numberOfLines={1}>
          {item.name}
        </Text>
        {item.displayName !== item.name && (
          <Text className="text-on-surface-muted text-xs" numberOfLines={1}>
            {item.displayName}
          </Text>
        )}
      </View>
    </Pressable>
  );

  const renderHistoryItem = ({ item }: { item: SearchPlace }) => (
    <Pressable
      className="flex-row items-center px-4 py-3 active:bg-black/5"
      onPress={() => handleSelect(item)}
    >
      <Ionicons
        name="time-outline"
        size={18}
        className="text-on-surface-muted mr-3"
      />
      <View className="flex-1 mr-2">
        <Text className="text-on-surface text-sm font-medium" numberOfLines={1}>
          {item.name}
        </Text>
        {item.displayName !== item.name && (
          <Text className="text-on-surface-muted text-xs" numberOfLines={1}>
            {item.displayName}
          </Text>
        )}
      </View>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onPress={() => removePlace(item.id)}
        accessibilityLabel={`Remove ${item.name} from history`}
      >
        <Ionicons name="close" size={16} className="text-on-surface-muted" />
      </Button>
    </Pressable>
  );

  return (
    <>
      <View
        className="absolute left-4 right-4 z-10"
        style={{ top: Math.max(insets.top, 8) + 8 }}
      >
        <View className="flex-row items-center gap-2.5">
          <Pressable
            onPress={handleAvatarPress}
            style={{ height: searchBarHeight, width: searchBarHeight }}
            className="rounded-full overflow-hidden bg-searchbar shadow-sm shadow-black/10 elevation-3 items-center justify-center active:scale-95 transition-transform"
            accessibilityLabel="Open profile and settings"
            accessibilityRole="button"
          >
            <Avatar
              size="lg"
              uri={profile?.avatarUrl}
              fallbackText={
                profile ? `${profile.firstName} ${profile.lastName}` : undefined
              }
              fallbackIcon={true}
              style={{
                width: searchBarHeight - AVATAR_RING_WIDTH * 2,
                height: searchBarHeight - AVATAR_RING_WIDTH * 2,
              }}
              className="border-0 bg-searchbar"
              iconClassName="text-searchbar-placeholder"
              textClassName="text-searchbar-placeholder"
            />
          </Pressable>

          <View
            onLayout={(e) => {
              const h = Math.round(e.nativeEvent.layout.height);
              if (h > 0 && h !== searchBarHeight) {
                setSearchBarHeight(h);
              }
            }}
            className="flex-1 h-12 flex-row items-center bg-searchbar rounded-full shadow-sm shadow-black/10 elevation-3 px-3"
          >
            <Ionicons
              name="search"
              size={20}
              className="text-searchbar-placeholder mr-2"
            />
            <Input
              ref={inputRef}
              value={query}
              onChangeText={handleChangeText}
              onFocus={() => setIsFocused(true)}
              placeholder="Search places..."
              returnKeyType="search"
              submitBehavior="submit"
              onSubmitEditing={handleSubmit}
              autoCorrect={false}
              className="flex-1 border-0 bg-transparent shadow-none h-full py-0 text-on-surface placeholder:text-searchbar-placeholder"
            />
            {isSearching && <ActivityIndicator size="small" className="mr-2" />}
            {query.length > 0 && !isSearching && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onPress={handleClear}
                accessibilityLabel="Clear search"
              >
                <Ionicons
                  name="close-circle"
                  size={20}
                  className="text-searchbar-placeholder"
                />
              </Button>
            )}
          </View>
        </View>

        {showDropdown && (showHistory || showResults) && (
          <View className="bg-surface rounded-2xl mt-1 shadow-sm shadow-black/10 elevation-3 max-h-64 overflow-hidden">
            {showHistory && (
              <>
                <View className="flex-row items-center justify-between px-4 pt-3 pb-1">
                  <Text className="text-on-surface-muted text-xs font-semibold uppercase tracking-wide">
                    Recent
                  </Text>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2"
                    onPress={clearAll}
                  >
                    <Text className="text-on-surface-muted text-xs">Clear</Text>
                  </Button>
                </View>
                <Separator className="mb-1" />
                <FlatList
                  data={history}
                  keyExtractor={(item) => item.id}
                  renderItem={renderHistoryItem}
                  keyboardShouldPersistTaps="handled"
                  ItemSeparatorComponent={Separator}
                />
              </>
            )}

            {showResults && results.length > 0 && (
              <FlatList
                data={results}
                keyExtractor={(item) => item.id}
                renderItem={renderResultItem}
                keyboardShouldPersistTaps="handled"
                ItemSeparatorComponent={Separator}
              />
            )}

            {showResults && !isSearching && results.length === 0 && (
              <View className="px-4 py-6 items-center">
                <Ionicons
                  name="search-outline"
                  size={24}
                  className="text-on-surface-muted mb-2"
                />
                <Text className="text-on-surface-muted text-sm">
                  No results found
                </Text>
              </View>
            )}
          </View>
        )}
      </View>

      {showDropdown && (
        <Pressable
          className="absolute inset-0 z-[5]"
          onPress={handleDismiss}
          accessibilityLabel="Dismiss search"
        />
      )}
    </>
  );
}
