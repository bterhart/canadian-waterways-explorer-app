import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ArrowLeft, Check, X, Trophy, ChevronRight, RotateCcw } from 'lucide-react-native';
import { cn } from '@/lib/cn';

// Theme colors
const colors = {
  forestGreen: '#2D5A3D',
  waterBlue: '#3B82A3',
  earthBrown: '#8B5A2B',
  creamWhite: '#FFFEF7',
  gold: '#C9A227',
};

// Question type
interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

// Quiz type
interface QuizData {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

// Mock quiz data with questions
const quizDatabase: Record<string, QuizData> = {
  '1': {
    id: '1',
    title: 'Great Explorers of Canada',
    description: 'Test your knowledge about famous explorers who mapped the Canadian wilderness.',
    questions: [
      {
        id: 'q1',
        questionText: 'Who is known as the "Father of New France"?',
        options: ['Jacques Cartier', 'Samuel de Champlain', 'John Cabot', 'Henry Hudson'],
        correctAnswerIndex: 1,
        explanation: 'Samuel de Champlain founded Quebec City in 1608 and is considered the Father of New France for his extensive exploration and colonization efforts.',
      },
      {
        id: 'q2',
        questionText: 'Which explorer first reached the Pacific Ocean overland through Canada?',
        options: ['David Thompson', 'Alexander Mackenzie', 'Simon Fraser', 'Peter Pond'],
        correctAnswerIndex: 1,
        explanation: 'Alexander Mackenzie completed the first transcontinental crossing of North America north of Mexico in 1793, reaching the Pacific Ocean.',
      },
      {
        id: 'q3',
        questionText: 'What river did Simon Fraser explore in 1808?',
        options: ['Columbia River', 'Fraser River', 'Mackenzie River', 'Peace River'],
        correctAnswerIndex: 1,
        explanation: 'Simon Fraser explored the river that now bears his name, the Fraser River, from its source to the Pacific Ocean in 1808.',
      },
      {
        id: 'q4',
        questionText: 'Who was the first European to see the Rocky Mountains from the Canadian prairies?',
        options: ['Anthony Henday', 'Samuel Hearne', 'Peter Fidler', 'Matthew Cocking'],
        correctAnswerIndex: 0,
        explanation: 'Anthony Henday was the first European to see the Rocky Mountains from the prairies in 1754 during his journey to meet the Blackfoot peoples.',
      },
      {
        id: 'q5',
        questionText: 'Which explorer mapped more of North America than any other person in history?',
        options: ['Alexander Mackenzie', 'Simon Fraser', 'David Thompson', 'Peter Pond'],
        correctAnswerIndex: 2,
        explanation: 'David Thompson surveyed and mapped nearly 4 million square kilometers of North America, more than any other explorer in history.',
      },
    ],
  },
  '2': {
    id: '2',
    title: 'The Fur Trade Era',
    description: 'Learn about the history of fur trading companies and their impact on Canada.',
    questions: [
      {
        id: 'q1',
        questionText: 'When was the Hudson\'s Bay Company founded?',
        options: ['1570', '1670', '1770', '1870'],
        correctAnswerIndex: 1,
        explanation: 'The Hudson\'s Bay Company was founded on May 2, 1670, making it one of the oldest corporations in the world still in existence.',
      },
      {
        id: 'q2',
        questionText: 'Which animal\'s fur was most sought after in the Canadian fur trade?',
        options: ['Fox', 'Bear', 'Beaver', 'Mink'],
        correctAnswerIndex: 2,
        explanation: 'Beaver pelts were the most valuable fur in the trade, used primarily to make fashionable felt hats in Europe.',
      },
      {
        id: 'q3',
        questionText: 'What was the main rival of the Hudson\'s Bay Company?',
        options: ['American Fur Company', 'North West Company', 'Russian-American Company', 'Pacific Fur Company'],
        correctAnswerIndex: 1,
        explanation: 'The North West Company, based in Montreal, was the main rival of the Hudson\'s Bay Company until the two merged in 1821.',
      },
      {
        id: 'q4',
        questionText: 'What were the famous fur trade canoes called?',
        options: ['Voyageur canoes', 'Birchbark canoes', 'Canots du maitre', 'All of the above'],
        correctAnswerIndex: 3,
        explanation: 'Various types of canoes were used, including birchbark canoes and the large "canots du maitre" (Montreal canoes) paddled by voyageurs.',
      },
      {
        id: 'q5',
        questionText: 'What was the currency often used in fur trade transactions?',
        options: ['Gold coins', 'Beaver pelts', 'Trade beads', 'Silver dollars'],
        correctAnswerIndex: 1,
        explanation: 'Beaver pelts became a form of currency, with the term "Made Beaver" used as a standard unit of trade value.',
      },
    ],
  },
  '3': {
    id: '3',
    title: 'First Nations Waterways',
    description: 'Explore the traditional knowledge of Indigenous peoples about Canadian waterways.',
    questions: [
      {
        id: 'q1',
        questionText: 'What material did First Nations peoples traditionally use to make canoes?',
        options: ['Oak wood', 'Birch bark', 'Animal skins', 'Pine logs'],
        correctAnswerIndex: 1,
        explanation: 'Birch bark was the preferred material for canoe building because it was lightweight, waterproof, and flexible.',
      },
      {
        id: 'q2',
        questionText: 'What is a "portage"?',
        options: ['A type of fish', 'Carrying boats overland between waterways', 'A fishing technique', 'A type of paddle'],
        correctAnswerIndex: 1,
        explanation: 'A portage is carrying boats and goods overland between navigable waters, a technique perfected by Indigenous peoples.',
      },
      {
        id: 'q3',
        questionText: 'Which First Nation is known for their ocean-going canoes on the Pacific coast?',
        options: ['Cree', 'Haida', 'Ojibwe', 'Mi\'kmaq'],
        correctAnswerIndex: 1,
        explanation: 'The Haida were master canoe builders, creating large cedar canoes capable of ocean voyages.',
      },
      {
        id: 'q4',
        questionText: 'What did Indigenous peoples use to waterproof their canoes?',
        options: ['Beeswax', 'Animal fat', 'Spruce gum and animal fat', 'Clay'],
        correctAnswerIndex: 2,
        explanation: 'Spruce gum mixed with animal fat was applied to the seams of birch bark canoes to make them waterproof.',
      },
    ],
  },
  '4': {
    id: '4',
    title: 'Canadian Rivers and Lakes',
    description: 'A comprehensive quiz about the geography of Canadian water systems.',
    questions: [
      {
        id: 'q1',
        questionText: 'What is the longest river in Canada?',
        options: ['St. Lawrence River', 'Mackenzie River', 'Fraser River', 'Churchill River'],
        correctAnswerIndex: 1,
        explanation: 'The Mackenzie River is the longest river in Canada at 4,241 km, flowing from Great Slave Lake to the Arctic Ocean.',
      },
      {
        id: 'q2',
        questionText: 'Which Great Lake is entirely within Canada?',
        options: ['Lake Superior', 'Lake Huron', 'Lake Ontario', 'None of them'],
        correctAnswerIndex: 3,
        explanation: 'None of the Great Lakes are entirely within Canada. All five Great Lakes are shared between Canada and the United States.',
      },
      {
        id: 'q3',
        questionText: 'What percentage of the world\'s fresh surface water is found in Canada?',
        options: ['5%', '10%', '20%', '7%'],
        correctAnswerIndex: 2,
        explanation: 'Canada contains approximately 20% of the world\'s fresh surface water and 7% of the world\'s renewable freshwater.',
      },
      {
        id: 'q4',
        questionText: 'Which bay is the largest in the world?',
        options: ['Georgian Bay', 'Hudson Bay', 'Bay of Fundy', 'James Bay'],
        correctAnswerIndex: 1,
        explanation: 'Hudson Bay is the largest bay in the world, covering approximately 1.23 million square kilometers.',
      },
      {
        id: 'q5',
        questionText: 'Where does the St. Lawrence River empty?',
        options: ['Hudson Bay', 'Atlantic Ocean', 'Pacific Ocean', 'Gulf of Mexico'],
        correctAnswerIndex: 1,
        explanation: 'The St. Lawrence River empties into the Gulf of St. Lawrence and then into the Atlantic Ocean.',
      },
    ],
  },
  '5': {
    id: '5',
    title: 'Maritime Discovery',
    description: 'Journey through the history of maritime exploration on Canadian coasts.',
    questions: [
      {
        id: 'q1',
        questionText: 'Who was the first European to reach Canada\'s Atlantic coast?',
        options: ['Christopher Columbus', 'John Cabot', 'Jacques Cartier', 'Leif Erikson'],
        correctAnswerIndex: 3,
        explanation: 'Leif Erikson and the Norse Vikings reached the Atlantic coast around 1000 CE, nearly 500 years before other European explorers.',
      },
      {
        id: 'q2',
        questionText: 'What was John Cabot looking for when he reached Newfoundland in 1497?',
        options: ['Gold', 'A route to Asia', 'Fish', 'Furs'],
        correctAnswerIndex: 1,
        explanation: 'John Cabot was searching for a westward route to Asia when he landed on Newfoundland in 1497.',
      },
      {
        id: 'q3',
        questionText: 'Which explorer sailed into Vancouver\'s harbor before George Vancouver?',
        options: ['James Cook', 'Juan Francisco de la Bodega y Quadra', 'Jose Maria Narvaez', 'Bruno de Hezeta'],
        correctAnswerIndex: 2,
        explanation: 'Jose Maria Narvaez was the first European to enter the waters of present-day Vancouver harbor in 1791.',
      },
      {
        id: 'q4',
        questionText: 'What was the main purpose of the Franklin Expedition?',
        options: ['To map the Pacific coast', 'To find the Northwest Passage', 'To establish trading posts', 'To explore Hudson Bay'],
        correctAnswerIndex: 1,
        explanation: 'The Franklin Expedition of 1845 attempted to chart and navigate the Northwest Passage through the Canadian Arctic.',
      },
    ],
  },
  '6': {
    id: '6',
    title: 'Hudson Bay Company',
    description: 'Discover the fascinating history of one of the oldest companies in North America.',
    questions: [
      {
        id: 'q1',
        questionText: 'Who was the first governor of the Hudson\'s Bay Company?',
        options: ['Prince Rupert', 'King Charles II', 'Pierre-Esprit Radisson', 'Medard Chouart des Groseilliers'],
        correctAnswerIndex: 0,
        explanation: 'Prince Rupert of the Rhine was the first governor of the Hudson\'s Bay Company, which is why the company\'s territory was called Rupert\'s Land.',
      },
      {
        id: 'q2',
        questionText: 'What territory did the HBC originally control?',
        options: ['Lower Canada', 'Upper Canada', 'Rupert\'s Land', 'British Columbia'],
        correctAnswerIndex: 2,
        explanation: 'The HBC controlled Rupert\'s Land, which comprised the entire Hudson Bay drainage basin - about 40% of modern Canada.',
      },
      {
        id: 'q3',
        questionText: 'What year did the HBC merge with the North West Company?',
        options: ['1801', '1811', '1821', '1831'],
        correctAnswerIndex: 2,
        explanation: 'The Hudson\'s Bay Company and North West Company merged in 1821 after years of fierce competition.',
      },
      {
        id: 'q4',
        questionText: 'What did the HBC sell to Canada in 1870?',
        options: ['Their furs', 'Their trading posts', 'Rupert\'s Land', 'Their ships'],
        correctAnswerIndex: 2,
        explanation: 'In 1870, the HBC sold Rupert\'s Land to Canada for 300,000 pounds, transferring vast territories to the new Dominion.',
      },
    ],
  },
  '7': {
    id: '7',
    title: 'Samuel de Champlain',
    description: 'Learn about the Father of New France and his explorations.',
    questions: [
      {
        id: 'q1',
        questionText: 'In what year did Champlain found Quebec City?',
        options: ['1598', '1608', '1618', '1628'],
        correctAnswerIndex: 1,
        explanation: 'Samuel de Champlain founded Quebec City on July 3, 1608, establishing the first permanent French settlement in North America.',
      },
      {
        id: 'q2',
        questionText: 'What Indigenous nation became allies of Champlain against the Iroquois?',
        options: ['The Blackfoot', 'The Huron-Wendat', 'The Haida', 'The Inuit'],
        correctAnswerIndex: 1,
        explanation: 'Champlain formed an alliance with the Huron-Wendat (also known as the Wyandot) and other Algonquian nations.',
      },
      {
        id: 'q3',
        questionText: 'What large body of water did Champlain "discover" that now bears his name?',
        options: ['Lake Ontario', 'Lake Erie', 'Lake Champlain', 'Lake Huron'],
        correctAnswerIndex: 2,
        explanation: 'Lake Champlain, located between New York and Vermont, was named after Samuel de Champlain who explored it in 1609.',
      },
      {
        id: 'q4',
        questionText: 'What was Champlain\'s profession before becoming an explorer?',
        options: ['Priest', 'Soldier and navigator', 'Fur trader', 'Farmer'],
        correctAnswerIndex: 1,
        explanation: 'Champlain served as a soldier during the French Wars of Religion and was an experienced navigator before his explorations.',
      },
    ],
  },
  '8': {
    id: '8',
    title: 'Pacific Coast Explorers',
    description: 'Explore the adventures of those who mapped Canada\'s west coast.',
    questions: [
      {
        id: 'q1',
        questionText: 'Who led the first European expedition to explore the BC coast extensively?',
        options: ['George Vancouver', 'James Cook', 'Juan de Fuca', 'Francis Drake'],
        correctAnswerIndex: 1,
        explanation: 'Captain James Cook led the first major European expedition to explore the British Columbia coast in 1778.',
      },
      {
        id: 'q2',
        questionText: 'What was George Vancouver\'s ship called?',
        options: ['HMS Endeavour', 'HMS Discovery', 'HMS Bounty', 'HMS Resolution'],
        correctAnswerIndex: 1,
        explanation: 'George Vancouver commanded HMS Discovery during his famous expedition to chart the Pacific Northwest coast (1791-1795).',
      },
      {
        id: 'q3',
        questionText: 'Which Spanish explorer has a major BC port named after him?',
        options: ['Juan Francisco de la Bodega y Quadra', 'Dionisio Alcala Galiano', 'Cayetano Valdes', 'Jose Maria Narvaez'],
        correctAnswerIndex: 0,
        explanation: 'Quadra Island is named after Juan Francisco de la Bodega y Quadra, who worked cooperatively with George Vancouver.',
      },
      {
        id: 'q4',
        questionText: 'What were the Spanish looking for on the Pacific coast?',
        options: ['Gold', 'The Northwest Passage', 'Furs', 'All of the above'],
        correctAnswerIndex: 3,
        explanation: 'The Spanish were interested in finding the Northwest Passage, claiming territory, and trading for sea otter furs.',
      },
    ],
  },
};

type QuizState = 'taking' | 'results';

interface UserAnswer {
  questionId: string;
  selectedIndex: number;
  isCorrect: boolean;
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  const progress = (current / total) * 100;
  return (
    <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
      <View
        className="h-full rounded-full"
        style={{ width: `${progress}%`, backgroundColor: colors.forestGreen }}
      />
    </View>
  );
}

function OptionCard({
  option,
  index,
  isSelected,
  onSelect,
  disabled,
}: {
  option: string;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  disabled: boolean;
}) {
  const letters = ['A', 'B', 'C', 'D'];
  return (
    <Pressable
      onPress={onSelect}
      disabled={disabled}
      className={cn(
        'flex-row items-center p-4 mb-3 rounded-xl border-2',
        isSelected
          ? 'border-[#2D5A3D] bg-[#2D5A3D]/10'
          : 'border-gray-200 bg-white'
      )}
    >
      <View
        className={cn(
          'w-10 h-10 rounded-full items-center justify-center mr-3',
          isSelected ? 'bg-[#2D5A3D]' : 'bg-gray-100'
        )}
      >
        <Text
          className={cn(
            'text-lg font-bold',
            isSelected ? 'text-white' : 'text-gray-600'
          )}
        >
          {letters[index]}
        </Text>
      </View>
      <Text
        className={cn(
          'flex-1 text-base',
          isSelected ? 'text-[#2D5A3D] font-semibold' : 'text-gray-700'
        )}
      >
        {option}
      </Text>
      {isSelected ? (
        <View className="w-6 h-6 rounded-full bg-[#2D5A3D] items-center justify-center">
          <Check size={16} color="white" strokeWidth={3} />
        </View>
      ) : null}
    </Pressable>
  );
}

function ResultCard({
  question,
  userAnswer,
  index,
}: {
  question: Question;
  userAnswer: UserAnswer;
  index: number;
}) {
  const letters = ['A', 'B', 'C', 'D'];
  const isCorrect = userAnswer.isCorrect;

  return (
    <View className="bg-white rounded-xl mb-4 p-4 shadow-sm">
      {/* Question header */}
      <View className="flex-row items-start mb-3">
        <View
          className={cn(
            'w-8 h-8 rounded-full items-center justify-center mr-3',
            isCorrect ? 'bg-green-500' : 'bg-red-500'
          )}
        >
          {isCorrect ? (
            <Check size={18} color="white" strokeWidth={3} />
          ) : (
            <X size={18} color="white" strokeWidth={3} />
          )}
        </View>
        <View className="flex-1">
          <Text className="text-sm text-gray-500 mb-1">Question {index + 1}</Text>
          <Text className="text-base font-semibold text-gray-900">
            {question.questionText}
          </Text>
        </View>
      </View>

      {/* Answer info */}
      <View className="ml-11 mb-3">
        <Text className="text-sm text-gray-600 mb-1">
          Your answer:{' '}
          <Text className={isCorrect ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
            {letters[userAnswer.selectedIndex]}. {question.options[userAnswer.selectedIndex]}
          </Text>
        </Text>
        {!isCorrect ? (
          <Text className="text-sm text-gray-600">
            Correct answer:{' '}
            <Text className="text-green-600 font-semibold">
              {letters[question.correctAnswerIndex]}. {question.options[question.correctAnswerIndex]}
            </Text>
          </Text>
        ) : null}
      </View>

      {/* Explanation */}
      <View className="ml-11 bg-blue-50 rounded-lg p-3">
        <Text className="text-sm text-blue-800">{question.explanation}</Text>
      </View>
    </View>
  );
}

function getScoreMessage(percentage: number): { message: string; emoji: string } {
  if (percentage === 100) return { message: 'Perfect Score! Outstanding!', emoji: '' };
  if (percentage >= 80) return { message: 'Excellent Work! Great job!', emoji: '' };
  if (percentage >= 60) return { message: 'Good Effort! Keep learning!', emoji: '' };
  if (percentage >= 40) return { message: 'Nice Try! Review and try again!', emoji: '' };
  return { message: 'Keep Practicing! You can do it!', emoji: '' };
}

export default function QuizScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [quizState, setQuizState] = useState<QuizState>('taking');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);

