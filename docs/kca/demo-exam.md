# KCA Interactive Demo Exam

Welcome to the **Kyverno Certified Associate (KCA)** interactive demo exam! Test your knowledge with **41 questions** covering Kyverno policies, validation, mutation, and generation.

<style>
.quiz-container { max-width: 900px; margin: 0 auto; padding: 20px; }
.quiz-header { background: linear-gradient(135deg, #6a1b9a 0%, #9c27b0 100%); color: white; padding: 30px; border-radius: 15px; text-align: center; margin-bottom: 30px; }
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
.progress-fill { height: 100%; background: linear-gradient(90deg, #6a1b9a, #9c27b0); transition: width 0.3s; border-radius: 6px; }
.progress-text { display: flex; justify-content: space-between; margin-top: 10px; font-size: 0.95em; color: #666; }
.question-section { display: inline-block; background: #f3e5f5; color: #6a1b9a; padding: 5px 15px; border-radius: 20px; font-size: 0.85em; margin-bottom: 15px; }
.question-text { font-size: 1.3em; line-height: 1.6; margin-bottom: 25px; color: #333; }
.choices { display: flex; flex-direction: column; gap: 12px; }
.choice { padding: 18px 20px; border: 2px solid #e0e0e0; border-radius: 12px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 15px; }
.choice:hover { border-color: #6a1b9a; background: #f3e5f5; }
.choice.selected { border-color: #6a1b9a; background: #f3e5f5; }
.choice.correct { border-color: #4CAF50; background: #e8f5e9; }
.choice.incorrect { border-color: #f44336; background: #ffebee; }
.choice-letter { width: 35px; height: 35px; border-radius: 50%; background: #f0f0f0; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0; }
.choice.selected .choice-letter { background: #6a1b9a; color: white; }
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
.nav-btn.primary { background: linear-gradient(135deg, #6a1b9a, #9c27b0); color: white; }
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
.section-bar-fill { height: 100%; background: linear-gradient(90deg, #6a1b9a, #9c27b0); transition: width 0.5s; }
.section-score { min-width: 80px; text-align: right; font-weight: bold; }
.question-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(45px, 1fr)); gap: 8px; margin: 20px 0; }
.q-btn { width: 45px; height: 45px; border: 2px solid #e0e0e0; border-radius: 8px; cursor: pointer; font-weight: bold; transition: all 0.2s; background: white; }
.q-btn:hover { border-color: #6a1b9a; }
.q-btn.answered { background: #4CAF50; color: white; border-color: #4CAF50; }
.q-btn.current { border-color: #6a1b9a; box-shadow: 0 0 0 3px rgba(106,27,154,0.3); }
.review-item { background: white; border-radius: 12px; padding: 20px; margin-bottom: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); border-left: 4px solid #e0e0e0; }
.review-item.correct { border-left-color: #4CAF50; }
.review-item.incorrect { border-left-color: #f44336; }
.review-item.unanswered { border-left-color: #ff9800; }
.filter-buttons { display: flex; gap: 10px; justify-content: center; margin-bottom: 25px; flex-wrap: wrap; }
.filter-btn { padding: 10px 20px; border: 2px solid #e0e0e0; border-radius: 25px; cursor: pointer; background: white; transition: all 0.2s; }
.filter-btn:hover { border-color: #6a1b9a; }
.filter-btn.active { background: #6a1b9a; color: white; border-color: #6a1b9a; }
@media (max-width: 600px) { .quiz-stats { flex-direction: column; } .mode-buttons { flex-direction: column; } .nav-buttons { flex-direction: column; } .nav-btn { width: 100%; } }
</style>

<div class="quiz-container" id="quizApp">
  <div class="quiz-header">
    <h2 style="margin:0;">🛡️ KCA Practice Exam</h2>
    <div class="quiz-stats">
      <div class="stat-box"><div class="stat-number" id="totalQ">41</div><div class="stat-label">Questions</div></div>
      <div class="stat-box"><div class="stat-number" id="topicCount">12</div><div class="stat-label">Topics</div></div>
      <div class="stat-box"><div class="stat-number">~62</div><div class="stat-label">Minutes</div></div>
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
        <small>62 min countdown</small>
      </button>
    </div>
  </div>
  
  <div id="questionScreen" style="display:none;"></div>
  <div id="resultsScreen" style="display:none;"></div>
  <div id="reviewScreen" style="display:none;"></div>
</div>

<script>
const questions = [{"question":"Which Kyverno policy type is used to ensure that all Pods have resource requests and limits defined?","choices":["Mutation","Validation","Generation","Audit"],"correct":1,"section":"Policy Validation","explanation":"Validation policies are used to check if resources meet specific criteria, such as having resource requests and limits."},{"question":"What does the `validationFailureAction: enforce` field do in a Kyverno policy?","choices":["Logs violations without blocking resources","Blocks the creation of non-compliant resources","Automatically modifies resources to meet policy requirements","Generates new resources based on policy rules"],"correct":1,"section":"Policy Enforcement","explanation":"The enforce action blocks non-compliant resources from being created or modified."},{"question":"What is the purpose of the `generate` rule in Kyverno?","choices":["To validate existing resources","To create new resources based on policy rules","To mutate existing resources","To audit resource compliance"],"correct":1,"section":"Policy Generation","explanation":"The `generate` rule is used to create new Kubernetes resources, such as NetworkPolicies or ResourceQuotas, based on policy definitions."},{"question":"You want to ensure that all new Namespaces in your cluster have a default NetworkPolicy applied. Which Kyverno feature should you use?","choices":["Validation","Mutation","Generation","Audit"],"correct":2,"section":"Scenario-Based","explanation":"The `generate` rule allows you to create new resources, such as NetworkPolicies, automatically when a Namespace is created."},{"question":"How do you restrict a Kyverno policy to only apply to resources in the `production` Namespace?","choices":["Use `match: namespace: production`","Use `match: resources: namespaces: production`","Use `match: any: resources: namespaces: - production`","Use `match: resources: namespaceSelector: matchLabels: env: production`"],"correct":2,"section":"Policy Matching","explanation":"This syntax ensures the policy only applies to resources within the specified Namespace."},{"question":"What is the purpose of the `mutate` rule in Kyverno?","choices":["To validate resources","To modify resources to meet policy requirements","To generate new resources","To audit resources"],"correct":1,"section":"Policy Mutation","explanation":"The `mutate` rule allows Kyverno to automatically update resources to comply with policy rules."},{"question":"What does the `validationFailureAction: audit` field do in a Kyverno policy?","choices":["Blocks non-compliant resources","Modifies non-compliant resources","Logs violations without blocking resources","Generates new resources"],"correct":2,"section":"Audit Mode","explanation":"The `audit` action logs policy violations but does not prevent resource creation or modification."},{"question":"How can you exclude a specific Namespace from a Kyverno policy?","choices":["Use `exclude: namespaces: [\"excluded-ns\"]`","Use `match: any: resources: namespaces: - excluded-ns`","Use `exclude: resources: namespaces: - excluded-ns`","Use `exclude: namespaceSelector: matchLabels: env: excluded`"],"correct":0,"section":"Policy Exceptions","explanation":"The `exclude` field allows you to specify Namespaces or other resources that should not be subject to the policy."},{"question":"Which of the following is a best practice for writing Kyverno policies?","choices":["Use broad `match` rules to cover all resources","Avoid using `exclude` rules to simplify policies","Use specific `match` and `exclude` rules to target only relevant resources","Always use `enforce` for all policies"],"correct":2,"section":"Policy Best Practices","explanation":"Specific rules help avoid unintended policy enforcement and improve maintainability."},{"question":"Which Kyverno feature allows you to automatically add labels to Pods that do not have them?","choices":["Validation","Mutation","Generation","Audit"],"correct":1,"section":"Policy Mutation","explanation":"The `mutate` rule can automatically add or modify fields, such as labels, in resources."},{"question":"What is the purpose of the `ClusterPolicy` resource in Kyverno?","choices":["To apply policies to a single Namespace","To apply policies cluster-wide","To generate new resources","To audit resources"],"correct":1,"section":"Policy Scope","explanation":"A `ClusterPolicy` applies policies to all Namespaces in the cluster, while a `Policy` applies to a single Namespace."},{"question":"Which Kyverno policy type is used to create ConfigMaps automatically when a Namespace is created?","choices":["Validation","Mutation","Generation","Audit"],"correct":2,"section":"Policy Generation","explanation":"The `generate` rule is used to create new resources, such as ConfigMaps, based on policy definitions."},{"question":"What is the default behavior of Kyverno when a resource does not comply with a validation policy?","choices":["The resource is created, and a warning is logged","The resource is blocked from being created","The resource is automatically modified to comply","The resource is deleted"],"correct":0,"section":"Policy Enforcement","explanation":"By default, Kyverno only blocks non-compliant resources when the policy is explicitly set to: `validationFailureAction: Enforce`"},{"question":"Which Kyverno feature allows you to test policies without affecting live resources?","choices":["Audit mode","Dry-run mode","Simulation mode","Test mode"],"correct":0,"section":"Policy Testing","explanation":"Audit mode allows you to test policies by logging violations without blocking or modifying resources."},{"question":"What is the purpose of the `preconditions` field in a Kyverno policy?","choices":["To define conditions that must be met before a policy is applied","To specify the resources that the policy should match","To exclude certain resources from the policy","To define the actions to take when a policy is violated"],"correct":0,"section":"Policy Preconditions","explanation":"The `preconditions` field allows you to define conditions that must be met before a policy is applied."},{"question":"Which Kyverno policy type is used to ensure that all containers in a Pod run as a non-root user?","choices":["Validation","Mutation","Generation","Audit"],"correct":0,"section":"Policy Validation","explanation":"Validation policies can enforce security best practices, such as running containers as non-root users."},{"question":"What is the purpose of the `context` field in a Kyverno policy?","choices":["To define the scope of the policy","To provide additional data for policy evaluation","To specify the resources that the policy should match","To exclude certain resources from the policy"],"correct":1,"section":"Policy Context","explanation":"The `context` field allows you to provide additional data for policy evaluation, such as variables or external data."},{"question":"Which Kyverno feature allows you to automatically add sidecar containers to Pods?","choices":["Validation","Mutation","Generation","Audit"],"correct":1,"section":"Policy Mutation","explanation":"The `mutate` rule can automatically add sidecar containers to Pods based on policy definitions."},{"question":"What is the purpose of the `variables` field in a Kyverno policy?","choices":["To define the scope of the policy","To provide reusable values for policy evaluation","To specify the resources that the policy should match","To exclude certain resources from the policy"],"correct":1,"section":"Policy Variables","explanation":"The `variables` field allows you to define reusable values for policy evaluation."},{"question":"Which Kyverno policy type is used to ensure that all Ingress resources have a specific annotation?","choices":["Validation","Mutation","Generation","Audit"],"correct":0,"section":"Policy Validation","explanation":"Validation policies can enforce the presence of specific annotations on resources."},{"question":"What is the purpose of the `generateExisting` field in a Kyverno policy?","choices":["To generate new resources","To update existing resources","To validate existing resources","To exclude existing resources from the policy"],"correct":1,"section":"Policy Generation","explanation":"The `generateExisting` field allows you to update existing resources based on policy definitions."},{"question":"Which Kyverno feature allows you to automatically add environment variables to containers?","choices":["Validation","Mutation","Generation","Audit"],"correct":1,"section":"Policy Mutation","explanation":"The `mutate` rule can automatically add environment variables to containers based on policy definitions."},{"question":"What is the purpose of the `background` field in a Kyverno policy?","choices":["To apply the policy to new resources only","To apply the policy to existing resources","To exclude certain resources from the policy","To define the scope of the policy"],"correct":1,"section":"Policy Background","explanation":"The `background` field allows you to apply the policy to existing resources."},{"question":"Which Kyverno policy type is used to ensure that all Services have a specific label?","choices":["Validation","Mutation","Generation","Audit"],"correct":0,"section":"Policy Validation","explanation":"Validation policies can enforce the presence of specific labels on resources."},{"question":"What is the purpose of the `failurePolicy` field in a Kyverno policy?","choices":["To define the actions to take when a policy is violated","To specify the resources that the policy should match","To exclude certain resources from the policy","To define the behavior when the policy engine fails"],"correct":3,"section":"Policy Failure","explanation":"The `failurePolicy` field defines the behavior when the policy engine fails, such as allowing or failing resources."},{"question":"Which Kyverno feature allows you to automatically add volume mounts to containers?","choices":["Validation","Mutation","Generation","Audit"],"correct":1,"section":"Policy Mutation","explanation":"The `mutate` rule can automatically add volume mounts to containers based on policy definitions."},{"question":"What is the purpose of the `schema` field in a Kyverno policy?","choices":["To define the scope of the policy","To validate the structure of resources","To specify the resources that the policy should match","To exclude certain resources from the policy"],"correct":1,"section":"Policy Schema","explanation":"The `schema` field allows you to validate the structure of resources against a schema."},{"question":"Which Kyverno policy type is used to ensure that all Deployments have a specific replica count?","choices":["Validation","Mutation","Generation","Audit"],"correct":0,"section":"Policy Validation","explanation":"Validation policies can enforce specific replica counts for Deployments."},{"question":"What does setting `useServerSideApply: true` in a Kyverno generate rule do?","choices":["Uses server-side apply so Kyverno owns managed fields on generated resources","Forces client-side apply with strategic merge","Disables generation during background scans","Increases the webhook timeout to 30 seconds"],"correct":0,"section":"Policy Generation","explanation":"When enabled, Kyverno uses server-side apply for generate rules so field ownership is tracked by the API server."},{"question":"Which Kyverno feature allows you to automatically add tolerations to Pods?","choices":["Validation","Mutation","Generation","Audit"],"correct":1,"section":"Policy Mutation","explanation":"The `mutate` rule can automatically add tolerations to Pods based on policy definitions."},{"question":"What is the purpose of the `clusterPolicy` field in Kyverno?","choices":["To apply policies to a single Namespace","To apply policies cluster-wide","To generate new resources","To audit resources"],"correct":1,"section":"Policy Scope","explanation":"A `ClusterPolicy` applies policies to all Namespaces in the cluster."},{"question":"Which Kyverno policy type is used to ensure that all PersistentVolumeClaims have a specific storage class?","choices":["Validation","Mutation","Generation","Audit"],"correct":0,"section":"Policy Validation","explanation":"Validation policies can enforce the use of specific storage classes for PersistentVolumeClaims."},{"question":"What is the purpose of the `mutateExisting` field in a Kyverno policy?","choices":["To generate new resources","To update existing resources","To validate existing resources","To exclude existing resources from the policy"],"correct":1,"section":"Policy Mutation","explanation":"The `mutateExisting` field allows you to update existing resources based on policy definitions."},{"question":"Which Kyverno feature allows you to automatically add security contexts to containers?","choices":["Validation","Mutation","Generation","Audit"],"correct":1,"section":"Policy Mutation","explanation":"The `mutate` rule can automatically add security contexts to containers based on policy definitions."},{"question":"Which Kyverno policy type is used to ensure that all Jobs have a specific backoff limit?","choices":["Validation","Mutation","Generation","Audit"],"correct":0,"section":"Policy Validation","explanation":"Validation policies can enforce specific backoff limits for Jobs."},{"question":"What does `background: true` primarily enable in a Kyverno policy?","choices":["Controls only admission-time mutation","Scans existing resources and produces PolicyReports","Disables validation rules","Defines the enforce/audit behavior for failures"],"correct":1,"section":"Policy Background","explanation":"Background mode scans existing resources and reports violations via PolicyReports."},{"question":"Which Kyverno feature allows you to automatically add affinity rules to Pods?","choices":["Validation","Mutation","Generation","Audit"],"correct":1,"section":"Policy Mutation","explanation":"The `mutate` rule can automatically add affinity rules to Pods based on policy definitions."},{"question":"In Kyverno 1.13+, what should replace the top-level `failurePolicy` field?","choices":["`webhookConfiguration.failurePolicy`","`validate.failureAction`","`admission.failurePolicy`","`reports.failurePolicy`"],"correct":0,"section":"Policy Failure","explanation":"The top-level `failurePolicy` is deprecated; use `webhookConfiguration.failurePolicy`."},{"question":"Which Kyverno policy type is used to ensure that all CronJobs have a specific concurrency policy?","choices":["Validation","Mutation","Generation","Audit"],"correct":0,"section":"Policy Validation","explanation":"Validation policies can enforce specific concurrency policies for CronJobs."},{"question":"What is the status of `schemaValidation` in modern Kyverno versions (1.11+)?","choices":["It must be set to true for all policies","Deprecated and has no effect","Controls cluster resource OpenAPI schemas","Enables JSON Schema checks for `validate.pattern`"],"correct":1,"section":"Policy Schema","explanation":"`schemaValidation` is deprecated and currently has no effect."},{"question":"Which Kyverno feature allows you to automatically add node selectors to Pods?","choices":["Validation","Mutation","Generation","Audit"],"correct":1,"section":"Policy Mutation","explanation":"The `mutate` rule can automatically add node selectors to Pods based on policy definitions."},{"question":"Where should `generateExisting` be configured in Kyverno 1.13+?","choices":["Under the `generate` rule","At the top-level of the `spec`","Under the `mutate` rule","In the Admission Controller configuration"],"correct":0,"section":"Policy Generation","explanation":"The top-level field is deprecated; set `generateExisting` on the generate rule itself."},{"question":"Which Kyverno policy type is used to ensure that all StatefulSets have a specific pod management policy?","choices":["Validation","Mutation","Generation","Audit"],"correct":0,"section":"Policy Validation","explanation":"Validation policies can enforce specific pod management policies for StatefulSets."},{"question":"Which expression language does Kyverno use with variables defined via `context`?","choices":["JMESPath","JSONPath","CEL","Rego"],"correct":0,"section":"Policy Context","explanation":"Kyverno evaluates variables and conditions using JMESPath expressions."},{"question":"Which Kyverno feature allows you to automatically add topology spread constraints to Pods?","choices":["Validation","Mutation","Generation","Audit"],"correct":1,"section":"Policy Mutation","explanation":"The `mutate` rule can automatically add topology spread constraints to Pods based on policy definitions."},{"question":"If a rule's `preconditions` evaluate to false, what happens?","choices":["The rule is skipped and not applied","Admission is blocked with a failure","Mutation still applies but validation is skipped","The entire policy is disabled"],"correct":0,"section":"Policy Preconditions","explanation":"Preconditions gate rule execution; when false, the rule is not evaluated."}];

let currentQ = 0, userAnswers = [], mode = 'practice', timerInterval = null, timeLeft = 0, startTime = null;

function startQuiz(m) {
  mode = m; currentQ = 0; userAnswers = new Array(questions.length).fill(null); startTime = new Date();
  document.getElementById('startScreen').style.display = 'none';
  document.getElementById('questionScreen').style.display = 'block';
  if (mode === 'timed') { timeLeft = 62 * 60; document.getElementById('timerDisplay').style.display = 'inline-block'; startTimer(); }
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

- [Kyverno Documentation](https://kyverno.io/docs/)
- [Kyverno Policies](https://kyverno.io/policies/)
- [Kyverno Playground](https://playground.kyverno.io/)

[← Back to KCA Overview](./README.md)
