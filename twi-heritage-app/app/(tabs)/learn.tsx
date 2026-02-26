import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type VocabItem = {
  twi: string;
  english: string;
  exampleTwi: string;
  exampleEnglish: string;
};

const LESSON_WORDS: VocabItem[] = [
  {
    twi: 'Akwaaba',
    english: 'Welcome',
    exampleTwi: 'Akwaaba, me nua.',
    exampleEnglish: 'Welcome, my friend.',
  },
  {
    twi: 'Medaase',
    english: 'Thank you',
    exampleTwi: 'Medaase sɛ wo boa me.',
    exampleEnglish: 'Thank you for helping me.',
  },
  {
    twi: 'Ɛte sɛn?',
    english: 'How are you?',
    exampleTwi: 'Ɛte sɛn? Wo ho te dɛn?',
    exampleEnglish: 'How are you? How is your body?',
  },
];

export default function LearnScreen() {
  const [index, setIndex] = useState(0);
  const [showExample, setShowExample] = useState(false);

  const item = useMemo(() => LESSON_WORDS[index % LESSON_WORDS.length], [index]);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Learn</ThemedText>
      <ThemedText style={styles.subtitle}>Small practice session. One word at a time.</ThemedText>

      <ThemedView style={styles.card}>
        <ThemedText type="subtitle" style={styles.label}>
          Word
        </ThemedText>
        <ThemedText style={styles.big}>{item.twi}</ThemedText>
        <ThemedText style={styles.small}>English: {item.english}</ThemedText>

        {showExample ? (
          <ThemedView style={styles.exampleBox}>
            <ThemedText type="subtitle" style={styles.label}>
              Example
            </ThemedText>
            <ThemedText style={styles.small}>{item.exampleTwi}</ThemedText>
            <ThemedText style={styles.small}>{item.exampleEnglish}</ThemedText>
          </ThemedView>
        ) : null}

        <ThemedView style={styles.row}>
          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            onPress={() => setShowExample((v) => !v)}>
            <ThemedText style={styles.buttonText}>
              {showExample ? 'Hide example' : 'Reveal example'}
            </ThemedText>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            onPress={() => {
              setShowExample(false);
              setIndex((i) => i + 1);
            }}>
            <ThemedText style={styles.buttonText}>Next</ThemedText>
          </Pressable>
        </ThemedView>
      </ThemedView>

      <ThemedText style={styles.footer}>
        Coming soon: audio playback, recording, and a review queue.
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
  small: {
    fontSize: 16,
    lineHeight: 22,
  },
  exampleBox: {
    marginTop: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(127,127,127,0.25)',
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  button: {
    flex: 1,
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
  footer: {
    marginTop: 6,
    opacity: 0.75,
  },
});
