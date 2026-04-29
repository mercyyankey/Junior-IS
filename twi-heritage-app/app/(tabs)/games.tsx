import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type MatchItem = {
  id: number;
  object: string;
  english: string;
  twi: string;
};

const MATCH_ITEMS: MatchItem[] = [
  { id: 1, object: '🍎', english: 'Apple', twi: 'Apɔw' },
  { id: 2, object: '💧', english: 'Water', twi: 'Nsuo' },
  { id: 3, object: '🏠', english: 'House', twi: 'Fie' },
  { id: 4, object: '📚', english: 'Book', twi: 'Nhoma' },
];

function shuffle<T>(array: T[]) {
  return [...array].sort(() => Math.random() - 0.5);
}

type GameMode = 'menu' | 'tapMatch' | 'memoryMatch' | 'roadQuiz';

export default function GamesScreen() {
  const [gameMode, setGameMode] = useState<GameMode>('menu');
  const [selectedObject, setSelectedObject] = useState<MatchItem | null>(null);
  const [matchedIds, setMatchedIds] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [wordOptions, setWordOptions] = useState(() => shuffle(MATCH_ITEMS));

  function chooseObject(item: MatchItem) {
    if (matchedIds.includes(item.id)) return;

    setSelectedObject(item);
    setFeedback(`Selected: ${item.english}`);
  }

  function chooseWord(item: MatchItem) {
    if (!selectedObject) {
      setFeedback('Pick an object first.');
      return;
    }

    if (selectedObject.id === item.id) {
      setMatchedIds((current) => [...current, item.id]);
      setScore((current) => current + 1);
      setFeedback('Correct match!');
    } else {
      setFeedback(`Try again. ${selectedObject.object} is not ${item.twi}.`);
    }

    setSelectedObject(null);
  }

  function resetGame() {
    setSelectedObject(null);
    setMatchedIds([]);
    setScore(0);
    setFeedback('');
    setWordOptions(shuffle(MATCH_ITEMS));
  }

  const gameComplete = matchedIds.length === MATCH_ITEMS.length;

  function goToMenu() {
    resetGame();
    setGameMode('menu');
  }

  if (gameMode === 'menu') {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="title">Games</ThemedText>
        <ThemedText style={styles.sub}>
          Choose a game to practice Twi vocabulary.
        </ThemedText>

        <Pressable style={styles.gameSelectCard} onPress={() => setGameMode('tapMatch')}>
          <ThemedText type="subtitle">Object Match</ThemedText>
          <ThemedText>Tap an object, then tap the matching Twi word.</ThemedText>
        </Pressable>

        <Pressable style={styles.gameSelectCard} onPress={() => setGameMode('memoryMatch')}>
          <ThemedText type="subtitle">Memory Match</ThemedText>
          <ThemedText>Flip two cards at a time and match each English word with its Twi meaning.</ThemedText>
        </Pressable>
        <Pressable style={styles.gameSelectCard} onPress={() => setGameMode('roadQuiz')}>
          <ThemedText type="subtitle">Road Crossing Quiz</ThemedText>
          <ThemedText>Answer correctly to cross the road. Wrong answers squash your player.</ThemedText>
        </Pressable>
      </ThemedView>
    ); 
  }

  if (gameMode === 'memoryMatch') {
    return <MemoryMatchGame onBack={goToMenu} />;
  }

  if (gameMode === 'roadQuiz') {
    return <RoadCrossingQuizGame onBack={goToMenu} />;
  }

  return (
    <ThemedView style={styles.container}>
      <Pressable onPress={goToMenu} style={styles.backButton}>
        <ThemedText style={styles.backButtonText}>← Back to games</ThemedText>
      </Pressable>
      <ThemedText type="title">Object Match</ThemedText>
      <ThemedText style={styles.sub}>
        Match each object to the correct Twi word.
      </ThemedText>

      <View style={styles.scoreBox}>
        <ThemedText>Score: {score}</ThemedText>
        <ThemedText>
          Progress: {matchedIds.length}/{MATCH_ITEMS.length}
        </ThemedText>
      </View>

      <ThemedText type="subtitle">Objects</ThemedText>

      <View style={styles.grid}>
        {MATCH_ITEMS.map((item) => {
          const isSelected = selectedObject?.id === item.id;
          const isMatched = matchedIds.includes(item.id);

          return (
            <Pressable
              key={item.id}
              onPress={() => chooseObject(item)}
              style={[
                styles.card,
                isSelected && styles.selectedCard,
                isMatched && styles.matchedCard,
              ]}
            >
              <ThemedText style={styles.emoji}>{item.object}</ThemedText>
              <ThemedText>{item.english}</ThemedText>
            </Pressable>
          );
        })}
      </View>

      <ThemedText type="subtitle">Twi Words</ThemedText>

      <View style={styles.grid}>
        {wordOptions.map((item) => {
          const isMatched = matchedIds.includes(item.id);

          return (
            <Pressable
              key={item.id}
              onPress={() => chooseWord(item)}
              disabled={isMatched}
              style={[styles.wordCard, isMatched && styles.matchedCard]}
            >
              <ThemedText style={styles.word}>{item.twi}</ThemedText>
            </Pressable>
          );
        })}
      </View>

      {!!feedback && <ThemedText style={styles.feedback}>{feedback}</ThemedText>}

      {gameComplete && (
        <View style={styles.completeBox}>
          <ThemedText type="subtitle">Great job!</ThemedText>
          <ThemedText>You matched all the words.</ThemedText>

          <Pressable onPress={resetGame} style={styles.resetButton}>
            <ThemedText style={styles.resetText}>Play Again</ThemedText>
          </Pressable>
        </View>
      )}
    </ThemedView>
  );
}

