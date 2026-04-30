import { Audio } from 'expo-av';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { TWI_DATA } from '@/data/twiDataset';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const AUDIO_SOURCES: Record<string, any> = {};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

export default function TranslateScreen() {
  const [input, setInput] = useState('');
  const [audioFeedback, setAudioFeedback] = useState('');

  const results = useMemo(() => {
    const query = normalize(input);

    if (!query) {
      return [];
    }

    return TWI_DATA.filter(
      (item) =>
        normalize(item.twi).includes(query) ||
        normalize(item.english).includes(query)
    ).slice(0, 25);
  }, [input]);

  async function playAudio(audioPath: string) {
    const source = AUDIO_SOURCES[audioPath];

    if (!source) {
      setAudioFeedback('Audio is not mapped for this entry yet.');
      return;
    }

    try {
      setAudioFeedback('Playing audio...');
      const { sound } = await Audio.Sound.createAsync(source);
      await sound.playAsync();

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
          setAudioFeedback('');
        }
      });
    } catch (error) {
      setAudioFeedback('Could not play audio.');
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <ThemedView style={styles.container}>
        <ThemedText type="title">Translate & Dictionary</ThemedText>
        <ThemedText style={styles.sub}>
          Search Twi or English to find matching words and phrases from the dataset.
        </ThemedText>

        <TextInput
          placeholder="Search Twi or English"
          value={input}
          onChangeText={setInput}
          style={styles.input}
        />

        {audioFeedback ? <ThemedText style={styles.feedback}>{audioFeedback}</ThemedText> : null}

        {!input.trim() ? (
          <ThemedView style={styles.card}>
            <ThemedText type="subtitle">Dictionary preview</ThemedText>
            <ThemedText style={styles.small}>
              Try searching for “thank you”, “water”, “sorry”, “where”, or “come”.
            </ThemedText>
          </ThemedView>
        ) : null}

        {input.trim() && results.length === 0 ? (
          <ThemedView style={styles.card}>
            <ThemedText type="subtitle">No results found</ThemedText>
            <ThemedText style={styles.small}>
              Try a shorter search term or check the spelling.
            </ThemedText>
          </ThemedView>
        ) : null}

        {results.length > 0 ? (
          <ThemedView style={styles.card}>
            <View style={styles.sectionHeader}>
              <ThemedText type="subtitle">Results</ThemedText>
              <ThemedText style={styles.badge}>{results.length}</ThemedText>
            </View>

            {results.map((item) => {
              const hasAudio = Boolean(AUDIO_SOURCES[item.audioPath]);

              return (
                <ThemedView key={`${item.id}-${item.audioPath}`} style={styles.resultCard}>
                  <ThemedText style={styles.twiText}>{item.twi}</ThemedText>
                  <ThemedText style={styles.englishText}>{item.english}</ThemedText>
                  <ThemedText style={styles.metaText}>{item.category} • {item.difficulty}</ThemedText>

                  <Pressable
                    style={[styles.audioButton, !hasAudio && styles.disabledButton]}
                    onPress={() => playAudio(item.audioPath)}
                  >
                    <ThemedText style={styles.audioButtonText}>
                      {hasAudio ? '🔊 Play pronunciation' : 'Audio not mapped yet'}
                    </ThemedText>
                  </Pressable>
                </ThemedView>
              );
            })}
          </ThemedView>
        ) : null}
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
  },
  sub: {
    opacity: 0.8,
    fontSize: 16,
    lineHeight: 22,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(127,127,127,0.45)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  feedback: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.8,
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
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(127,127,127,0.25)',
    fontWeight: '700',
  },
  resultCard: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(127,127,127,0.2)',
    gap: 6,
  },
  twiText: {
    fontSize: 22,
    fontWeight: '700',
  },
  englishText: {
    fontSize: 16,
    lineHeight: 22,
  },
  metaText: {
    fontSize: 13,
    opacity: 0.65,
  },
  audioButton: {
    marginTop: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(127,127,127,0.35)',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  audioButtonText: {
    fontWeight: '700',
  },
  small: {
    fontSize: 15,
    lineHeight: 21,
  },
});