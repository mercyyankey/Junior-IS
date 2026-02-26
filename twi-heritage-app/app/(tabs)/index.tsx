import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type ProgressState = {
  daysThisWeek: number; // 0–7
  streakDays: number;
};

type VocabItem = {
  twi: string;
  english: string;
  definition?: string;
  exampleTwi: string;
  exampleEnglish: string;
};

// Home tab: small “daily word” list (kept separate from Learn tab lessons)
const HOME_DAILY_WORDS: VocabItem[] = [
  {
    twi: 'Herh',
    english: 'An exclamation (wow/hey/oh really?)',
    definition:
      'A versatile Ghanaian exclamation used to express intense emotions, including surprise, shock, admiration, or disbelief.',
    exampleTwi: 'Herh! bra ha',
    exampleEnglish: 'Hey! Come here',
  },
  {
    twi: 'Ɛyɛ',
    english: 'It is good / Okay',
    definition: 'Used to agree, confirm, or say something is fine/acceptable.',
    exampleTwi: 'Ɛyɛ, yɛbɛhyia bio.',
    exampleEnglish: 'Okay, we will meet again.',
  },
  {
    twi: 'Mepa wo kyɛw',
    english: 'Please',
    definition: 'Polite phrase used to ask for something or soften a request.',
    exampleTwi: 'Mepa wo kyɛw, boa me kakra.',
    exampleEnglish: 'Please, help me a little.',
  },
];

const DEMO_PROGRESS: ProgressState = {
  daysThisWeek: 3,
  streakDays: 2,
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

// Stable pick for the day (come back to fix later)
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
    <ThemedView style={styles.container}>
      <ThemedText type="title">Home</ThemedText>
      <ThemedText style={styles.subtitle}>
        Welcome back. This is the demo foundation for my Twi heritage speaker app.
      </ThemedText>

      <ThemedView style={styles.card}>
        <ThemedText type="subtitle" style={styles.label}>
          This week
        </ThemedText>

        <ThemedText style={styles.big}>
          {DEMO_PROGRESS.daysThisWeek}/7 days
        </ThemedText>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${pct * 100}%` }]} />
        </View>

        <ThemedText style={styles.small}>
          Current streak: {DEMO_PROGRESS.streakDays} day
          {DEMO_PROGRESS.streakDays === 1 ? '' : 's'}
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.card}>
        <ThemedText type="subtitle" style={styles.label}>
          Daily word
        </ThemedText>

        <ThemedText style={styles.word}>{dailyItem.twi}</ThemedText>
        <ThemedText style={styles.small}>English: {dailyItem.english}</ThemedText>
        {dailyItem.definition ? (
          <ThemedText style={styles.small}>Meaning: {dailyItem.definition}</ThemedText>
        ) : null}

        {showExample ? (
          <ThemedView style={styles.exampleBox}>
            <ThemedText type="subtitle" style={styles.label}>
              Example
            </ThemedText>
            <ThemedText style={styles.small}>{dailyItem.exampleTwi}</ThemedText>
            <ThemedText style={styles.small}>{dailyItem.exampleEnglish}</ThemedText>
          </ThemedView>
        ) : null}

        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={() => setShowExample((v) => !v)}>
          <ThemedText style={styles.buttonText}>
            {showExample ? 'Hide example' : 'Reveal example'}
          </ThemedText>
        </Pressable>
      </ThemedView>

      <ThemedView style={styles.card}>
        <ThemedText type="subtitle" style={styles.label}>
          Today
        </ThemedText>
        <ThemedText style={styles.small}>
          Lesson practice lives in the Learn tab.
        </ThemedText>
        <ThemedText style={styles.small}>
          Games, Translate, Social, and Profile tabs are in the bar below but still in progress.
        </ThemedText>
      </ThemedView>

      <ThemedText style={styles.footer}>
        Next steps: store progress locally and rotate the daily word from a bigger vocab list.
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 12,
    justifyContent: 'flex-start',
  },
  subtitle: {
    opacity: 0.8,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(127,127,127,0.25)',
  },
  label: {
    opacity: 0.8,
  },
  big: {
    fontSize: 34,
    fontWeight: '700',
  },
  word: {
    fontSize: 34,
    fontWeight: '700',
  },
  exampleBox: {
    marginTop: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(127,127,127,0.25)',
    gap: 6,
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
    fontSize: 16,
    lineHeight: 22,
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
  },
});