// Memory Match Game

type MemoryCard = {
  id: string;
  pairId: number;
  label: string;
  kind: 'english' | 'twi';
};

function createMemoryCards(): MemoryCard[] {
  const cards = MATCH_ITEMS.flatMap((item) => [
    {
      id: `english-${item.id}`,
      pairId: item.id,
      label: item.english,
      kind: 'english' as const,
    },
    {
      id: `twi-${item.id}`,
      pairId: item.id,
      label: item.twi,
      kind: 'twi' as const,
    },
  ]);

  return shuffle(cards);
}

function MemoryMatchGame({ onBack }: { onBack: () => void }) {
  const [cards, setCards] = useState<MemoryCard[]>(() => createMemoryCards());
  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [matchedPairIds, setMatchedPairIds] = useState<number[]>([]);
  const [memoryFeedback, setMemoryFeedback] = useState('Flip two cards to find a matching English/Twi pair.');
  const [moves, setMoves] = useState(0);

  const memoryComplete = matchedPairIds.length === MATCH_ITEMS.length;

  function resetMemoryGame() {
    setCards(createMemoryCards());
    setFlippedIds([]);
    setMatchedPairIds([]);
    setMemoryFeedback('Flip two cards to find a matching English/Twi pair.');
    setMoves(0);
  }

  function flipCard(card: MemoryCard) {
    if (flippedIds.includes(card.id) || matchedPairIds.includes(card.pairId) || flippedIds.length >= 2) {
      return;
    }

    const nextFlippedIds = [...flippedIds, card.id];
    setFlippedIds(nextFlippedIds);

    if (nextFlippedIds.length === 2) {
      setMoves((current) => current + 1);

      const firstCard = cards.find((currentCard) => currentCard.id === nextFlippedIds[0]);
      const secondCard = cards.find((currentCard) => currentCard.id === nextFlippedIds[1]);

      if (firstCard && secondCard && firstCard.pairId === secondCard.pairId && firstCard.kind !== secondCard.kind) {
        setMatchedPairIds((current) => [...current, firstCard.pairId]);
        setMemoryFeedback('Correct pair!');
        setTimeout(() => setFlippedIds([]), 650);
      } else {
        setMemoryFeedback('Not a match — try again.');
        setTimeout(() => setFlippedIds([]), 900);
      }
    }
  }

  return (
    <ThemedView style={styles.container}>
      <Pressable onPress={onBack} style={styles.backButton}>
        <ThemedText style={styles.backButtonText}>← Back to games</ThemedText>
      </Pressable>

      <ThemedText type="title">Memory Match</ThemedText>
      <ThemedText style={styles.sub}>
        Flip cards and match each English word with the correct Twi word.
      </ThemedText>

      <View style={styles.scoreBox}>
        <ThemedText>Moves: {moves}</ThemedText>
        <ThemedText>
          Matches: {matchedPairIds.length}/{MATCH_ITEMS.length}
        </ThemedText>
      </View>

      <View style={styles.grid}>
        {cards.map((card) => {
          const isFlipped = flippedIds.includes(card.id);
          const isMatched = matchedPairIds.includes(card.pairId);
          const shouldShow = isFlipped || isMatched;

          return (
            <Pressable
              key={card.id}
              onPress={() => flipCard(card)}
              disabled={isMatched}
              style={[styles.memoryCard, isMatched && styles.matchedCard]}
            >
              <ThemedText style={styles.memoryCardText}>{shouldShow ? card.label : '?'}</ThemedText>
            </Pressable>
          );
        })}
      </View>

      <ThemedText style={styles.feedback}>{memoryFeedback}</ThemedText>

      {memoryComplete ? (
        <View style={styles.completeBox}>
          <ThemedText type="subtitle">You cleared the board!</ThemedText>
          <ThemedText>Total moves: {moves}</ThemedText>
          <Pressable onPress={resetMemoryGame} style={styles.resetButton}>
            <ThemedText style={styles.resetText}>Play Again</ThemedText>
          </Pressable>
        </View>
      ) : null}
    </ThemedView>
  );
}