  // Get quiz data
  const quiz = id ? quizDatabase[id] : null;

  // Calculate results
  const results = useMemo(() => {
    if (userAnswers.length === 0) return { correct: 0, total: 0, percentage: 0 };
    const correct = userAnswers.filter(a => a.isCorrect).length;
    const total = userAnswers.length;
    const percentage = Math.round((correct / total) * 100);
    return { correct, total, percentage };
  }, [userAnswers]);

  if (!quiz) {
    return (
      <View className="flex-1 items-center justify-center bg-[#FFFEF7]">
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator size="large" color={colors.forestGreen} />
        <Text className="mt-4 text-base text-gray-600">Loading quiz...</Text>
      </View>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const canProceed = selectedAnswerIndex !== null;

  const handleSelectAnswer = (index: number) => {
    setSelectedAnswerIndex(index);
  };

  const handleNext = () => {
    if (selectedAnswerIndex === null) return;

    const isCorrect = selectedAnswerIndex === currentQuestion.correctAnswerIndex;
    const newAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      selectedIndex: selectedAnswerIndex,
      isCorrect,
    };

    setUserAnswers(prev => [...prev, newAnswer]);

    if (isLastQuestion) {
      setQuizState('results');
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswerIndex(null);
    }
  };

  const handleRetakeQuiz = () => {
    setQuizState('taking');
    setCurrentQuestionIndex(0);
    setSelectedAnswerIndex(null);
    setUserAnswers([]);
  };

  const handleBackToQuizzes = () => {
    router.back();
  };

  // Results Screen
  if (quizState === 'results') {
    const scoreInfo = getScoreMessage(results.percentage);

    return (
      <View className="flex-1 bg-[#FFFEF7]">
        <Stack.Screen
          options={{
            headerShown: true,
            title: 'Quiz Results',
            headerStyle: { backgroundColor: colors.forestGreen },
            headerTintColor: 'white',
            headerTitleStyle: { fontWeight: 'bold' },
            headerLeft: () => (
              <Pressable onPress={handleBackToQuizzes} className="mr-4">
                <ArrowLeft size={24} color="white" />
              </Pressable>
            ),
          }}
        />

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Score card */}
          <View className="mx-4 mt-4 bg-white rounded-2xl p-6 shadow-sm items-center">
            <View
              className="w-20 h-20 rounded-full items-center justify-center mb-4"
              style={{ backgroundColor: results.percentage >= 60 ? '#22C55E' : colors.gold }}
            >
              <Trophy size={40} color="white" />
            </View>

            <Text className="text-4xl font-bold text-gray-900 mb-2">
              {results.correct}/{results.total}
            </Text>
            <Text className="text-xl text-gray-600 mb-2">
              {results.percentage}% Correct
            </Text>
            <Text className="text-lg font-semibold text-center" style={{ color: colors.forestGreen }}>
              {scoreInfo.message}
            </Text>
          </View>

          {/* Action buttons */}
          <View className="flex-row px-4 mt-4 mb-4">
            <Pressable
              onPress={handleRetakeQuiz}
              className="flex-1 flex-row items-center justify-center py-3 rounded-xl mr-2 border-2"
              style={{ borderColor: colors.forestGreen }}
            >
              <RotateCcw size={20} color={colors.forestGreen} />
              <Text className="ml-2 font-semibold" style={{ color: colors.forestGreen }}>
                Retake Quiz
              </Text>
            </Pressable>
            <Pressable
              onPress={handleBackToQuizzes}
              className="flex-1 flex-row items-center justify-center py-3 rounded-xl ml-2"
              style={{ backgroundColor: colors.forestGreen }}
            >
              <Text className="font-semibold text-white">Back to Quizzes</Text>
            </Pressable>
          </View>

          {/* Review section */}
          <View className="px-4 mb-2">
            <Text className="text-lg font-bold text-gray-900 mb-3">
              Review Your Answers
            </Text>
          </View>

          {/* Question results */}
          <View className="px-4">
            {quiz.questions.map((question, index) => (
              <ResultCard
                key={question.id}
                question={question}
                userAnswer={userAnswers[index]}
                index={index}
              />
            ))}
          </View>

          <View className="h-8" />
        </ScrollView>
      </View>
    );
  }

