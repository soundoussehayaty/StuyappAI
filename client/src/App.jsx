import { useState } from 'react';
import './App.css';

export default function App() {
  const [studyMaterial, setStudyMaterial] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [mode, setMode] = useState('input');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState('medium');
  const [loading, setLoading] = useState(false);

  const generateFlashcards = async () => {
    if (!studyMaterial.trim()) {
      alert('Please enter study material');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/generate-flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: studyMaterial, count: 10 })
      });
      const data = await res.json();
      setFlashcards(data.flashcards);
      setMode('flashcard');
      setCurrentCardIndex(0);
    } catch (error) {
      console.error('Error:', error);
      alert('Error generating flashcards');
    }
    setLoading(false);
  };

  const generateQuiz = async () => {
    if (!studyMaterial.trim()) {
      alert('Please enter study material');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: studyMaterial, difficulty })
      });
      const data = await res.json();
      setQuizQuestions(data.questions);
      setMode('quiz');
      setCurrentQuestionIndex(0);
      setScore(0);
    } catch (error) {
      console.error('Error:', error);
      alert('Error generating quiz');
    }
    setLoading(false);
  };

  const nextFlashcard = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      alert('Quiz completed!');
      setMode('input');
    }
  };

  const answerQuiz = (selectedIndex) => {
    const question = quizQuestions[currentQuestionIndex];
    if (selectedIndex === question.correct) {
      setScore(score + 1);
    }
    
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      alert(`Quiz Complete! Score: ${score + 1}/${quizQuestions.length}`);
      setMode('input');
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>📚 StudyApp AI</h1>
        <p>Learn smarter with Gemini-powered flashcards & quizzes</p>
      </header>

      {mode === 'input' && (
        <div className="input-section">
          <textarea
            value={studyMaterial}
            onChange={(e) => setStudyMaterial(e.target.value)}
            placeholder="Paste your study notes, slides text, or any material here..."
            className="textarea"
          />
          
          <div className="buttons">
            <button onClick={generateFlashcards} disabled={loading} className="btn btn-primary">
              {loading ? 'Generating...' : '📇 Generate Flashcards'}
            </button>
            
            <div className="quiz-section">
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="select">
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <button onClick={generateQuiz} disabled={loading} className="btn btn-secondary">
                {loading ? 'Generating...' : '✏️ Generate Quiz'}
              </button>
            </div>
          </div>
        </div>
      )}

      {mode === 'flashcard' && flashcards.length > 0 && (
        <div className="card-section">
          <div className="progress">
            Card {currentCardIndex + 1} of {flashcards.length}
          </div>
          
          <div className="flashcard">
            <h3>Q: {flashcards[currentCardIndex]?.question}</h3>
            <p className="answer">A: {flashcards[currentCardIndex]?.answer}</p>
          </div>
          
          <button onClick={nextFlashcard} className="btn btn-primary">
            {currentCardIndex === flashcards.length - 1 ? 'Finish' : 'Next Card →'}
          </button>
          <button onClick={() => setMode('input')} className="btn btn-back">← Back</button>
        </div>
      )}

      {mode === 'quiz' && quizQuestions.length > 0 && (
        <div className="card-section">
          <div className="progress">
            Question {currentQuestionIndex + 1} of {quizQuestions.length} | Score: {score}
          </div>
          
          <div className="question-card">
            <h3>{quizQuestions[currentQuestionIndex]?.question}</h3>
            <div className="options">
              {quizQuestions[currentQuestionIndex]?.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => answerQuiz(idx)}
                  className="option-btn"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          
          <button onClick={() => setMode('input')} className="btn btn-back">← Back</button>
        </div>
      )}
    </div>
  );
}