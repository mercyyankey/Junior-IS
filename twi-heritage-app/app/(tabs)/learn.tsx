import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type VocabItem = {
  twi: string;
  english: string;
  exampleTwi: string;
  exampleEnglish: string;
  productionPrompt: string;
};

type LearnMode = 'flashcards' | 'production' | 'speed';

type Feedback = null | 'correct' | 'incorrect';

const LESSON_WORDS: VocabItem[] = [
  {
    twi: 'Akwaaba',
    english: 'Welcome',
    exampleTwi: 'Akwaaba, me nua.',
    exampleEnglish: 'Welcome, my friend.',
    productionPrompt: 'How would you say “Welcome” in Twi?',
  },
  {
    twi: 'Medaase',
    english: 'Thank you',
    exampleTwi: 'Medaase sɛ wo boa me.',
    exampleEnglish: 'Thank you for helping me.',
    productionPrompt: 'How would you say “Thank you” in Twi?',
  },
  {
    twi: 'Ɛte sɛn?',
    english: 'How are you?',
    exampleTwi: 'Ɛte sɛn? Wo ho te dɛn?',
    exampleEnglish: 'How are you? How is your body?',
    productionPrompt: 'How would you ask “How are you?” in Twi?',
  },
  {
    twi: 'Nsuo',
    english: 'Water',
    exampleTwi: 'Mepɛ nsuo.',
    exampleEnglish: 'I want water.',
    productionPrompt: 'How would you say “Water” in Twi?',
  },
  {
    twi: 'Fie',
    english: 'House',
    exampleTwi: 'Merekɔ fie.',
    exampleEnglish: 'I am going home.',
    productionPrompt: 'How would you say “House” or “Home” in Twi?',
  },
];

function normalizeAnswer(value: string) {
  return value.trim().toLowerCase().replace(/[?.!,]/g, '');
}

