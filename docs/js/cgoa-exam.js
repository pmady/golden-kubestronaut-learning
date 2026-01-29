/**
 * CGOA Demo Exam - Interactive Quiz Application
 * Loads questions from JSON and provides an interactive exam experience
 */

class CGOAExam {
  constructor() {
    this.questions = [];
    this.currentQuestionIndex = 0;
    this.userAnswers = [];
    this.examStartTime = null;
    this.examEndTime = null;
    this.examMode = 'practice'; // 'practice' or 'exam'
    this.init();
  }

  async init() {
    try {
      await this.loadQuestions();
      this.renderExamStart();
    } catch (error) {
      console.error('Failed to load exam:', error);
      this.renderError('Failed to load exam questions. Please try again later.');
    }
  }

  async loadQuestions() {
    const response = await fetch('../cgoa/data/questions.json');
    if (!response.ok) {
      throw new Error('Failed to fetch questions');
    }
    this.questions = await response.json();
    this.userAnswers = new Array(this.questions.length).fill(null);
  }

  renderExamStart() {
    const container = document.getElementById('exam-container');
    container.innerHTML = `
      <div class="exam-start">
        <h2>🎯 Ready to Start?</h2>
        <div class="exam-stats">
          <div class="stat-card">
            <div class="stat-number">${this.questions.length}</div>
            <div class="stat-label">Total Questions</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${this.getUniqueSections().length}</div>
            <div class="stat-label">Topic Areas</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">~${Math.ceil(this.questions.length * 1.5)}</div>
            <div class="stat-label">Minutes</div>
          </div>
        </div>
        
        <div class="exam-mode-selection">
          <h3>Choose Your Mode:</h3>
          <div class="mode-options">
            <button class="mode-btn" onclick="exam.startExam('practice')">
              <span class="mode-icon">📚</span>
              <span class="mode-title">Practice Mode</span>
              <span class="mode-desc">See explanations after each question</span>
            </button>
            <button class="mode-btn" onclick="exam.startExam('exam')">
              <span class="mode-icon">🎓</span>
              <span class="mode-title">Exam Mode</span>
              <span class="mode-desc">Simulate the real exam experience</span>
            </button>
          </div>
        </div>

        <div class="exam-topics">
          <h3>Topics Covered:</h3>
          <div class="topics-grid">
            ${this.getUniqueSections().map(section => `
              <span class="topic-badge">${section}</span>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  startExam(mode) {
    this.examMode = mode;
    this.examStartTime = new Date();
    this.currentQuestionIndex = 0;
    this.userAnswers = new Array(this.questions.length).fill(null);
    this.renderQuestion();
  }

  renderQuestion() {
    const container = document.getElementById('exam-container');
    const question = this.questions[this.currentQuestionIndex];
    const progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;

    container.innerHTML = `
      <div class="exam-question">
        <div class="exam-header">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${progress}%"></div>
          </div>
          <div class="exam-info">
            <span class="question-number">Question ${this.currentQuestionIndex + 1} of ${this.questions.length}</span>
            <span class="question-section">${question.section}</span>
          </div>
        </div>

        <div class="question-content">
          <h3>${question.question}</h3>
          <div class="choices">
            ${question.choices.map((choice, index) => `
              <label class="choice-label ${this.userAnswers[this.currentQuestionIndex] === index ? 'selected' : ''}">
                <input 
                  type="radio" 
                  name="answer" 
                  value="${index}"
                  ${this.userAnswers[this.currentQuestionIndex] === index ? 'checked' : ''}
                  onchange="exam.selectAnswer(${index})"
                >
                <span class="choice-text">${choice}</span>
              </label>
            `).join('')}
          </div>
        </div>

        <div class="exam-navigation">
          <button 
            class="nav-btn" 
            onclick="exam.previousQuestion()"
            ${this.currentQuestionIndex === 0 ? 'disabled' : ''}
          >
            ← Previous
          </button>
          
          <button class="nav-btn secondary" onclick="exam.showQuestionList()">
            Question List
          </button>

          ${this.currentQuestionIndex < this.questions.length - 1 ? `
            <button 
              class="nav-btn" 
              onclick="exam.nextQuestion()"
            >
              Next →
            </button>
          ` : `
            <button 
              class="nav-btn primary" 
              onclick="exam.submitExam()"
            >
              Submit Exam
            </button>
          `}
        </div>
      </div>
    `;
  }

  selectAnswer(answerIndex) {
    this.userAnswers[this.currentQuestionIndex] = answerIndex;
    
    if (this.examMode === 'practice') {
      this.showExplanation();
    } else {
      // In exam mode, just update the UI
      this.renderQuestion();
    }
  }

  showExplanation() {
    const question = this.questions[this.currentQuestionIndex];
    const userAnswer = this.userAnswers[this.currentQuestionIndex];
    const isCorrect = userAnswer === question.correct;

    const explanationDiv = document.createElement('div');
    explanationDiv.className = `explanation ${isCorrect ? 'correct' : 'incorrect'}`;
    explanationDiv.innerHTML = `
      <div class="explanation-header">
        <span class="result-icon">${isCorrect ? '✅' : '❌'}</span>
        <span class="result-text">${isCorrect ? 'Correct!' : 'Incorrect'}</span>
      </div>
      <div class="explanation-content">
        <p><strong>Correct Answer:</strong> ${question.choices[question.correct]}</p>
        <p><strong>Explanation:</strong> ${question.explanation}</p>
      </div>
    `;

    const questionContent = document.querySelector('.question-content');
    const existingExplanation = document.querySelector('.explanation');
    if (existingExplanation) {
      existingExplanation.remove();
    }
    questionContent.appendChild(explanationDiv);
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.renderQuestion();
    }
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.renderQuestion();
    }
  }

  showQuestionList() {
    const container = document.getElementById('exam-container');
    const sections = this.groupQuestionsBySection();

    container.innerHTML = `
      <div class="question-list">
        <h2>Question Navigator</h2>
        <div class="list-legend">
          <span class="legend-item"><span class="status-indicator answered"></span> Answered</span>
          <span class="legend-item"><span class="status-indicator unanswered"></span> Unanswered</span>
        </div>
        
        ${Object.entries(sections).map(([section, questions]) => `
          <div class="section-group">
            <h3>${section}</h3>
            <div class="question-grid">
              ${questions.map(q => `
                <button 
                  class="question-nav-btn ${this.userAnswers[q.index] !== null ? 'answered' : 'unanswered'}"
                  onclick="exam.goToQuestion(${q.index})"
                >
                  ${q.index + 1}
                </button>
              `).join('')}
            </div>
          </div>
        `).join('')}

        <div class="list-actions">
          <button class="nav-btn" onclick="exam.renderQuestion()">
            Back to Question
          </button>
          <button class="nav-btn primary" onclick="exam.submitExam()">
            Submit Exam
          </button>
        </div>
      </div>
    `;
  }

  goToQuestion(index) {
    this.currentQuestionIndex = index;
    this.renderQuestion();
  }

  submitExam() {
    const unanswered = this.userAnswers.filter(a => a === null).length;
    
    if (unanswered > 0 && !confirm(`You have ${unanswered} unanswered questions. Submit anyway?`)) {
      return;
    }

    this.examEndTime = new Date();
    this.showResults();
  }

  showResults() {
    const container = document.getElementById('exam-container');
    const score = this.calculateScore();
    const timeTaken = Math.round((this.examEndTime - this.examStartTime) / 1000 / 60);
    const bySection = this.getScoreBySection();

    container.innerHTML = `
      <div class="exam-results">
        <h2>🎉 Exam Complete!</h2>
        
        <div class="score-summary">
          <div class="score-circle ${score.percentage >= 70 ? 'pass' : 'fail'}">
            <div class="score-percentage">${score.percentage}%</div>
            <div class="score-label">${score.correct} / ${score.total}</div>
          </div>
          <div class="score-details">
            <p class="score-status ${score.percentage >= 70 ? 'pass' : 'fail'}">
              ${score.percentage >= 70 ? '✅ Passing Score!' : '❌ Keep Practicing'}
            </p>
            <p>Time Taken: ${timeTaken} minutes</p>
            <p>Correct: ${score.correct} | Incorrect: ${score.incorrect} | Unanswered: ${score.unanswered}</p>
          </div>
        </div>

        <div class="section-breakdown">
          <h3>Performance by Topic</h3>
          ${Object.entries(bySection).map(([section, stats]) => `
            <div class="section-score">
              <div class="section-name">${section}</div>
              <div class="section-bar">
                <div class="section-bar-fill" style="width: ${stats.percentage}%"></div>
              </div>
              <div class="section-stats">${stats.correct}/${stats.total} (${stats.percentage}%)</div>
            </div>
          `).join('')}
        </div>

        <div class="results-actions">
          <button class="nav-btn" onclick="exam.reviewAnswers()">
            📝 Review Answers
          </button>
          <button class="nav-btn" onclick="exam.retakeExam()">
            🔄 Retake Exam
          </button>
          <button class="nav-btn primary" onclick="exam.renderExamStart()">
            🏠 Back to Start
          </button>
        </div>
      </div>
    `;
  }

  reviewAnswers() {
    const container = document.getElementById('exam-container');
    
    container.innerHTML = `
      <div class="answer-review">
        <h2>Answer Review</h2>
        <div class="review-filters">
          <button class="filter-btn active" onclick="exam.filterReview('all')">All</button>
          <button class="filter-btn" onclick="exam.filterReview('correct')">Correct</button>
          <button class="filter-btn" onclick="exam.filterReview('incorrect')">Incorrect</button>
          <button class="filter-btn" onclick="exam.filterReview('unanswered')">Unanswered</button>
        </div>
        
        <div class="review-questions">
          ${this.questions.map((q, index) => {
            const userAnswer = this.userAnswers[index];
            const isCorrect = userAnswer === q.correct;
            const status = userAnswer === null ? 'unanswered' : (isCorrect ? 'correct' : 'incorrect');
            
            return `
              <div class="review-item ${status}" data-status="${status}">
                <div class="review-header">
                  <span class="review-number">Q${index + 1}</span>
                  <span class="review-section">${q.section}</span>
                  <span class="review-status ${status}">${
                    status === 'correct' ? '✅' : status === 'incorrect' ? '❌' : '⚠️'
                  }</span>
                </div>
                <div class="review-question">${q.question}</div>
                <div class="review-answers">
                  ${q.choices.map((choice, i) => `
                    <div class="review-choice ${
                      i === q.correct ? 'correct-answer' : ''
                    } ${
                      i === userAnswer ? 'user-answer' : ''
                    }">
                      ${i === q.correct ? '✓ ' : ''}${choice}
                      ${i === userAnswer && i !== q.correct ? ' (Your answer)' : ''}
                    </div>
                  `).join('')}
                </div>
                <div class="review-explanation">
                  <strong>Explanation:</strong> ${q.explanation}
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <button class="nav-btn" onclick="exam.showResults()">
          ← Back to Results
        </button>
      </div>
    `;
  }

  filterReview(filter) {
    const items = document.querySelectorAll('.review-item');
    const buttons = document.querySelectorAll('.filter-btn');
    
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    items.forEach(item => {
      if (filter === 'all' || item.dataset.status === filter) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  }

  retakeExam() {
    this.currentQuestionIndex = 0;
    this.userAnswers = new Array(this.questions.length).fill(null);
    this.examStartTime = new Date();
    this.renderQuestion();
  }

  calculateScore() {
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;

    this.userAnswers.forEach((answer, index) => {
      if (answer === null) {
        unanswered++;
      } else if (answer === this.questions[index].correct) {
        correct++;
      } else {
        incorrect++;
      }
    });

    return {
      correct,
      incorrect,
      unanswered,
      total: this.questions.length,
      percentage: Math.round((correct / this.questions.length) * 100)
    };
  }

  getScoreBySection() {
    const sections = {};
    
    this.questions.forEach((q, index) => {
      if (!sections[q.section]) {
        sections[q.section] = { correct: 0, total: 0 };
      }
      sections[q.section].total++;
      
      if (this.userAnswers[index] === q.correct) {
        sections[q.section].correct++;
      }
    });

    Object.keys(sections).forEach(section => {
      sections[section].percentage = Math.round(
        (sections[section].correct / sections[section].total) * 100
      );
    });

    return sections;
  }

  groupQuestionsBySection() {
    const sections = {};
    
    this.questions.forEach((q, index) => {
      if (!sections[q.section]) {
        sections[q.section] = [];
      }
      sections[q.section].push({ ...q, index });
    });

    return sections;
  }

  getUniqueSections() {
    return [...new Set(this.questions.map(q => q.section))];
  }

  renderError(message) {
    const container = document.getElementById('exam-container');
    container.innerHTML = `
      <div class="exam-error">
        <h2>⚠️ Error</h2>
        <p>${message}</p>
        <button class="nav-btn" onclick="location.reload()">Reload Page</button>
      </div>
    `;
  }
}

// Initialize exam when page loads
let exam;
document.addEventListener('DOMContentLoaded', () => {
  exam = new CGOAExam();
});
