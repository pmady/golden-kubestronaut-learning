# CNPA Interactive Demo Exam

Welcome to the **Cloud Native Platform Architect (CNPA)** interactive demo exam! Test your knowledge with **40 questions** covering platform engineering fundamentals.

<style>
.quiz-container { max-width: 900px; margin: 0 auto; padding: 20px; }
.quiz-header { background: linear-gradient(135deg, #00695c 0%, #26a69a 100%); color: white; padding: 30px; border-radius: 15px; text-align: center; margin-bottom: 30px; }
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
.progress-fill { height: 100%; background: linear-gradient(90deg, #00695c, #26a69a); transition: width 0.3s; border-radius: 6px; }
.progress-text { display: flex; justify-content: space-between; margin-top: 10px; font-size: 0.95em; color: #666; }
.question-section { display: inline-block; background: #e0f2f1; color: #00695c; padding: 5px 15px; border-radius: 20px; font-size: 0.85em; margin-bottom: 15px; }
.question-text { font-size: 1.3em; line-height: 1.6; margin-bottom: 25px; color: #333; }
.choices { display: flex; flex-direction: column; gap: 12px; }
.choice { padding: 18px 20px; border: 2px solid #e0e0e0; border-radius: 12px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 15px; }
.choice:hover { border-color: #00695c; background: #e0f7f5; }
.choice.selected { border-color: #00695c; background: #e0f2f1; }
.choice.correct { border-color: #4CAF50; background: #e8f5e9; }
.choice.incorrect { border-color: #f44336; background: #ffebee; }
.choice-letter { width: 35px; height: 35px; border-radius: 50%; background: #f0f0f0; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0; }
.choice.selected .choice-letter { background: #00695c; color: white; }
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
.nav-btn.primary { background: linear-gradient(135deg, #00695c, #26a69a); color: white; }
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
.section-bar-fill { height: 100%; background: linear-gradient(90deg, #00695c, #26a69a); transition: width 0.5s; }
.section-score { min-width: 80px; text-align: right; font-weight: bold; }
.question-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(45px, 1fr)); gap: 8px; margin: 20px 0; }
.q-btn { width: 45px; height: 45px; border: 2px solid #e0e0e0; border-radius: 8px; cursor: pointer; font-weight: bold; transition: all 0.2s; background: white; }
.q-btn:hover { border-color: #00695c; }
.q-btn.answered { background: #4CAF50; color: white; border-color: #4CAF50; }
.q-btn.current { border-color: #00695c; box-shadow: 0 0 0 3px rgba(0,105,92,0.3); }
.review-item { background: white; border-radius: 12px; padding: 20px; margin-bottom: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); border-left: 4px solid #e0e0e0; }
.review-item.correct { border-left-color: #4CAF50; }
.review-item.incorrect { border-left-color: #f44336; }
.review-item.unanswered { border-left-color: #ff9800; }
.filter-buttons { display: flex; gap: 10px; justify-content: center; margin-bottom: 25px; flex-wrap: wrap; }
.filter-btn { padding: 10px 20px; border: 2px solid #e0e0e0; border-radius: 25px; cursor: pointer; background: white; transition: all 0.2s; }
.filter-btn:hover { border-color: #00695c; }
.filter-btn.active { background: #00695c; color: white; border-color: #00695c; }
@media (max-width: 600px) { .quiz-stats { flex-direction: column; } .mode-buttons { flex-direction: column; } .nav-buttons { flex-direction: column; } .nav-btn { width: 100%; } }
</style>

<div class="quiz-container" id="quizApp">
  <div class="quiz-header">
    <h2 style="margin:0;">🏗️ CNPA Practice Exam</h2>
    <div class="quiz-stats">
      <div class="stat-box"><div class="stat-number" id="totalQ">40</div><div class="stat-label">Questions</div></div>
      <div class="stat-box"><div class="stat-number" id="topicCount">6</div><div class="stat-label">Topics</div></div>
      <div class="stat-box"><div class="stat-number">~60</div><div class="stat-label">Minutes</div></div>
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
        <small>60 min countdown</small>
      </button>
    </div>
  </div>
  
  <div id="questionScreen" style="display:none;"></div>
  <div id="resultsScreen" style="display:none;"></div>
  <div id="reviewScreen" style="display:none;"></div>
</div>

<script>
const questions = [{"question":"Which of the following best describes declarative resource management?","choices":["Writing scripts that execute step-by-step instructions to configure infrastructure","Defining desired system state and allowing automation to reconcile it","Manually configuring systems via CLI tools","Using configuration files for CI/CD pipelines only"],"correct":1,"section":"Platform Engineering Core Fundamentals","explanation":"Declarative management focuses on defining the desired end state, letting the system reconcile the actual state automatically — a key Kubernetes and infrastructure-as-code principle."},{"question":"What is the primary goal of a platform engineering team?","choices":["Deliver applications directly to production","Build developer-focused platforms that abstract infrastructure complexity","Replace DevOps and SRE functions entirely","Focus solely on Kubernetes maintenance"],"correct":1,"section":"Platform Engineering Core Fundamentals","explanation":"Platform engineering aims to provide internal platforms that simplify and automate infrastructure for developers, not to replace DevOps or SRE."},{"question":"In a DevOps-enabled platform engineering model, which statement is most accurate?","choices":["Developers own all infrastructure configuration","The platform provides self-service capabilities and guardrails","Platform teams manually approve deployments","CI/CD pipelines are optional for mature teams"],"correct":1,"section":"Platform Engineering Core Fundamentals","explanation":"Platform teams create self-service capabilities with built-in governance to empower developers while maintaining standards."},{"question":"What is the key principle that differentiates GitOps from traditional continuous delivery?","choices":["Deployment pipelines execute from Jenkins directly","Git serves as the single source of truth for both app and infra state","All changes are applied manually via kubectl","Observability tools handle deployment rollouts"],"correct":1,"section":"Platform Engineering Core Fundamentals","explanation":"In GitOps, the entire desired system state is stored in Git, and automation ensures the cluster matches that state."},{"question":"What is the primary purpose of using traces, metrics, and logs together?","choices":["They all measure CPU usage","To provide a holistic view of system health and performance","To reduce monitoring costs","To secure workloads"],"correct":1,"section":"Platform Observability, Security, and Conformance","explanation":"Traces, metrics, and logs together provide observability into system behavior and performance, helping engineers diagnose and prevent issues."},{"question":"In Kubernetes, which mechanism ensures secure service-to-service communication?","choices":["Pod labels","Service Accounts","Mutual TLS (mTLS)","ConfigMaps"],"correct":2,"section":"Platform Observability, Security, and Conformance","explanation":"Mutual TLS (mTLS) provides encrypted and authenticated service-to-service communication, often managed via service mesh."},{"question":"Which tool or concept enforces policy-based governance in Kubernetes clusters?","choices":["Prometheus","Kyverno or Open Policy Agent (OPA)","Helm","Tekton"],"correct":1,"section":"Platform Observability, Security, and Conformance","explanation":"Policy engines like OPA and Kyverno enforce security and configuration policies dynamically across clusters."},{"question":"You need to prevent deployments from running containers as root. What is the most effective way to enforce this across clusters?","choices":["Manual code reviews","Admission control policies via OPA","Disabling root in the Dockerfile only","Using a linter tool in CI"],"correct":1,"section":"Platform Observability, Security, and Conformance","explanation":"Admission controllers using OPA or Kyverno enforce runtime security rules before resources are admitted into the cluster."},{"question":"What best describes the relationship between Continuous Integration (CI) and Continuous Delivery (CD)?","choices":["CI is about integration; CD is about delivering integrated code automatically","CI focuses on operations; CD focuses on code merges","CI/CD are the same process","CD happens before CI"],"correct":0,"section":"Continuous Delivery & Platform Engineering","explanation":"CI ensures new code integrates and passes tests, while CD automates deployment of that integrated code to environments."},{"question":"Which GitOps workflow is most common for deploying to Kubernetes?","choices":["Pull-based reconciliation using an operator like ArgoCD","Push-based CI triggers via Jenkins","Manual kubectl apply","Using Docker Compose for sync"],"correct":0,"section":"Continuous Delivery & Platform Engineering","explanation":"Most GitOps implementations use pull-based reconciliation, where tools like ArgoCD watch Git repositories and sync changes automatically."},{"question":"An application deploy failed due to misconfigured environment variables. How should a platform engineer approach incident response?","choices":["Roll back to the previous Git commit automatically","Delete the namespace and redeploy","Disable the pipeline","Re-run the same deployment"],"correct":0,"section":"Continuous Delivery & Platform Engineering","explanation":"GitOps enables safe rollbacks by reverting to a previous commit that represented a known good state."},{"question":"What is the Kubernetes reconciliation loop responsible for?","choices":["Updating logs in Prometheus","Continuously ensuring actual system state matches desired state","Creating namespaces automatically","Monitoring container runtime metrics"],"correct":1,"section":"Platform APIs and Provisioning Infrastructure","explanation":"The reconciliation loop is a Kubernetes control pattern that continually drives the system toward the desired state declared in manifests."},{"question":"What is a Custom Resource Definition (CRD) used for?","choices":["Managing default Kubernetes resources","Extending Kubernetes API with custom types","Controlling Pod scheduling","Scaling applications automatically"],"correct":1,"section":"Platform APIs and Provisioning Infrastructure","explanation":"CRDs let you define new API resource types, allowing custom controllers to manage them like native Kubernetes objects."},{"question":"You're integrating a new provisioning workflow using Kubernetes operators. What's the main benefit of this pattern?","choices":["It replaces Terraform entirely","Enables automation by codifying operational knowledge into controllers","Simplifies logging and monitoring","Reduces Kubernetes API latency"],"correct":1,"section":"Platform APIs and Provisioning Infrastructure","explanation":"The Operator pattern encodes domain-specific operations into Kubernetes-native automation, improving reliability and consistency."},{"question":"What is the primary goal of an Internal Developer Platform (IDP)?","choices":["Centralize all developer repositories","Provide self-service tools to improve developer productivity","Replace cloud infrastructure providers","Manage network routing and DNS"],"correct":1,"section":"IDPs and Developer Experience","explanation":"IDPs abstract complexity and allow developers to deploy and manage applications independently with built-in safety and consistency."},{"question":"Which of the following enhances adoption of a platform internally?","choices":["Developer portal with service catalog and templates","Restricting access to platform capabilities","Manual request forms for resource provisioning","Limiting observability access"],"correct":0,"section":"IDPs and Developer Experience","explanation":"Developer portals improve discoverability and ease of use, encouraging adoption of platform capabilities."},{"question":"How can AI/ML assist in platform automation?","choices":["Predicting build failures and optimizing resource provisioning","Replacing all engineers","Running manual approvals automatically","Disabling unused services randomly"],"correct":0,"section":"IDPs and Developer Experience","explanation":"AI/ML can enhance platform automation by analyzing trends, predicting failures, and optimizing scaling decisions."},{"question":"Which DORA metric directly measures delivery speed?","choices":["Change Failure Rate","Deployment Frequency","Mean Time to Detect (MTTD)","Code Coverage"],"correct":1,"section":"Measuring Your Platform","explanation":"Deployment Frequency measures how often changes are successfully deployed to production, reflecting delivery velocity."},{"question":"A platform team wants to show leadership how its work improves developer experience. Which metric best aligns with that goal?","choices":["Mean Time to Recovery (MTTR)","Platform adoption rate and self-service deployment frequency","CPU utilization","Total lines of code"],"correct":1,"section":"Measuring Your Platform","explanation":"Metrics that show platform usage and developer autonomy best illustrate improvements in developer experience."},{"question":"Platform efficiency should be measured primarily in terms of:","choices":["Total number of platform engineers","Developer productivity and infrastructure utilization","Number of scripts written","Size of the Kubernetes cluster"],"correct":1,"section":"Measuring Your Platform","explanation":"Platform efficiency is about maximizing developer productivity and resource efficiency, not headcount or cluster size."},{"question":"What is the main benefit of using Infrastructure as Code (IaC) in platform engineering?","choices":["Faster manual deployments","Repeatable, version-controlled infrastructure provisioning","Easier to change resources directly in production","Less dependency on CI/CD pipelines"],"correct":1,"section":"Platform Engineering Core Fundamentals","explanation":"IaC enables consistent, automated, and version-controlled provisioning, which is essential for reliable platform engineering."},{"question":"Which of the following is NOT a core goal of platform engineering?","choices":["Reducing developer cognitive load","Standardizing environments and tooling","Providing self-service automation","Manually approving every deployment"],"correct":3,"section":"Platform Engineering Core Fundamentals","explanation":"Manual approvals add friction. Platform engineering emphasizes automation and self-service with safe guardrails."},{"question":"Which tool is most commonly used to define declarative infrastructure in Kubernetes environments?","choices":["Terraform","Helm","Bash","Docker Compose"],"correct":0,"section":"Platform Engineering Core Fundamentals","explanation":"Terraform is a widely used declarative IaC tool for managing cloud and Kubernetes resources."},{"question":"A team wants to automate test execution and image building upon every commit. Which practice supports this goal?","choices":["Continuous Integration","Continuous Delivery","Incident Response","GitOps"],"correct":0,"section":"Platform Engineering Core Fundamentals","explanation":"Continuous Integration automates testing and building after each commit to maintain code quality."},{"question":"Which Kubernetes concept best represents declarative desired state management?","choices":["Kubelet Logs","Control Plane","Reconciliation Loop","Pod Autoscaler"],"correct":2,"section":"Platform Engineering Core Fundamentals","explanation":"The reconciliation loop continuously ensures actual cluster state matches the desired state defined in manifests."},{"question":"Which observability signal best helps identify latency between services?","choices":["Metrics","Traces","Logs","Events"],"correct":1,"section":"Platform Observability, Security, and Conformance","explanation":"Traces track the journey of requests across services, helping pinpoint latency or bottlenecks."},{"question":"What is the purpose of a Service Mesh in platform architecture?","choices":["Manage persistent volumes","Secure and observe service-to-service communication","Build container images","Schedule pods across nodes"],"correct":1,"section":"Platform Observability, Security, and Conformance","explanation":"A Service Mesh like Istio handles service communication, security, and observability across microservices."},{"question":"In Kubernetes, what is the best way to apply security context constraints automatically?","choices":["Manual pod reviews","Using Kyverno or OPA policies","Updating ConfigMaps","Using shell scripts"],"correct":1,"section":"Platform Observability, Security, and Conformance","explanation":"OPA or Kyverno policies automate enforcement of security contexts to ensure compliance across workloads."},{"question":"Which of the following best supports zero-trust networking in Kubernetes?","choices":["Flat network topology","Disabling NetworkPolicies","Using NetworkPolicies and mTLS","Running all services as root"],"correct":2,"section":"Platform Observability, Security, and Conformance","explanation":"Zero-trust models use network segmentation and mutual authentication (mTLS) to limit exposure."},{"question":"What is the benefit of having a centralized CI pipeline definition across teams?","choices":["Increased complexity","Standardized build and test processes","Manual execution of pipelines","Reduced automation"],"correct":1,"section":"Continuous Delivery & Platform Engineering","explanation":"Centralized CI templates ensure consistent, compliant, and reusable build processes across teams."},{"question":"Which GitOps component monitors repositories and reconciles Kubernetes clusters?","choices":["Prometheus","ArgoCD or Flux","Helm Charts","Grafana"],"correct":1,"section":"Continuous Delivery & Platform Engineering","explanation":"GitOps controllers like ArgoCD or Flux monitor Git repositories and reconcile state changes automatically."},{"question":"In a GitOps workflow, what happens when a new commit is pushed to the main branch?","choices":["A controller reconciles the environment to match the desired state in Git","The deployment must be triggered manually","The CI pipeline deletes all pods","Cluster access is revoked"],"correct":0,"section":"Continuous Delivery & Platform Engineering","explanation":"In GitOps, controllers like ArgoCD detect changes and automatically reconcile environments to match Git state."},{"question":"Which Kubernetes component is responsible for enforcing declared desired states?","choices":["API Server","Controller Manager","Scheduler","Kubelet"],"correct":1,"section":"Platform APIs and Provisioning Infrastructure","explanation":"The Controller Manager continuously reconciles actual resource states to match their desired specifications."},{"question":"Which of the following best describes the Kubernetes Operator pattern?","choices":["A manual process for cluster upgrades","A controller managing custom resources to automate operational tasks","A script that restarts pods","A built-in Kubernetes command"],"correct":1,"section":"Platform APIs and Provisioning Infrastructure","explanation":"Operators automate complex lifecycle management tasks by watching custom resources and acting accordingly."},{"question":"What advantage do APIs bring to internal developer platforms?","choices":["Enable self-service provisioning and integration","Reduce automation capabilities","Force manual approvals","Eliminate CI/CD needs"],"correct":0,"section":"Platform APIs and Provisioning Infrastructure","explanation":"APIs allow developers to provision, deploy, and integrate services autonomously through programmable interfaces."},{"question":"How does a developer portal improve platform adoption?","choices":["By requiring manual documentation updates","By providing a single interface for templates, APIs, and documentation","By limiting access to automation tools","By hiding platform features"],"correct":1,"section":"IDPs and Developer Experience","explanation":"Developer portals centralize discovery, onboarding, and automation, encouraging platform adoption."},{"question":"Which of the following helps measure developer experience improvements?","choices":["Increased self-service deployments and faster feedback loops","More manual change requests","Longer lead times for changes","Reduced number of automation tools"],"correct":0,"section":"IDPs and Developer Experience","explanation":"Improved developer experience manifests as shorter feedback cycles and increased self-service adoption."},{"question":"A team wants to know how quickly they recover from production incidents. Which metric should they use?","choices":["Lead Time for Changes","Mean Time to Recovery (MTTR)","Deployment Frequency","Change Failure Rate"],"correct":1,"section":"Measuring Your Platform","explanation":"MTTR measures how fast a system or service recovers from failure, indicating operational resilience."},{"question":"Which DORA metric measures change quality and stability?","choices":["Change Failure Rate","Deployment Frequency","Lead Time for Changes","Mean Time to Detect (MTTD)"],"correct":0,"section":"Measuring Your Platform","explanation":"Change Failure Rate measures the proportion of deployments causing production issues — a quality indicator."},{"question":"What combination of metrics best indicates overall platform performance and adoption?","choices":["MTTR, Deployment Frequency, Platform Adoption Rate","CPU Utilization, Network Bandwidth, Disk IO","Number of Pipelines, Lines of Code, Uptime","Pod Restarts, Node Count, Resource Limits"],"correct":0,"section":"Measuring Your Platform","explanation":"Combining reliability (MTTR), velocity (Deployment Frequency), and usage (Adoption Rate) gives a holistic view of platform health."}];

let currentQ = 0, userAnswers = [], mode = 'practice', timerInterval = null, timeLeft = 0, startTime = null;

function startQuiz(m) {
  mode = m; currentQ = 0; userAnswers = new Array(questions.length).fill(null); startTime = new Date();
  document.getElementById('startScreen').style.display = 'none';
  document.getElementById('questionScreen').style.display = 'block';
  if (mode === 'timed') { timeLeft = 60 * 60; document.getElementById('timerDisplay').style.display = 'inline-block'; startTimer(); }
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

- [Sample Questions](./sample-questions.md)
- [CNCF Platform Engineering Documentation](https://tag-app-delivery.cncf.io/whitepapers/platforms/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)

[← Back to CNPA Overview](./README.md)