  // Quiz Taking Screen
  return (
    <View className="flex-1 bg-[#FFFEF7]">
      <Stack.Screen
        options={{
          headerShown: true,
          title: quiz.title,
          headerStyle: { backgroundColor: colors.forestGreen },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 16 },
          headerLeft: () => (
            <Pressable onPress={handleBackToQuizzes} className="mr-4">
              <ArrowLeft size={24} color="white" />
            </Pressable>
          ),
        }}
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Progress section */}
        <View className="px-4 pt-4">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-sm font-semibold text-gray-600">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </Text>
            <Text className="text-sm font-semibold" style={{ color: colors.forestGreen }}>
              {Math.round(((currentQuestionIndex) / quiz.questions.length) * 100)}% Complete
            </Text>
          </View>
          <ProgressBar current={currentQuestionIndex} total={quiz.questions.length} />
        </View>

        {/* Question card */}
        <View className="mx-4 mt-6 bg-white rounded-2xl p-5 shadow-sm">
          <View
            className="w-12 h-12 rounded-full items-center justify-center mb-4"
            style={{ backgroundColor: `${colors.waterBlue}20` }}
          >
            <Text className="text-xl font-bold" style={{ color: colors.waterBlue }}>
              {currentQuestionIndex + 1}
            </Text>
          </View>
          <Text className="text-xl font-bold text-gray-900 leading-7">
            {currentQuestion.questionText}
          </Text>
        </View>

        {/* Options */}
        <View className="px-4 mt-6">
          <Text className="text-sm font-semibold text-gray-600 mb-3">
            Select your answer:
          </Text>
          {currentQuestion.options.map((option, index) => (
            <OptionCard
              key={index}
              option={option}
              index={index}
              isSelected={selectedAnswerIndex === index}
              onSelect={() => handleSelectAnswer(index)}
              disabled={false}
            />
          ))}
        </View>

        <View className="h-24" />
      </ScrollView>

      {/* Bottom action button */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4 pb-8">
        <Pressable
          onPress={handleNext}
          disabled={!canProceed}
          className={cn(
            'flex-row items-center justify-center py-4 rounded-xl',
            canProceed ? 'bg-[#2D5A3D]' : 'bg-gray-300'
          )}
        >
          <Text className="text-lg font-semibold text-white mr-2">
            {isLastQuestion ? 'Submit Quiz' : 'Next Question'}
          </Text>
          <ChevronRight size={22} color="white" />
        </Pressable>
      </View>
    </View>
  );
}