export default function LearnScreen() {
  const [queue, setQueue] = useState<VocabItem[]>(LESSON_WORDS);
  const [mode, setMode] = useState<LearnMode>('flashcards');
  const [masteredCount, setMasteredCount] = useState(0);
  const [reviewAgainCount, setReviewAgainCount] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const [recallGuess, setRecallGuess] = useState('');
  const [recallFeedback, setRecallFeedback] = useState<Feedback>(null);
  const [productionGuess, setProductionGuess] = useState('');
  const [productionFeedback, setProductionFeedback] = useState<Feedback>(null);
  const [speedIndex, setSpeedIndex] = useState(0);
  const [speedGuess, setSpeedGuess] = useState('');
  const [speedFeedback, setSpeedFeedback] = useState<Feedback>(null);
  const [speedScore, setSpeedScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [speedActive, setSpeedActive] = useState(false);

  const currentItem = queue[0] || null;
  const speedItem = LESSON_WORDS[speedIndex % LESSON_WORDS.length];
  const totalPracticed = masteredCount + reviewAgainCount;
  const progress = LESSON_WORDS.length === 0 ? 0 : masteredCount / LESSON_WORDS.length;

  function resetCardState() {
    setShowTranslation(false);
    setShowExample(false);
    setRecallGuess('');
    setRecallFeedback(null);
    setProductionGuess('');
    setProductionFeedback(null);
  }

  function markKnown() {
    if (!currentItem) return;

    setQueue((currentQueue) => currentQueue.slice(1));
    setMasteredCount((count) => count + 1);
    resetCardState();
  }

  function reviewAgain() {
    if (!currentItem) return;

    setQueue((currentQueue) => {
      const [firstCard, ...rest] = currentQueue;
      return [...rest, firstCard];
    });
    setReviewAgainCount((count) => count + 1);
    resetCardState();
  }

  function resetLesson() {
    setQueue(LESSON_WORDS);
    setMasteredCount(0);
    setReviewAgainCount(0);
    resetCardState();
  }

  function checkRecallGuess() {
    if (!currentItem) return;

    const guess = normalizeAnswer(recallGuess);
    const answer = normalizeAnswer(currentItem.english);

    setRecallFeedback(guess && guess === answer ? 'correct' : 'incorrect');
  }

  function checkProductionGuess() {
    if (!currentItem) return;

    const guess = normalizeAnswer(productionGuess);
    const answer = normalizeAnswer(currentItem.twi);

    setProductionFeedback(guess && guess === answer ? 'correct' : 'incorrect');
  }

  function startSpeedRound() {
    setMode('speed');
    setSpeedIndex(0);
    setSpeedGuess('');
    setSpeedFeedback(null);
    setSpeedScore(0);
    setTimeLeft(30);
    setSpeedActive(true);
  }

  function checkSpeedGuess() {
    const guess = normalizeAnswer(speedGuess);
    const answer = normalizeAnswer(speedItem.english);
    const isCorrect = guess && guess === answer;

    setSpeedFeedback(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      setSpeedScore((score) => score + 1);
    }

    setTimeout(() => {
      setSpeedGuess('');
      setSpeedFeedback(null);
      setSpeedIndex((index) => index + 1);
    }, 500);
  }

  useEffect(() => {
    if (!speedActive || timeLeft <= 0) return;

    const timer = setTimeout(() => {
      setTimeLeft((time) => time - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [speedActive, timeLeft]);

  useEffect(() => {
    if (timeLeft <= 0) {
      setSpeedActive(false);
    }
  }, [timeLeft]);

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <ThemedView style={styles.container}>
        <ThemedText type="title">Learn</ThemedText>
        <ThemedText style={styles.subtitle}>
          Practice Twi through recognition, production, and timed recall.
        </ThemedText>

        <View style={styles.modeRow}>
          <Pressable
            style={({ pressed }) => [
              styles.modeButton,
              mode === 'flashcards' && styles.modeButtonActive,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => setMode('flashcards')}
          >
            <ThemedText style={styles.buttonText}>Flashcards</ThemedText>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.modeButton,
              mode === 'production' && styles.modeButtonActive,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => setMode('production')}
          >
            <ThemedText style={styles.buttonText}>Production</ThemedText>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.modeButton,
              mode === 'speed' && styles.modeButtonActive,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => setMode('speed')}
          >
            <ThemedText style={styles.buttonText}>Speed</ThemedText>
          </Pressable>
        </View>

        <ThemedView style={styles.statsCard}>
          <View style={styles.statsRow}>
            <ThemedText style={styles.small}>Mastered: {masteredCount}</ThemedText>
            <ThemedText style={styles.small}>Review again: {reviewAgainCount}</ThemedText>
            <ThemedText style={styles.small}>Remaining: {queue.length}</ThemedText>
          </View>
          <ThemedView style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${Math.min(progress * 100, 100)}%` }]} />
          </ThemedView>
          <ThemedText style={styles.footer}>Practice actions this session: {totalPracticed}</ThemedText>
        </ThemedView>

        {!currentItem && mode !== 'speed' ? (
          <ThemedView style={styles.card}>
            <ThemedText type="subtitle">Session complete!</ThemedText>
            <ThemedText style={styles.small}>You moved through every card in this lesson set.</ThemedText>
            <Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]} onPress={resetLesson}>
              <ThemedText style={styles.buttonText}>Restart lesson</ThemedText>
            </Pressable>
          </ThemedView>
        ) : null}

        {mode === 'flashcards' && currentItem ? (
          <ThemedView style={styles.card}>
            <ThemedText type="subtitle" style={styles.label}>Flashcard</ThemedText>
            <ThemedText style={styles.big}>{currentItem.twi}</ThemedText>
            <ThemedText style={styles.small}>
              {showTranslation ? `English: ${currentItem.english}` : 'Try to recall the meaning before revealing it.'}
            </ThemedText>

            <View style={styles.row}>
              <Pressable
                style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
                onPress={() => setShowTranslation((visible) => !visible)}
              >
                <ThemedText style={styles.buttonText}>{showTranslation ? 'Hide' : 'Reveal'}</ThemedText>
              </Pressable>

              <Pressable
                style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
                onPress={() => setShowExample((visible) => !visible)}
              >
                <ThemedText style={styles.buttonText}>{showExample ? 'Hide example' : 'Example'}</ThemedText>
              </Pressable>
            </View>

            {showExample ? (
              <ThemedView style={styles.exampleBox}>
                <ThemedText type="subtitle" style={styles.label}>Example sentence</ThemedText>
                <ThemedText style={styles.small}>{currentItem.exampleTwi}</ThemedText>
                <ThemedText style={styles.small}>{currentItem.exampleEnglish}</ThemedText>
              </ThemedView>
            ) : null}

            <ThemedView style={styles.practiceBox}>
              <ThemedText type="subtitle" style={styles.label}>Quick recall</ThemedText>
              <TextInput
                value={recallGuess}
                onChangeText={(text) => {
                  setRecallGuess(text);
                  if (recallFeedback) setRecallFeedback(null);
                }}
                placeholder="Type the English meaning"
                style={styles.input}
              />
              <Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]} onPress={checkRecallGuess}>
                <ThemedText style={styles.buttonText}>Check answer</ThemedText>
              </Pressable>
              {recallFeedback === 'correct' ? <ThemedText style={styles.correctText}>Correct — nice job.</ThemedText> : null}
              {recallFeedback === 'incorrect' ? <ThemedText style={styles.incorrectText}>Not quite — reveal the answer and try again.</ThemedText> : null}
            </ThemedView>

            <View style={styles.row}>
              <Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]} onPress={reviewAgain}>
                <ThemedText style={styles.buttonText}>Review again</ThemedText>
              </Pressable>
              <Pressable style={({ pressed }) => [styles.button, styles.primaryButton, pressed && styles.buttonPressed]} onPress={markKnown}>
                <ThemedText style={styles.primaryButtonText}>I got it</ThemedText>
              </Pressable>
            </View>
          </ThemedView>
        ) : null}

        {mode === 'production' && currentItem ? (
          <ThemedView style={styles.card}>
            <ThemedText type="subtitle" style={styles.label}>Production practice</ThemedText>
            <ThemedText style={styles.promptText}>{currentItem.productionPrompt}</ThemedText>
            <ThemedText style={styles.small}>This mode focuses on turning recognition into active use.</ThemedText>

            <TextInput
              value={productionGuess}
              onChangeText={(text) => {
                setProductionGuess(text);
                if (productionFeedback) setProductionFeedback(null);
              }}
              placeholder="Type your Twi answer"
              style={styles.input}
            />

            <View style={styles.row}>
              <Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]} onPress={checkProductionGuess}>
                <ThemedText style={styles.buttonText}>Check production</ThemedText>
              </Pressable>
              <Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]} onPress={() => setShowTranslation(true)}>
                <ThemedText style={styles.buttonText}>Show answer</ThemedText>
              </Pressable>
            </View>

            {showTranslation ? <ThemedText style={styles.small}>Answer: {currentItem.twi}</ThemedText> : null}
            {productionFeedback === 'correct' ? <ThemedText style={styles.correctText}>Correct — you produced it.</ThemedText> : null}
            {productionFeedback === 'incorrect' ? <ThemedText style={styles.incorrectText}>Not quite — compare with the answer and try again.</ThemedText> : null}

            <View style={styles.row}>
              <Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]} onPress={reviewAgain}>
                <ThemedText style={styles.buttonText}>Review again</ThemedText>
              </Pressable>
              <Pressable style={({ pressed }) => [styles.button, styles.primaryButton, pressed && styles.buttonPressed]} onPress={markKnown}>
                <ThemedText style={styles.primaryButtonText}>I can say it</ThemedText>
              </Pressable>
            </View>
          </ThemedView>
        ) : null}

        {mode === 'speed' ? (
          <ThemedView style={styles.card}>
            <ThemedText type="subtitle" style={styles.label}>Timed speed quiz</ThemedText>

            {!speedActive && timeLeft === 30 ? (
              <>
                <ThemedText style={styles.small}>You have 30 seconds to translate as many Twi words as possible.</ThemedText>
                <Pressable style={({ pressed }) => [styles.button, styles.primaryButton, pressed && styles.buttonPressed]} onPress={startSpeedRound}>
                  <ThemedText style={styles.primaryButtonText}>Start speed round</ThemedText>
                </Pressable>
              </>
            ) : null}

            {speedActive ? (
              <>
                <View style={styles.statsRow}>
                  <ThemedText style={styles.small}>Time left: {timeLeft}s</ThemedText>
                  <ThemedText style={styles.small}>Score: {speedScore}</ThemedText>
                </View>

                <ThemedText style={styles.big}>{speedItem.twi}</ThemedText>
                <TextInput
                  value={speedGuess}
                  onChangeText={(text) => setSpeedGuess(text)}
                  placeholder="Type the English meaning"
                  style={styles.input}
                />

                <Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]} onPress={checkSpeedGuess}>
                  <ThemedText style={styles.buttonText}>Submit answer</ThemedText>
                </Pressable>

                {speedFeedback === 'correct' ? <ThemedText style={styles.correctText}>Correct — keep going.</ThemedText> : null}
                {speedFeedback === 'incorrect' ? <ThemedText style={styles.incorrectText}>Incorrect — next card.</ThemedText> : null}
              </>
            ) : null}

            {!speedActive && timeLeft !== 30 ? (
              <>
                <ThemedText style={styles.big}>Time&apos;s up.</ThemedText>
                <ThemedText style={styles.small}>Final score: {speedScore}</ThemedText>
                <Pressable style={({ pressed }) => [styles.button, styles.primaryButton, pressed && styles.buttonPressed]} onPress={startSpeedRound}>
                  <ThemedText style={styles.primaryButtonText}>Play again</ThemedText>
                </Pressable>
              </>
            ) : null}
          </ThemedView>
        ) : null}

        <ThemedText style={styles.footer}>
          Future work: connect this lesson flow to persistent spaced-repetition data and a larger Twi content set.
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
  subtitle: {
    opacity: 0.8,
  },
  modeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(127,127,127,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeButtonActive: {
    backgroundColor: 'rgba(127,127,127,0.16)',
  },
  statsCard: {
    borderRadius: 16,
    padding: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(127,127,127,0.25)',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
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
  card: {
    borderRadius: 16,
    padding: 16,
    gap: 12,
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
  promptText: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 30,
  },
  small: {
    fontSize: 15,
    lineHeight: 21,
  },
  practiceBox: {
    marginTop: 8,
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(127,127,127,0.35)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  correctText: {
    fontSize: 15,
    fontWeight: '700',
    opacity: 0.9,
  },
  incorrectText: {
    fontSize: 15,
    fontWeight: '700',
    opacity: 0.9,
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
    marginTop: 4,
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
  primaryButton: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  footer: {
    marginTop: 6,
    opacity: 0.75,
  },
});
