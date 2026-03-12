//Controls the bottom tab navigation and tells the app which screens belong where 
import { Tabs } from 'expo-router';

import { IconSymbol } from '@/components/ui/icon-symbol';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol name="house.fill" color={color} size={22} />
          ),
        }}
      />

      <Tabs.Screen
        name="learn"
        options={{
          title: 'Learn',
          tabBarIcon: ({ color }) => (
            <IconSymbol name="book.fill" color={color} size={22} />
          ),
        }}
      />

      {/* IMPORTANT: this tab expects a file at app/(tabs)/translate.tsx */}
      <Tabs.Screen
        name="translate"
        options={{
          title: 'Translate',
          tabBarIcon: ({ color }) => (
            <IconSymbol name="globe" color={color} size={22} />
          ),
        }}
      />

      <Tabs.Screen
        name="games"
        options={{
          title: 'Games',
          tabBarIcon: ({ color }) => (
            <IconSymbol name="gamecontroller.fill" color={color} size={22} />
          ),
        }}
      />

      <Tabs.Screen
        name="social"
        options={{
          title: 'Social',
          tabBarIcon: ({ color }) => (
            <IconSymbol name="person.2.fill" color={color} size={22} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <IconSymbol name="person.crop.circle" color={color} size={22} />
          ),
        }}
      />
    </Tabs>
  );
}
