# CAPA Interactive Demo Exam

Welcome to the **Certified Argo Project Associate (CAPA)** interactive demo exam! Test your knowledge with **34 questions** covering all Argo Project tools.

<style>
.quiz-container { max-width: 900px; margin: 0 auto; padding: 20px; }
.quiz-header { background: linear-gradient(135deg, #e65100 0%, #ff6d00 100%); color: white; padding: 30px; border-radius: 15px; text-align: center; margin-bottom: 30px; }
.quiz-stats { display: flex; justify-content: space-around; margin-top: 20px; flex-wrap: wrap; gap: 15px; }
.stat-box { background: rgba(255,255,255,0.2); padding: 15px 25px; border-radius: 10px; text-align: center; }
.stat-number { font-size: 2em; font-weight: bold; }
.stat-label { font-size: 0.9em; opacity: 0.9; }
.timer-display { font-size: 2.5em; font-weight: bold; padding: 15px 30px; background: rgba(255,255,255,0.2); border-radius: 10px; display: inline-block; margin-top: 15px; }
.timer-warning { background: #ff9800 !important; animation: pulse 1s infinite; }
.timer-critical { background: #f44336 !important; animation: pulse 0.5s infinite; }
@keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
.mode-buttons { display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; margin: 30px 0; }
.mode-btn { padding: 20px 30px; border: none; border-radius: 12px; cursor: pointer; font-size: 1.1em; font-weight: 600; transition: all 0.3s; display: flex; flex-direction: column; align-items: center; gap: 8px; min-width: 200px; }
.mode-btn:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
.mode-practice { background: #4CAF50; color: white; }
.mode-exam { background: #2196F3; color: white; }
.mode-timed { background: #ff5722; color: white; }
.mode-icon { font-size: 2em; }
.question-card { background: white; border-radius: 15px; padding: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); margin-bottom: 20px; }
.progress-section { margin-bottom: 25px; }
.progress-bar { height: 12px; background: #e0e0e0; border-radius: 6px; overflow: hidden; }
.progress-fill { height: 100%; background: linear-gradient(90deg, #e65100, #ff6d00); transition: width 0.3s; border-radius: 6px; }
.progress-text { display: flex; justify-content: space-between; margin-top: 10px; font-size: 0.95em; color: #666; }
.question-section { display: inline-block; background: #fff3e0; color: #e65100; padding: 5px 15px; border-radius: 20px; font-size: 0.85em; margin-bottom: 15px; }
.question-text { font-size: 1.3em; line-height: 1.6; margin-bottom: 25px; color: #333; }
.choices { display: flex; flex-direction: column; gap: 12px; }
.choice { padding: 18px 20px; border: 2px solid #e0e0e0; border-radius: 12px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 15px; }
.choice:hover { border-color: #e65100; background: #fff8f0; }
.choice.selected { border-color: #e65100; background: #fff3e0; }
.choice.correct { border-color: #4CAF50; background: #e8f5e9; }
.choice.incorrect { border-color: #f44336; background: #ffebee; }
.choice-letter { width: 35px; height: 35px; border-radius: 50%; background: #f0f0f0; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0; }
.choice.selected .choice-letter { background: #e65100; color: white; }
.choice.correct .choice-letter { background: #4CAF50; color: white; }
.choice.incorrect .choice-letter { background: #f44336; color: white; }
.explanation { margin-top: 20px; padding: 20px; border-radius: 12px; display: none; }
.explanation.show { display: block; animation: slideDown 0.3s ease; }
@keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
.explanation.correct { background: #e8f5e9; border-left: 4px solid #4CAF50; }
.explanation.incorrect { background: #ffebee; border-left: 4px solid #f44336; }
.nav-buttons { display: flex; justify-content: space-between; gap: 15px; margin-top: 25px; flex-wrap: wrap; }
.nav-btn { padding: 15px 30px; border: none; border-radius: 10px; cursor: pointer; font-size: 1em; font-weight: 600; transition: all 0.2s; }
.nav-btn:hover:not(:disabled) { transform: translateY(-2px); }
.nav-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.nav-btn.primary { background: linear-gradient(135deg, #e65100, #ff6d00); color: white; }
.nav-btn.secondary { background: #f5f5f5; color: #333; }
.nav-btn.submit { background: #4CAF50; color: white; }
.results-container { text-align: center; }
.score-circle { width: 200px; height: 200px; border-radius: 50%; margin: 30px auto; display: flex; flex-direction: column; align-items: center; justify-content: center; font-weight: bold; }
.score-circle.pass { background: linear-gradient(135deg, #4CAF50, #8BC34A); color: white; }
.score-circle.fail { background: linear-gradient(135deg, #f44336, #ff5722); color: white; }
.score-percent { font-size: 3em; }
.score-fraction { font-size: 1.2em; opacity: 0.9; }
.results-details { margin: 30px 0; font-size: 1.1em; }
.section-results { text-align: left; margin: 30px 0; }
.section-row { display: flex; align-items: center; gap: 15px; margin-bottom: 15px; padding: 15px; background: #f5f5f5; border-radius: 10px; }
.section-name { flex: 1; font-weight: 500; }
.section-bar { flex: 2; height: 20px; background: #e0e0e0; border-radius: 10px; overflow: hidden; }
.section-bar-fill { height: 100%; background: linear-gradient(90deg, #e65100, #ff6d00); transition: width 0.5s; }
.section-score { min-width: 80px; text-align: right; font-weight: bold; }
.question-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(45px, 1fr)); gap: 8px; margin: 20px 0; }
.q-btn { width: 45px; height: 45px; border: 2px solid #e0e0e0; border-radius: 8px; cursor: pointer; font-weight: bold; transition: all 0.2s; background: white; }
.q-btn:hover { border-color: #e65100; }
.q-btn.answered { background: #4CAF50; color: white; border-color: #4CAF50; }
.q-btn.current { border-color: #e65100; box-shadow: 0 0 0 3px rgba(230,81,0,0.3); }
.review-item { background: white; border-radius: 12px; padding: 20px; margin-bottom: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); border-left: 4px solid #e0e0e0; }
.review-item.correct { border-left-color: #4CAF50; }
.review-item.incorrect { border-left-color: #f44336; }
.review-item.unanswered { border-left-color: #ff9800; }
.filter-buttons { display: flex; gap: 10px; justify-content: center; margin-bottom: 25px; flex-wrap: wrap; }
.filter-btn { padding: 10px 20px; border: 2px solid #e0e0e0; border-radius: 25px; cursor: pointer; background: white; transition: all 0.2s; }
.filter-btn:hover { border-color: #e65100; }
.filter-btn.active { background: #e65100; color: white; border-color: #e65100; }
@media (max-width: 600px) { .quiz-stats { flex-direction: column; } .mode-buttons { flex-direction: column; } .nav-buttons { flex-direction: column; } .nav-btn { width: 100%; } }
</style>

<div class="quiz-container" id="quizApp">
  <div class="quiz-header">
    <h2 style="margin:0;">🚀 CAPA Practice Exam</h2>
    <div class="quiz-stats">
      <div class="stat-box"><div class="stat-number" id="totalQ">34</div><div class="stat-label">Questions</div></div>
      <div class="stat-box"><div class="stat-number" id="topicCount">4</div><div class="stat-label">Topics</div></div>
      <div class="stat-box"><div class="stat-number">~51</div><div class="stat-label">Minutes</div></div>
    </div>
    <div class="timer-display" id="timerDisplay" style="display:none;">00:00</div>
  </div>
  
  <div id="startScreen">
    <h3 style="text-align:center;">Choose Your Mode:</h3>
    <div class="mode-buttons">
      <button class="mode-btn mode-practice" onclick="startQuiz('practice')">
        <span class="mode-icon">📚</span>
        <span>Practice Mode</span>
        <small>Instant feedback</small>
      </button>
      <button class="mode-btn mode-exam" onclick="startQuiz('exam')">
        <span class="mode-icon">🎓</span>
        <span>Exam Mode</span>
        <small>Results at end</small>
      </button>
      <button class="mode-btn mode-timed" onclick="startQuiz('timed')">
        <span class="mode-icon">⏱️</span>
        <span>Timed Exam</span>
        <small>51 min countdown</small>
      </button>
    </div>
  </div>
  
  <div id="questionScreen" style="display:none;"></div>
  <div id="resultsScreen" style="display:none;"></div>
  <div id="reviewScreen" style="display:none;"></div>
</div>

<script>
const questions = [{"question":"Which of the following best describes an Argo Workflow?","choices":["A continuous delivery tool for Kubernetes","A container-native workflow engine for orchestrating parallel jobs","A progressive delivery controller","An event-driven automation framework"],"correct":1,"section":"Argo Workflows","explanation":"Argo Workflows is a container-native workflow engine for orchestrating parallel jobs on Kubernetes."},{"question":"In an Argo Workflow template, what is the purpose of the outputs section?","choices":["To define the workflow's exit conditions","To specify the artifacts produced by the template","To configure output logging","To set environment variables"],"correct":1,"section":"Argo Workflows","explanation":"The outputs section lists artifacts produced by the template which can be consumed by later steps."},{"question":"How do you specify that a workflow step should only execute if a previous step failed?","choices":["Using when: \"{{workflow.status}} == Failed\"","Using when: \"{{steps.STEPNAME.status}} == Failed\"","Using if: failed","Using condition: failed"],"correct":1,"section":"Argo Workflows","explanation":"You reference a prior step's status via steps.<name>.status inside a when expression."},{"question":"Which Argo Workflows feature allows you to share common workflow steps across multiple workflows?","choices":["Templates","WorkflowTemplates","SharedSteps","CommonWorkflows"],"correct":1,"section":"Argo Workflows","explanation":"WorkflowTemplates are reusable definitions that can be referenced by multiple Workflow CRs."},{"question":"What is the correct way to reference an input parameter in an Argo Workflow template?","choices":["$(inputs.parameters.PARAM_NAME)","{{inputs.parameters.PARAM_NAME}}","${inputs.parameters.PARAM_NAME}","%inputs.parameters.PARAM_NAME%"],"correct":1,"section":"Argo Workflows","explanation":"Parameters are substituted with the double-brace expression syntax."},{"question":"How do you specify a workflow should retry failed steps?","choices":["Using retryStrategy in the workflow spec","Using retry in each step","Using onFailure: retry","Using failurePolicy: Retry"],"correct":0,"section":"Argo Workflows","explanation":"Global or template-level retry behavior is configured with retryStrategy."},{"question":"Which command shows the logs of a specific workflow step?","choices":["argo logs <workflow-name>","argo logs <workflow-name> -f","argo logs <workflow-name> <pod-name>","argo logs <workflow-name> --step=<step-name>"],"correct":3,"section":"Argo Workflows","explanation":"The --step flag targets a specific step's pod logs."},{"question":"What is the purpose of the archiveLogs field in a workflow spec?","choices":["To save logs to a persistent volume","To enable log aggregation","To save logs as an artifact","To compress log files"],"correct":2,"section":"Argo Workflows","explanation":"archiveLogs causes logs to be stored as artifacts for later retrieval."},{"question":"Which of the following artifact types is NOT supported by Argo Workflows?","choices":["S3","Git","Artifactory","MongoDB"],"correct":3,"section":"Argo Workflows","explanation":"MongoDB is not a supported artifact repository type; S3, Git, Artifactory are."},{"question":"What is the correct way to specify a workflow should run with a specific service account?","choices":["Using spec.serviceAccount","Using spec.serviceAccountName","Using metadata.serviceAccount","Using metadata.serviceAccountName"],"correct":1,"section":"Argo Workflows","explanation":"The Workflow spec field serviceAccountName selects the service account."},{"question":"Which feature allows you to suspend a workflow at a specific step?","choices":["Using suspend: true in the step","Using a suspend template","Using wait: true","Using pause: true"],"correct":1,"section":"Argo Workflows","explanation":"A template of type suspend halts execution until resumed manually."},{"question":"How do you specify a global timeout for an entire workflow?","choices":["Using spec.timeout","Using metadata.timeout","Using spec.activeDeadlineSeconds","Using spec.deadline"],"correct":2,"section":"Argo Workflows","explanation":"activeDeadlineSeconds limits total workflow runtime."},{"question":"Which component in Argo CD is responsible for maintaining the Git repository cache?","choices":["API Server","Repository Server","Application Controller","Dex Server"],"correct":1,"section":"Argo CD","explanation":"Repository Server handles manifest generation and caching of Git data."},{"question":"Which command shows the sync status of all applications?","choices":["argocd app list","argocd status","argocd get applications","argocd app status"],"correct":0,"section":"Argo CD","explanation":"argocd app list displays each application's sync and health."},{"question":"What is the purpose of the argocd-cm ConfigMap?","choices":["To store user credentials","To configure Argo CD settings","To store application definitions","To manage RBAC policies"],"correct":1,"section":"Argo CD","explanation":"argocd-cm contains core Argo CD configuration including repos & settings."},{"question":"Which Argo CD feature allows you to manage applications across multiple clusters?","choices":["Cluster management","Multi-cluster sync","Cluster registry","Application Sets"],"correct":3,"section":"Argo CD","explanation":"ApplicationSet can template apps targeting multiple clusters."},{"question":"Which of the following is NOT a valid sync option in Argo CD?","choices":["CreateNamespace","PruneLast","ForceSync","AutoHeal"],"correct":3,"section":"Argo CD","explanation":"AutoHeal is not a sync option; self-heal is part of automated sync settings."},{"question":"How do you enable SSO with GitHub in Argo CD?","choices":["Configure GitHub connector in Dex","Use GitHub OAuth directly","Enable GitHub integration","Configure GitHub OIDC"],"correct":0,"section":"Argo CD","explanation":"Dex connectors integrate GitHub for SSO."},{"question":"What is the purpose of the Application Health status in Argo CD?","choices":["To show Git repository status","To indicate sync status","To show resource operational status","To display cluster health"],"correct":2,"section":"Argo CD","explanation":"Health reflects live Kubernetes resource status (Healthy/Degraded/etc)."},{"question":"Which command syncs an application and skips hooks?","choices":["argocd app sync --no-hooks","argocd app sync --skip-hooks","argocd app sync --force","argocd app sync --ignore-hooks"],"correct":0,"section":"Argo CD","explanation":"--no-hooks prevents execution of hook resources during sync."},{"question":"What is the default port for the Argo CD API server?","choices":["8080","443","8443","80"],"correct":2,"section":"Argo CD","explanation":"Argo CD server defaults to HTTPS on 8443."},{"question":"How do you configure Helm value overrides in an Argo CD Application?","choices":["Using spec.source.helm.values","Using spec.helm.parameters","Using spec.source.helm.parameters","Using spec.helmValues"],"correct":0,"section":"Argo CD","explanation":"Helm values overrides reside in spec.source.helm.values."},{"question":"Which feature allows Argo CD to automatically detect and deploy applications?","choices":["Auto-discovery","App of Apps pattern","ApplicationSet","Auto-sync"],"correct":2,"section":"Argo CD","explanation":"ApplicationSet uses generators to discover targets and create Applications."},{"question":"What is the purpose of the 'argocd-server' service account?","choices":["To run the API server","To manage cluster access","To execute sync operations","To handle authentication"],"correct":0,"section":"Argo CD","explanation":"argocd-server SA is used by the API server pod."},{"question":"Which feature in Argo Rollouts allows gradual traffic shifting to a new version?","choices":["Progressive delivery","Canary deployment","Blue-Green deployment","Rolling update"],"correct":1,"section":"Argo Rollouts","explanation":"Canary strategy incrementally shifts traffic to the new version."},{"question":"Which Argo Rollouts feature allows automated promotion based on metrics?","choices":["Metric analysis","Analysis templates","Automated analysis","Promotion rules"],"correct":1,"section":"Argo Rollouts","explanation":"AnalysisTemplate defines metrics & success thresholds enabling automation."},{"question":"What is the purpose of the autoPromotionEnabled field in a blue-green deployment?","choices":["To automatically scale the deployment","To automatically promote the preview service to active","To enable automatic rollbacks","To enable progressive delivery"],"correct":1,"section":"Argo Rollouts","explanation":"autoPromotionEnabled triggers automatic promotion without manual command."},{"question":"Which command shows the status of a rollout?","choices":["kubectl argo rollouts get rollout","kubectl-argo-rollouts get rollout","argo rollouts status","kubectl get rollout"],"correct":1,"section":"Argo Rollouts","explanation":"kubectl-argo-rollouts get rollout <name> shows rollout status via plugin."},{"question":"What is the purpose of an AnalysisTemplate in Argo Rollouts?","choices":["To analyze deployment logs","To define metric queries and thresholds","To analyze resource usage","To monitor service health"],"correct":1,"section":"Argo Rollouts","explanation":"AnalysisTemplate resources hold metric provider queries and success/failure conditions."},{"question":"Which field specifies the maximum time for an analysis run?","choices":["maxDuration","timeout","analysisTimeout","duration"],"correct":0,"section":"Argo Rollouts","explanation":"maxDuration limits how long an AnalysisRun may execute."},{"question":"What is the primary purpose of Argo Events?","choices":["To manage Kubernetes events","To provide event-driven automation","To monitor cluster events","To log application events"],"correct":1,"section":"Argo Events","explanation":"Argo Events enables event-driven automation by wiring sources to actions."},{"question":"Which component in Argo Events receives events from event sources?","choices":["Event Bus","Sensor","Gateway","Controller"],"correct":1,"section":"Argo Events","explanation":"Sensors subscribe to event sources and trigger actions based on events."},{"question":"Which of the following is NOT a supported event source in Argo Events?","choices":["Webhook","Calendar","Kafka","GraphQL"],"correct":3,"section":"Argo Events","explanation":"GraphQL is not listed as a built-in event source; webhook, calendar, Kafka are supported."},{"question":"What is the purpose of a Sensor in Argo Events?","choices":["To generate events","To process and trigger actions based on events","To store event data","To monitor event sources"],"correct":1,"section":"Argo Events","explanation":"Sensors define triggers reacting to received events to launch workflows or other actions."}];

let currentQ = 0, userAnswers = [], mode = 'practice', timerInterval = null, timeLeft = 0, startTime = null;

function startQuiz(m) {
  mode = m; currentQ = 0; userAnswers = new Array(questions.length).fill(null); startTime = new Date();
  document.getElementById('startScreen').style.display = 'none';
  document.getElementById('questionScreen').style.display = 'block';
  if (mode === 'timed') { timeLeft = 51 * 60; document.getElementById('timerDisplay').style.display = 'inline-block'; startTimer(); }
  showQuestion();
}

function startTimer() {
  updateTimer();
  timerInterval = setInterval(() => { timeLeft--; updateTimer(); if (timeLeft <= 0) { clearInterval(timerInterval); alert('⏰ Time is up!'); submitQuiz(); } }, 1000);
}

function updateTimer() {
  const m = Math.floor(timeLeft / 60), s = timeLeft % 60;
  const display = document.getElementById('timerDisplay');
  display.textContent = `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
  display.className = 'timer-display' + (timeLeft <= 60 ? ' timer-critical' : timeLeft <= 300 ? ' timer-warning' : '');
}

function showQuestion() {
  const q = questions[currentQ]; const answered = userAnswers.filter(a => a !== null).length;
  const pct = ((currentQ + 1) / questions.length * 100).toFixed(0);
  let html = `<div class="question-card"><div class="progress-section"><div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div><div class="progress-text"><span>Question ${currentQ + 1} of ${questions.length}</span><span>Answered: ${answered}/${questions.length}</span></div></div><div class="question-section">${q.section}</div><div class="question-text">${q.question}</div><div class="choices">`;
  const letters = ['A', 'B', 'C', 'D'];
  q.choices.forEach((c, i) => {
    let cls = 'choice'; if (userAnswers[currentQ] === i) cls += ' selected';
    if (mode === 'practice' && userAnswers[currentQ] !== null) { if (i === q.correct) cls += ' correct'; else if (userAnswers[currentQ] === i) cls += ' incorrect'; }
    html += `<div class="${cls}" onclick="selectAnswer(${i})"><div class="choice-letter">${letters[i]}</div><div>${c}</div></div>`;
  });
  html += `</div>`;
  if (mode === 'practice' && userAnswers[currentQ] !== null) {
    const isCorrect = userAnswers[currentQ] === q.correct;
    html += `<div class="explanation show ${isCorrect ? 'correct' : 'incorrect'}"><div style="font-weight:bold;margin-bottom:10px;">${isCorrect ? '✅ Correct!' : '❌ Incorrect'}</div><div><strong>Answer:</strong> ${letters[q.correct]}. ${q.choices[q.correct]}</div><div style="margin-top:10px;">${q.explanation}</div></div>`;
  }
  html += `<div class="nav-buttons"><button class="nav-btn secondary" onclick="prevQuestion()" ${currentQ === 0 ? 'disabled' : ''}>← Previous</button><button class="nav-btn secondary" onclick="showQuestionNav()">📋 Question List</button>${currentQ < questions.length - 1 ? `<button class="nav-btn primary" onclick="nextQuestion()">Next →</button>` : `<button class="nav-btn submit" onclick="submitQuiz()">Submit Exam ✓</button>`}</div></div>`;
  document.getElementById('questionScreen').innerHTML = html;
}

function selectAnswer(i) { if (mode === 'practice' && userAnswers[currentQ] !== null) return; userAnswers[currentQ] = i; showQuestion(); }
function prevQuestion() { if (currentQ > 0) { currentQ--; showQuestion(); } }
function nextQuestion() { if (currentQ < questions.length - 1) { currentQ++; showQuestion(); } }

function showQuestionNav() {
  let html = `<div class="question-card"><h3 style="margin-bottom:20px;">📋 Question Navigator</h3><div class="question-grid">`;
  questions.forEach((_, i) => { let cls = 'q-btn'; if (userAnswers[i] !== null) cls += ' answered'; if (i === currentQ) cls += ' current'; html += `<button class="${cls}" onclick="goToQuestion(${i})">${i + 1}</button>`; });
  html += `</div><div class="nav-buttons" style="margin-top:25px;"><button class="nav-btn secondary" onclick="showQuestion()">← Back to Question</button><button class="nav-btn submit" onclick="submitQuiz()">Submit Exam ✓</button></div></div>`;
  document.getElementById('questionScreen').innerHTML = html;
}

function goToQuestion(i) { currentQ = i; showQuestion(); }

function submitQuiz() {
  const unanswered = userAnswers.filter(a => a === null).length;
  if (unanswered > 0 && !confirm(`You have ${unanswered} unanswered questions. Submit anyway?`)) return;
  if (timerInterval) clearInterval(timerInterval); document.getElementById('timerDisplay').style.display = 'none'; showResults();
}

function showResults() {
  document.getElementById('questionScreen').style.display = 'none'; document.getElementById('resultsScreen').style.display = 'block';
  let correct = 0; userAnswers.forEach((a, i) => { if (a === questions[i].correct) correct++; });
  const pct = Math.round(correct / questions.length * 100); const passed = pct >= 70; const timeTaken = Math.round((new Date() - startTime) / 60000);
  const sections = {}; questions.forEach((q, i) => { if (!sections[q.section]) sections[q.section] = { correct: 0, total: 0 }; sections[q.section].total++; if (userAnswers[i] === q.correct) sections[q.section].correct++; });
  let html = `<div class="results-container"><h2>${passed ? '🎉 Congratulations!' : '📚 Keep Practicing!'}</h2><div class="score-circle ${passed ? 'pass' : 'fail'}"><div class="score-percent">${pct}%</div><div class="score-fraction">${correct}/${questions.length}</div></div><div class="results-details"><p><strong>${passed ? '✅ PASSED' : '❌ Not Passed'}</strong> (70% required)</p><p>⏱️ Time: ${timeTaken} minutes</p><p>✓ Correct: ${correct} | ✗ Incorrect: ${questions.length - correct - userAnswers.filter(a=>a===null).length} | ⚠️ Unanswered: ${userAnswers.filter(a=>a===null).length}</p></div><h3>Performance by Topic</h3><div class="section-results">`;
  Object.entries(sections).forEach(([name, data]) => { const secPct = Math.round(data.correct / data.total * 100); html += `<div class="section-row"><div class="section-name">${name}</div><div class="section-bar"><div class="section-bar-fill" style="width:${secPct}%"></div></div><div class="section-score">${data.correct}/${data.total}</div></div>`; });
  html += `</div><div class="mode-buttons"><button class="mode-btn mode-practice" onclick="showReview()">📝 Review Answers</button><button class="mode-btn mode-exam" onclick="retakeQuiz()">🔄 Retake Quiz</button></div></div>`;
  document.getElementById('resultsScreen').innerHTML = html;
}

function showReview() { document.getElementById('resultsScreen').style.display = 'none'; document.getElementById('reviewScreen').style.display = 'block'; renderReview('all'); }

function renderReview(filter) {
  const letters = ['A', 'B', 'C', 'D'];
  let html = `<h2 style="text-align:center;">📝 Answer Review</h2><div class="filter-buttons"><button class="filter-btn ${filter==='all'?'active':''}" onclick="renderReview('all')">All</button><button class="filter-btn ${filter==='correct'?'active':''}" onclick="renderReview('correct')">✓ Correct</button><button class="filter-btn ${filter==='incorrect'?'active':''}" onclick="renderReview('incorrect')">✗ Incorrect</button><button class="filter-btn ${filter==='unanswered'?'active':''}" onclick="renderReview('unanswered')">⚠️ Unanswered</button></div>`;
  questions.forEach((q, i) => { const ua = userAnswers[i]; const isCorrect = ua === q.correct; const status = ua === null ? 'unanswered' : (isCorrect ? 'correct' : 'incorrect'); if (filter !== 'all' && filter !== status) return;
    html += `<div class="review-item ${status}"><div style="display:flex;justify-content:space-between;margin-bottom:10px;"><strong>Q${i+1}</strong><span class="question-section">${q.section}</span><span>${status === 'correct' ? '✅' : status === 'incorrect' ? '❌' : '⚠️'}</span></div><div style="margin-bottom:15px;">${q.question}</div>`;
    q.choices.forEach((c, j) => { let style = 'padding:8px 12px;margin:5px 0;border-radius:6px;'; if (j === q.correct) style += 'background:#e8f5e9;border-left:3px solid #4CAF50;'; else if (j === ua && !isCorrect) style += 'background:#ffebee;border-left:3px solid #f44336;'; html += `<div style="${style}"><strong>${letters[j]}.</strong> ${c} ${j===q.correct?'✓':''} ${j===ua&&!isCorrect?'(Your answer)':''}</div>`; });
    html += `<div style="margin-top:15px;padding:12px;background:#f5f5f5;border-radius:8px;"><strong>Explanation:</strong> ${q.explanation}</div></div>`; });
  html += `<div style="text-align:center;margin-top:30px;"><button class="nav-btn primary" onclick="backToResults()">← Back to Results</button></div>`;
  document.getElementById('reviewScreen').innerHTML = html;
}

function backToResults() { document.getElementById('reviewScreen').style.display = 'none'; document.getElementById('resultsScreen').style.display = 'block'; }
function retakeQuiz() { document.getElementById('resultsScreen').style.display = 'none'; document.getElementById('reviewScreen').style.display = 'none'; document.getElementById('startScreen').style.display = 'block'; }

document.getElementById('totalQ').textContent = questions.length;
document.getElementById('topicCount').textContent = [...new Set(questions.map(q => q.section))].length;
</script>

---

## Study Resources

- [Argo CD Fundamentals](./01-argocd-fundamentals.md)
- [Sample Questions](./sample-questions.md)
- [Argo CD Documentation](https://argo-cd.readthedocs.io/)
- [Argo Workflows Documentation](https://argoproj.github.io/workflows/)

[← Back to CAPA Overview](./README.md)