function RoadCrossingQuizGame({ onBack }: { onBack: () => void }) {
  const BOARD_SIZE = 5;
  const START_POSITION = { row: 4, col: 2 };

  const [roadIndex, setRoadIndex] = useState(0);
  const [roadScore, setRoadScore] = useState(0);
  const [roadFeedback, setRoadFeedback] = useState('Use the arrow keys or buttons to cross the road.');
  const [isSquashed, setIsSquashed] = useState(false);
  const [playerPosition, setPlayerPosition] = useState(START_POSITION);
  const [showQuestion, setShowQuestion] = useState(false);
  const [carStep, setCarStep] = useState(0);

  const currentItem = MATCH_ITEMS[roadIndex % MATCH_ITEMS.length];
  const roadComplete = roadIndex >= MATCH_ITEMS.length;

  const carRows: Record<number, { vehicles: string[]; direction: 1 | -1 }> = {
    1: { vehicles: ['🚗', '', '🚌', '', '🚕'], direction: 1 },
    2: { vehicles: ['', '🚕', '', '🚙', ''], direction: -1 },
    3: { vehicles: ['🚌', '', '🚗', '', '🚙'], direction: 1 },
  };

  function getVehicleAt(row: number, col: number) {
    const rowData = carRows[row];
    if (!rowData) return '';

    const shiftedIndex =
      rowData.direction === 1
        ? (col - carStep + BOARD_SIZE) % BOARD_SIZE
        : (col + carStep) % BOARD_SIZE;

    return rowData.vehicles[shiftedIndex];
  }
  useEffect(() => {
    if (isSquashed || roadComplete || showQuestion) return;

    const timer = setInterval(() => {
      setCarStep((current) => current + 1);
    }, 700);

    return () => clearInterval(timer);
  }, [isSquashed, roadComplete, showQuestion]);

  useEffect(() => {
    if (isSquashed || roadComplete || showQuestion) return;

    const vehicleAtPlayer = getVehicleAt(playerPosition.row, playerPosition.col);

    if (vehicleAtPlayer) {
      setIsSquashed(true);
      setRoadFeedback('You got hit by a car! Try again.');
    }
  }, [carStep, playerPosition, isSquashed, roadComplete, showQuestion]);

  const answerOptions = shuffle([
    currentItem.english,
    ...MATCH_ITEMS.filter((item) => item.id !== currentItem.id).slice(0, 3).map((item) => item.english),
  ]);

  function movePlayer(direction: 'up' | 'down' | 'left' | 'right') {
    if (isSquashed || roadComplete || showQuestion) return;

    setPlayerPosition((current) => {
      const next = { ...current };

      if (direction === 'up') next.row = Math.max(0, current.row - 1);
      if (direction === 'down') next.row = Math.min(BOARD_SIZE - 1, current.row + 1);
      if (direction === 'left') next.col = Math.max(0, current.col - 1);
      if (direction === 'right') next.col = Math.min(BOARD_SIZE - 1, current.col + 1);

      if (next.row === 0) {
        setShowQuestion(true);
        setRoadFeedback('You reached the crossing point! Answer to move to the next road.');
      } else {
        setRoadFeedback('Keep crossing. Reach the top to answer a question.');
      }

      return next;
    });
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'ArrowUp') movePlayer('up');
      if (event.key === 'ArrowDown') movePlayer('down');
      if (event.key === 'ArrowLeft') movePlayer('left');
      if (event.key === 'ArrowRight') movePlayer('right');
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [isSquashed, roadComplete, showQuestion]);

  function answerRoadQuiz(answer: string) {
    if (roadComplete || isSquashed) return;

    if (answer === currentItem.english) {
      setRoadScore((current) => current + 1);
      setRoadIndex((current) => current + 1);
      setPlayerPosition(START_POSITION);
      setCarStep(0);
      setShowQuestion(false);
      setRoadFeedback('Correct! New road unlocked. Avoid the cars again.');
    } else {
      setIsSquashed(true);
      setRoadFeedback(`Oh no! The correct answer was ${currentItem.english}.`);
    }
  }

  function resetRoadQuiz() {
    setRoadIndex(0);
    setRoadScore(0);
    setRoadFeedback('Use the arrow keys or buttons to cross the road.');
    setIsSquashed(false);
    setPlayerPosition(START_POSITION);
    setCarStep(0);
    setShowQuestion(false);
  }

  return (
    <ThemedView style={styles.container}>
      <Pressable onPress={onBack} style={styles.backButton}>
        <ThemedText style={styles.backButtonText}>← Back to games</ThemedText>
      </Pressable>

      <ThemedText type="title">Road Crossing Quiz</ThemedText>
      <ThemedText style={styles.sub}>
        Avoid the moving cars, reach the safe row, then answer a Twi question to continue.
      </ThemedText>

      <View style={styles.scoreBox}>
        <ThemedText>Score: {roadScore}</ThemedText>
        <ThemedText>
          Level: {Math.min(roadIndex + 1, MATCH_ITEMS.length)}/{MATCH_ITEMS.length}
        </ThemedText>
      </View>

      <View style={styles.crossyBoard}>
        {Array.from({ length: BOARD_SIZE }).map((_, rowIndex) => (
          <View key={rowIndex} style={[styles.crossyRow, rowIndex === 0 && styles.safeRow]}>
            {Array.from({ length: BOARD_SIZE }).map((__, colIndex) => {
              const hasPlayer = playerPosition.row === rowIndex && playerPosition.col === colIndex;
              const vehicle = getVehicleAt(rowIndex, colIndex);

              return (
                <View key={`${rowIndex}-${colIndex}`} style={styles.crossyCell}>
                  <ThemedText style={styles.crossyCellText}>
                    {hasPlayer ? (isSquashed ? '💥' : roadComplete ? '🏁' : '🧍🏾‍♀️') : vehicle}
                  </ThemedText>
                </View>
              );
            })}
          </View>
        ))}
      </View>

      {roadComplete ? (
        <View style={styles.completeBox}>
          <ThemedText type="subtitle">You made it across every road!</ThemedText>
          <ThemedText>Final score: {roadScore}</ThemedText>
          <Pressable onPress={resetRoadQuiz} style={styles.resetButton}>
            <ThemedText style={styles.resetText}>Play Again</ThemedText>
          </Pressable>
        </View>
      ) : isSquashed ? (
        <View style={styles.completeBox}>
          <ThemedText type="subtitle">You got squashed!</ThemedText>
          <ThemedText>{roadFeedback}</ThemedText>
          <Pressable onPress={resetRoadQuiz} style={styles.resetButton}>
            <ThemedText style={styles.resetText}>Try Again</ThemedText>
          </Pressable>
        </View>
      ) : showQuestion ? (
        <View style={styles.questionBox}>
          <ThemedText type="subtitle">What does this Twi word mean?</ThemedText>
          <ThemedText style={styles.bigRoadWord}>{currentItem.twi}</ThemedText>

          <View style={styles.grid}>
            {answerOptions.map((answer) => (
              <Pressable key={answer} onPress={() => answerRoadQuiz(answer)} style={styles.answerCard}>
                <ThemedText style={styles.answerText}>{answer}</ThemedText>
              </Pressable>
            ))}
          </View>
        </View>
      ) : (
        <View style={styles.controlsBox}>
          <ThemedText style={styles.feedback}>{roadFeedback}</ThemedText>
          <ThemedText style={styles.sub}>Cars move automatically. Do not stand in their lane too long.</ThemedText>
          <Pressable onPress={() => movePlayer('up')} style={styles.controlButton}>
            <ThemedText style={styles.controlText}>↑</ThemedText>
          </Pressable>
          <View style={styles.controlRow}>
            <Pressable onPress={() => movePlayer('left')} style={styles.controlButton}>
              <ThemedText style={styles.controlText}>←</ThemedText>
            </Pressable>
            <Pressable onPress={() => movePlayer('down')} style={styles.controlButton}>
              <ThemedText style={styles.controlText}>↓</ThemedText>
            </Pressable>
            <Pressable onPress={() => movePlayer('right')} style={styles.controlButton}>
              <ThemedText style={styles.controlText}>→</ThemedText>
            </Pressable>
          </View>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 14,
  },
  sub: {
    opacity: 0.8,
  },
  gameSelectCard: {
    padding: 18,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ddd',
    gap: 8,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  backButtonText: {
    fontWeight: '700',
  },
  scoreBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f1f1f1',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '47%',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedCard: {
    borderColor: '#7c3aed',
    borderWidth: 3,
  },
  matchedCard: {
    opacity: 0.4,
    backgroundColor: '#d1fae5',
  },
  emoji: {
    fontSize: 42,
    marginBottom: 8,
  },
  wordCard: {
    width: '47%',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: '#fff7ed',
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  word: {
    fontSize: 22,
    fontWeight: '700',
  },
  memoryCard: {
    width: '47%',
    minHeight: 90,
    padding: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eef2ff',
    borderWidth: 1,
    borderColor: '#c7d2fe',
  },
  memoryCardText: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  crossyBoard: {
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  crossyRow: {
    flexDirection: 'row',
    backgroundColor: '#d1d5db',
  },
  safeRow: {
    backgroundColor: '#bbf7d0',
  },
  crossyCell: {
    flex: 1,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: '#9ca3af',
  },
  crossyCellText: {
    fontSize: 30,
  },
  controlsBox: {
    alignItems: 'center',
    gap: 10,
  },
  controlRow: {
    flexDirection: 'row',
    gap: 10,
  },
  controlButton: {
    width: 64,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  controlText: {
    fontSize: 26,
    fontWeight: '800',
  },
  questionBox: {
    gap: 12,
  },
  bigRoadWord: {
    fontSize: 40,
    fontWeight: '800',
    textAlign: 'center',
  },
  answerCard: {
    width: '47%',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  answerText: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  feedback: {
    fontSize: 16,
    fontWeight: '600',
  },
  completeBox: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#ecfdf5',
    gap: 10,
  },
  resetButton: {
    marginTop: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#111827',
    alignItems: 'center',
  },
  resetText: {
    color: 'white',
    fontWeight: '700',
  },
});