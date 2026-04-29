import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type Entry = {
  twi: string;
  english: string;
};

const DICTIONARY: Entry[] = [
  { twi: 'Akwaaba', english: 'Welcome' },
  { twi: 'Medaase', english: 'Thank you' },
  { twi: 'Ɛte sɛn?', english: 'How are you?' },
  { twi: 'Nsuo', english: 'Water' },
  { twi: 'Fie', english: 'House / Home' },
  { twi: 'Mepa wo kyɛw', english: 'Please' },
];

type Mode = 'translate' | 'dictionary';

function normalize(text: string) {
  return text.trim().toLowerCase();
}

export default function TranslateScreen() {
  const [mode, setMode] = useState<Mode>('translate');
  const [input, setInput] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  function handleTranslate() {
    const query = normalize(input);

    const match = DICTIONARY.find(
      (item) => normalize(item.twi) === query || normalize(item.english) === query
    );

    if (!query) {
      setResult('Enter a word or phrase.');
      return;
    }

    if (!match) {
      setResult('No match found.');
      return;
    }

    if (normalize(match.twi) === query) {
      setResult(`English: ${match.english}`);
    } else {
      setResult(`Twi: ${match.twi}`);
    }
  }

  const filteredDictionary = useMemo(() => {
    const q = normalize(search);
    if (!q) return DICTIONARY;

    return DICTIONARY.filter(
      (item) =>
        normalize(item.twi).includes(q) || normalize(item.english).includes(q)
    );
  }, [search]);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Translate & Dictionary</ThemedText>
      <ThemedText style={styles.sub}>
        Look up Twi words or translate simple phrases.
      </ThemedText>

      <View style={styles.modeRow}>
        <Pressable
          style={({ pressed }) => [
            styles.modeButton,
            mode === 'translate' && styles.activeMode,
            pressed && styles.pressed,
          ]}
          onPress={() => setMode('translate')}
        >
          <ThemedText>Translate</ThemedText>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.modeButton,
            mode === 'dictionary' && styles.activeMode,
            pressed && styles.pressed,
          ]}
          onPress={() => setMode('dictionary')}
        >
          <ThemedText>Dictionary</ThemedText>
        </Pressable>
      </View>

      {mode === 'translate' ? (
        <ThemedView style={styles.card}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Enter Twi or English"
            style={styles.input}
          />

          <Pressable style={styles.button} onPress={handleTranslate}>
            <ThemedText style={styles.buttonText}>Translate</ThemedText>
          </Pressable>

          {result ? <ThemedText style={styles.result}>{result}</ThemedText> : null}
        </ThemedView>
      ) : (
        <ThemedView style={styles.card}>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search dictionary"
            style={styles.input}
          />

          {filteredDictionary.map((item) => (
            <View key={item.twi} style={styles.entry}>
              <ThemedText style={styles.entryTwi}>{item.twi}</ThemedText>
              <ThemedText style={styles.entryEnglish}>{item.english}</ThemedText>
            </View>
          ))}
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 12,
  },
  sub: {
    opacity: 0.8,
  },
  modeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  modeButton: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  activeMode: {
    backgroundColor: '#e5e7eb',
  },
  pressed: {
    opacity: 0.7,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    gap: 10,
    borderWidth: 1,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  button: {
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  buttonText: {
    fontWeight: '600',
  },
  result: {
    marginTop: 10,
    fontSize: 16,
  },
  entry: {
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  entryTwi: {
    fontWeight: '700',
  },
  entryEnglish: {
    opacity: 0.8,
  },
});