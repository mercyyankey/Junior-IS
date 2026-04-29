// Implements the Home screen.
import React, { useMemo, useState } from 'react';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type ProgressState = {
  daysThisWeek: number;
  streakDays: number;
  wordsPracticed: number;
  gamesPlayed: number;
};

type VocabItem = {
  twi: string;
  english: string;
  definition?: string;
  exampleTwi: string;
  exampleEnglish: string;
};

const HOME_DAILY_WORDS: VocabItem[] = [
  {
    twi: 'Herh',
    english: 'An exclamation (wow/hey/oh really?)',
    definition:
      'A versatile Ghanaian exclamation used to express surprise, shock, admiration, or disbelief.',
    exampleTwi: 'Herh! bra ha.',
    exampleEnglish: 'Hey! Come here.',
  },
  {
    twi: 'Ɛyɛ',
    english: 'It is good / Okay',
    definition: 'Used to agree, confirm, or say something is fine or acceptable.',
    exampleTwi: 'Ɛyɛ, yɛbɛhyia bio.',
    exampleEnglish: 'Okay, we will meet again.',
  },
  {
    twi: 'Mepa wo kyɛw',
    english: 'Please',
    definition: 'A polite phrase used to ask for something or soften a request.',
    exampleTwi: 'Mepa wo kyɛw, boa me kakra.',
    exampleEnglish: 'Please, help me a little.',
  },
];

const DEMO_PROGRESS: ProgressState = {
  daysThisWeek: 3,
  streakDays: 2,
  wordsPracticed: 12,
  gamesPlayed: 4,
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function getDailyIndex(len: number) {
  const today = new Date();
  const key = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  return len === 0 ? 0 : hash % len;
}

export default function HomeScreen() {
  const pct = useMemo(() => clamp(DEMO_PROGRESS.daysThisWeek / 7, 0, 1), []);
  const [showExample, setShowExample] = useState(false);

  const dailyItem = useMemo(() => {
    const i = getDailyIndex(HOME_DAILY_WORDS.length);
    return HOME_DAILY_WORDS[i];
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.heroCard}>
          <ThemedText type="title">Akwaaba back</ThemedText>
          <ThemedText style={styles.subtitle}>
            A Twi learning app designed for heritage speakers who may understand the language,
            but want more confidence producing it.
          </ThemedText>
        </ThemedView>

        <View style={styles.quickActionGrid}>
          <Pressable style={styles.quickActionCard} onPress={() => router.push('/learn')}>
            <ThemedText style={styles.quickIcon}>📚</ThemedText>
            <ThemedText type="subtitle">Continue learning</ThemedText>
            <ThemedText style={styles.small}>Flashcards, production, and speed recall.</ThemedText>
          </Pressable>

          <Pressable style={styles.quickActionCard} onPress={() => router.push('/games')}>
            <ThemedText style={styles.quickIcon}>🎮</ThemedText>
            <ThemedText type="subtitle">Practice games</ThemedText>
            <ThemedText style={styles.small}>Tap Match, Memory Match, and Road Quiz.</ThemedText>
          </Pressable>
        </View>

        <ThemedView style={styles.card}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.label}>This week</ThemedText>
            <ThemedText style={styles.badge}>{DEMO_PROGRESS.streakDays} day streak</ThemedText>
          </View>

          <ThemedText style={styles.big}>{DEMO_PROGRESS.daysThisWeek}/7 days</ThemedText>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${pct * 100}%` }]} />
          </View>

          <View style={styles.statsRow}>
            <ThemedText style={styles.small}>{DEMO_PROGRESS.wordsPracticed} words practiced</ThemedText>
            <ThemedText style={styles.small}>{DEMO_PROGRESS.gamesPlayed} games played</ThemedText>
          </View>
        </ThemedView>

        <ThemedView style={styles.card}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.label}>Daily word</ThemedText>
            <ThemedText style={styles.badge}>Today</ThemedText>
          </View>

          <ThemedText style={styles.word}>{dailyItem.twi}</ThemedText>
          <ThemedText style={styles.small}>English: {dailyItem.english}</ThemedText>
          {dailyItem.definition ? <ThemedText style={styles.small}>Meaning: {dailyItem.definition}</ThemedText> : null}

          {showExample ? (
            <ThemedView style={styles.exampleBox}>
              <ThemedText type="subtitle" style={styles.label}>Example</ThemedText>
              <ThemedText style={styles.small}>{dailyItem.exampleTwi}</ThemedText>
              <ThemedText style={styles.small}>{dailyItem.exampleEnglish}</ThemedText>
            </ThemedView>
          ) : null}

          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            onPress={() => setShowExample((visible) => !visible)}
          >
            <ThemedText style={styles.buttonText}>{showExample ? 'Hide example' : 'Reveal example'}</ThemedText>
          </Pressable>
        </ThemedView>

        <ThemedView style={styles.card}>
          <ThemedText type="subtitle" style={styles.label}>Feature map</ThemedText>
          <View style={styles.featureRow}>
            <ThemedText style={styles.featureStatus}>✅ Learn</ThemedText>
            <ThemedText style={styles.small}>Flashcards, production prompts, and speed quiz</ThemedText>
          </View>
          <View style={styles.featureRow}>
            <ThemedText style={styles.featureStatus}>✅ Games</ThemedText>
            <ThemedText style={styles.small}>Vocabulary matching, memory practice, and crossing quiz</ThemedText>
          </View>
          <View style={styles.featureRow}>
            <ThemedText style={styles.featureStatus}>🟡 Translate</ThemedText>
            <ThemedText style={styles.small}>Prototype dictionary/translation support</ThemedText>
          </View>
        </ThemedView>

        <ThemedText style={styles.footer}>
          Demo note: progress is currently sample data. Future work will store practice history locally and connect it to spaced repetition.
        </ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    gap: 12,
    justifyContent: 'flex-start',
  },
  heroCard: {
    borderRadius: 20,
    padding: 18,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(127,127,127,0.25)',
  },
  subtitle: {
    opacity: 0.82,
    fontSize: 16,
    lineHeight: 23,
  },
  quickActionGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(127,127,127,0.25)',
  },
  quickIcon: {
    fontSize: 28,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(127,127,127,0.25)',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  label: {
    opacity: 0.8,
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(127,127,127,0.25)',
    fontSize: 13,
    fontWeight: '700',
  },
  big: {
    fontSize: 34,
    fontWeight: '700',
  },
  word: {
    fontSize: 34,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  exampleBox: {
    marginTop: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(127,127,127,0.25)',
    gap: 6,
  },
  featureRow: {
    gap: 2,
    paddingVertical: 4,
  },
  featureStatus: {
    fontSize: 16,
    fontWeight: '700',
  },
  button: {
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(127,127,127,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  small: {
    fontSize: 15,
    lineHeight: 21,
  },
  progressTrack: {
    height: 12,
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(127,127,127,0.35)',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: 'rgba(127,127,127,0.65)',
  },
  footer: {
    marginTop: 6,
    opacity: 0.75,
    lineHeight: 20,
  },
});
