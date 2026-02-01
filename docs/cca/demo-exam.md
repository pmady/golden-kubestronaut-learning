# CCA Interactive Demo Exam

Welcome to the **Cilium Certified Associate (CCA)** interactive demo exam! Test your knowledge with **52 questions** covering advanced Cilium networking, security, and operations.

<style>
.quiz-container { max-width: 900px; margin: 0 auto; padding: 20px; }
.quiz-header { background: linear-gradient(135deg, #00897b 0%, #26a69a 100%); color: white; padding: 30px; border-radius: 15px; text-align: center; margin-bottom: 30px; }
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
.progress-fill { height: 100%; background: linear-gradient(90deg, #00897b, #26a69a); transition: width 0.3s; border-radius: 6px; }
.progress-text { display: flex; justify-content: space-between; margin-top: 10px; font-size: 0.95em; color: #666; }
.question-section { display: inline-block; background: #e0f2f1; color: #00695c; padding: 5px 15px; border-radius: 20px; font-size: 0.85em; margin-bottom: 15px; }
.question-text { font-size: 1.3em; line-height: 1.6; margin-bottom: 25px; color: #333; }
.choices { display: flex; flex-direction: column; gap: 12px; }
.choice { padding: 18px 20px; border: 2px solid #e0e0e0; border-radius: 12px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 15px; }
.choice:hover { border-color: #00897b; background: #e0f2f1; }
.choice.selected { border-color: #00897b; background: #e0f2f1; }
.choice.correct { border-color: #4CAF50; background: #e8f5e9; }
.choice.incorrect { border-color: #f44336; background: #ffebee; }
.choice-letter { width: 35px; height: 35px; border-radius: 50%; background: #f0f0f0; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0; }
.choice.selected .choice-letter { background: #00897b; color: white; }
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
.nav-btn.primary { background: linear-gradient(135deg, #00897b, #26a69a); color: white; }
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
.section-bar-fill { height: 100%; background: linear-gradient(90deg, #00897b, #26a69a); transition: width 0.5s; }
.section-score { min-width: 80px; text-align: right; font-weight: bold; }
.question-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(45px, 1fr)); gap: 8px; margin: 20px 0; }
.q-btn { width: 45px; height: 45px; border: 2px solid #e0e0e0; border-radius: 8px; cursor: pointer; font-weight: bold; transition: all 0.2s; background: white; }
.q-btn:hover { border-color: #00897b; }
.q-btn.answered { background: #4CAF50; color: white; border-color: #4CAF50; }
.q-btn.current { border-color: #00897b; box-shadow: 0 0 0 3px rgba(0,137,123,0.3); }
.review-item { background: white; border-radius: 12px; padding: 20px; margin-bottom: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); border-left: 4px solid #e0e0e0; }
.review-item.correct { border-left-color: #4CAF50; }
.review-item.incorrect { border-left-color: #f44336; }
.review-item.unanswered { border-left-color: #ff9800; }
.filter-buttons { display: flex; gap: 10px; justify-content: center; margin-bottom: 25px; flex-wrap: wrap; }
.filter-btn { padding: 10px 20px; border: 2px solid #e0e0e0; border-radius: 25px; cursor: pointer; background: white; transition: all 0.2s; }
.filter-btn:hover { border-color: #00897b; }
.filter-btn.active { background: #00897b; color: white; border-color: #00897b; }
@media (max-width: 600px) { .quiz-stats { flex-direction: column; } .mode-buttons { flex-direction: column; } .nav-buttons { flex-direction: column; } .nav-btn { width: 100%; } }
</style>

<div class="quiz-container" id="quizApp">
  <div class="quiz-header">
    <h2 style="margin:0;">🔒 CCA Practice Exam</h2>
    <div class="quiz-stats">
      <div class="stat-box"><div class="stat-number" id="totalQ">52</div><div class="stat-label">Questions</div></div>
      <div class="stat-box"><div class="stat-number" id="topicCount">5</div><div class="stat-label">Topics</div></div>
      <div class="stat-box"><div class="stat-number">~78</div><div class="stat-label">Minutes</div></div>
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
        <small>78 min countdown</small>
      </button>
    </div>
  </div>
  
  <div id="questionScreen" style="display:none;"></div>
  <div id="resultsScreen" style="display:none;"></div>
  <div id="reviewScreen" style="display:none;"></div>
</div>

<script>
const questions = [{"question":"What is the primary technology that Cilium uses for networking and security?","choices":["iptables","Open vSwitch","eBPF","IPVS"],"correct":2,"section":"Cilium Fundamentals","explanation":"Cilium leverages eBPF (extended Berkeley Packet Filter) for high-performance networking and security."},{"question":"Which Cilium component runs on every node in the cluster?","choices":["Cilium Operator","Cilium Agent","Hubble Relay","Cilium CLI"],"correct":1,"section":"Cilium Architecture","explanation":"The Cilium Agent runs as a DaemonSet on every node to manage networking and security."},{"question":"What is the main purpose of the Cilium Operator?","choices":["Per-node networking","Cluster-wide operations and garbage collection","Network observability","Load balancing"],"correct":1,"section":"Cilium Architecture","explanation":"The Cilium Operator handles cluster-wide operations like IPAM management and garbage collection."},{"question":"Which Cilium CRD is used for namespace-scoped network policies?","choices":["CiliumClusterwideNetworkPolicy","CiliumNetworkPolicy","CiliumEndpoint","CiliumNode"],"correct":1,"section":"Cilium Security","explanation":"CiliumNetworkPolicy is the namespace-scoped CRD for defining network security policies."},{"question":"What layer can Cilium enforce network policies at?","choices":["Layer 3 only","Layer 4 only","Layer 3, 4, and 7","Layer 2 only"],"correct":2,"section":"Cilium Security","explanation":"Cilium can enforce policies at L3 (IP), L4 (TCP/UDP ports), and L7 (HTTP, gRPC, Kafka)."},{"question":"Which component provides network flow visibility in Cilium?","choices":["Cilium Agent","Cilium Operator","Hubble","Tetragon"],"correct":2,"section":"Hubble Observability","explanation":"Hubble provides deep network observability and flow visibility for Cilium."},{"question":"What is the default IPAM mode in Cilium?","choices":["Kubernetes host-scope","Cluster-scope","AWS ENI","Azure"],"correct":1,"section":"Cilium Networking","explanation":"Cluster-scope IPAM is the default where Cilium manages IP allocation across the cluster."},{"question":"Which encryption protocols does Cilium support for pod-to-pod encryption?","choices":["TLS only","IPsec and WireGuard","SSH","SSL"],"correct":1,"section":"Cilium Security","explanation":"Cilium supports transparent encryption using IPsec or WireGuard protocols."},{"question":"What is Cilium Cluster Mesh used for?","choices":["Pod networking within a cluster","Multi-cluster connectivity","Service mesh","Storage replication"],"correct":1,"section":"Cilium Networking","explanation":"Cluster Mesh enables connectivity and service discovery across multiple Kubernetes clusters."},{"question":"Which Cilium feature can replace kube-proxy?","choices":["Cilium Agent","eBPF-based kube-proxy replacement","Hubble","Cilium Operator"],"correct":1,"section":"Cilium Networking","explanation":"Cilium can replace kube-proxy with eBPF-based service load balancing for better performance."},{"question":"What is the purpose of CiliumClusterwideNetworkPolicy?","choices":["Apply policies to a single namespace","Apply policies across all namespaces","Configure cluster mesh","Manage node networking"],"correct":1,"section":"Cilium Security","explanation":"CiliumClusterwideNetworkPolicy applies security policies cluster-wide across all namespaces."},{"question":"Which command shows the status of Cilium on a node?","choices":["kubectl get cilium","cilium status","hubble status","cilium-agent status"],"correct":1,"section":"Cilium CLI","explanation":"The 'cilium status' command displays the health and configuration of Cilium."},{"question":"What is identity-based security in Cilium?","choices":["Using IP addresses for policies","Using labels instead of IPs for policy enforcement","Encrypting all traffic","Monitoring network flows"],"correct":1,"section":"Cilium Security","explanation":"Cilium uses identity-based security where policies reference pod labels, not IP addresses."},{"question":"Which Hubble command displays real-time network flows?","choices":["hubble status","hubble observe","hubble flows","hubble list"],"correct":1,"section":"Hubble Observability","explanation":"'hubble observe' displays real-time network flows in the cluster."},{"question":"What is the default port for Hubble Relay?","choices":["4240","4244","4245","8080"],"correct":1,"section":"Hubble Observability","explanation":"Hubble Relay listens on port 4244 by default."},{"question":"Which Cilium feature provides L7 protocol visibility?","choices":["eBPF maps","Envoy proxy integration","kube-proxy replacement","Cluster Mesh"],"correct":1,"section":"Cilium Security","explanation":"Cilium integrates with Envoy proxy for L7 protocol visibility and policy enforcement."},{"question":"What is the purpose of BPF maps in Cilium?","choices":["Store container images","Store networking state and policies","Cache DNS queries","Store logs"],"correct":1,"section":"Cilium Architecture","explanation":"BPF maps store networking state, policies, and connection tracking information."},{"question":"Which command installs Cilium using the CLI?","choices":["cilium deploy","cilium install","cilium setup","cilium init"],"correct":1,"section":"Cilium CLI","explanation":"'cilium install' deploys Cilium to a Kubernetes cluster."},{"question":"What is Cilium's host firewall used for?","choices":["Protect pods from external traffic","Protect the Kubernetes node from network attacks","Encrypt host traffic","Monitor host processes"],"correct":1,"section":"Cilium Security","explanation":"Cilium's host firewall protects the Kubernetes node itself from network attacks."},{"question":"Which Cilium networking mode provides the best performance?","choices":["Overlay mode","Direct routing mode","Tunneling mode","Bridge mode"],"correct":1,"section":"Cilium Networking","explanation":"Direct routing (native routing) provides better performance by avoiding encapsulation overhead."},{"question":"What is the purpose of Cilium's bandwidth manager?","choices":["Limit pod CPU usage","Rate limit network traffic","Monitor bandwidth usage","Compress network packets"],"correct":1,"section":"Cilium Networking","explanation":"The bandwidth manager provides rate limiting for pod network traffic using eBPF."},{"question":"Which CRD defines external endpoints in Cilium?","choices":["CiliumExternalWorkload","CiliumEndpoint","CiliumNode","CiliumIdentity"],"correct":0,"section":"Cilium Networking","explanation":"CiliumExternalWorkload defines external (non-Kubernetes) endpoints for Cilium policies."},{"question":"What is Tetragon?","choices":["Cilium's DNS proxy","eBPF-based security observability and runtime enforcement","Cilium's service mesh","Network flow analyzer"],"correct":1,"section":"Cilium Security","explanation":"Tetragon provides eBPF-based security observability and runtime enforcement."},{"question":"Which Cilium feature enables egress gateway functionality?","choices":["CiliumEgressGatewayPolicy","CiliumNetworkPolicy","CiliumClusterwideNetworkPolicy","CiliumEndpoint"],"correct":0,"section":"Cilium Networking","explanation":"CiliumEgressGatewayPolicy routes egress traffic through specific gateway nodes."},{"question":"What is the purpose of Cilium's local redirect policy?","choices":["Redirect traffic to external services","Redirect traffic to node-local endpoints","Redirect DNS queries","Redirect logs to storage"],"correct":1,"section":"Cilium Networking","explanation":"Local redirect policy routes traffic to node-local endpoints for better performance."},{"question":"Which protocols does Cilium service mesh support?","choices":["HTTP only","gRPC only","HTTP, gRPC, and TCP","UDP only"],"correct":2,"section":"Cilium Service Mesh","explanation":"Cilium service mesh supports HTTP, gRPC, and TCP protocols."},{"question":"What is the benefit of Cilium's sidecar-free service mesh?","choices":["Easier debugging","Lower resource overhead","Better security","Simpler configuration"],"correct":1,"section":"Cilium Service Mesh","explanation":"Sidecar-free service mesh reduces resource overhead by using eBPF instead of sidecars."},{"question":"Which Cilium component handles DNS-based policies?","choices":["Cilium Agent's DNS proxy","Hubble","Cilium Operator","External DNS server"],"correct":0,"section":"Cilium Security","explanation":"Cilium Agent includes a DNS proxy for DNS-based network policies."},{"question":"What is the purpose of CiliumLoadBalancerIPPool?","choices":["Define pod IP ranges","Define IP pool for LoadBalancer services","Configure cluster mesh","Manage node IPs"],"correct":1,"section":"Cilium Networking","explanation":"CiliumLoadBalancerIPPool defines IP ranges for LoadBalancer service allocation."},{"question":"Which Cilium feature provides mutual TLS?","choices":["IPsec encryption","WireGuard encryption","Cilium Service Mesh mTLS","Host firewall"],"correct":2,"section":"Cilium Service Mesh","explanation":"Cilium Service Mesh provides mutual TLS for service-to-service authentication."},{"question":"What is the default tunnel mode in Cilium?","choices":["VXLAN","Geneve","GRE","IPIP"],"correct":0,"section":"Cilium Networking","explanation":"VXLAN is the default tunnel mode for overlay networking in Cilium."},{"question":"Which command validates Cilium's network connectivity?","choices":["cilium status","cilium connectivity test","cilium health","cilium check"],"correct":1,"section":"Cilium CLI","explanation":"'cilium connectivity test' validates network connectivity and policy enforcement."},{"question":"What is the purpose of Cilium's BGP support?","choices":["Container networking","Advertise service IPs to external routers","Internal pod routing","DNS resolution"],"correct":1,"section":"Cilium Networking","explanation":"Cilium's BGP support advertises LoadBalancer and pod IPs to external BGP routers."},{"question":"Which Cilium feature enables XDP acceleration?","choices":["eBPF maps","XDP-based load balancing","Envoy proxy","Hubble"],"correct":1,"section":"Cilium Networking","explanation":"XDP (eXpress Data Path) provides hardware-level packet processing acceleration."},{"question":"What is the purpose of Cilium's policy audit mode?","choices":["Enforce all policies strictly","Log policy violations without blocking","Disable all policies","Export policies to files"],"correct":1,"section":"Cilium Security","explanation":"Audit mode logs policy violations without blocking traffic, useful for policy testing."},{"question":"Which annotation enables L7 proxy visibility?","choices":["cilium.io/proxy-visibility","policy.cilium.io/proxy-visibility","io.cilium/l7-proxy","cilium.io/l7-visibility"],"correct":1,"section":"Cilium Security","explanation":"The policy.cilium.io/proxy-visibility annotation enables L7 protocol visibility."},{"question":"What is CiliumBGPPeeringPolicy?","choices":["A network policy for BGP traffic","Configuration for BGP peering with external routers","A cluster mesh configuration","A load balancer policy"],"correct":1,"section":"Cilium Networking","explanation":"CiliumBGPPeeringPolicy configures BGP peering with external routers."},{"question":"Which Cilium feature provides network flow logs?","choices":["Cilium Agent logs","Hubble flow logs","Kubernetes events","Cilium Operator logs"],"correct":1,"section":"Hubble Observability","explanation":"Hubble provides detailed network flow logs for observability."},{"question":"What is the purpose of Cilium's masquerading?","choices":["Hide pod identities","SNAT for egress traffic","Encrypt traffic","Load balance requests"],"correct":1,"section":"Cilium Networking","explanation":"Masquerading performs SNAT on egress traffic leaving the cluster."},{"question":"Which Cilium component manages IP address allocation?","choices":["Cilium Agent","Cilium Operator","Hubble","Cilium CNI"],"correct":1,"section":"Cilium Architecture","explanation":"The Cilium Operator manages cluster-wide IPAM operations."},{"question":"What is the purpose of CiliumNode CRD?","choices":["Store node network configuration","Define network policies","Configure Hubble","Manage cluster mesh"],"correct":0,"section":"Cilium Architecture","explanation":"CiliumNode CRD stores per-node network configuration and status."},{"question":"Which Cilium feature enables socket-level load balancing?","choices":["eBPF socket LB","kube-proxy replacement","Envoy proxy","Cluster Mesh"],"correct":0,"section":"Cilium Networking","explanation":"eBPF socket-level load balancing provides efficient service load balancing."},{"question":"What is the purpose of Cilium's health endpoint?","choices":["Monitor pod health","Provide cluster health status","Check Cilium agent health","Monitor network latency"],"correct":2,"section":"Cilium Architecture","explanation":"The health endpoint provides Cilium agent health and connectivity status."},{"question":"Which command shows Cilium endpoints?","choices":["cilium endpoint list","cilium get endpoints","cilium show endpoints","cilium endpoints"],"correct":0,"section":"Cilium CLI","explanation":"'cilium endpoint list' shows all Cilium-managed endpoints on the node."},{"question":"What is the purpose of Cilium's prefilter?","choices":["Filter logs","Early packet filtering using XDP","Filter DNS queries","Filter API requests"],"correct":1,"section":"Cilium Networking","explanation":"The prefilter uses XDP for early packet filtering before full processing."},{"question":"Which Cilium feature provides Kubernetes Ingress support?","choices":["Cilium Ingress Controller","Hubble","Cluster Mesh","Cilium Operator"],"correct":0,"section":"Cilium Networking","explanation":"Cilium includes an Ingress Controller for Kubernetes Ingress resources."},{"question":"What is the purpose of CiliumEnvoyConfig?","choices":["Configure Cilium Agent","Configure Envoy proxy settings","Configure Hubble","Configure cluster mesh"],"correct":1,"section":"Cilium Service Mesh","explanation":"CiliumEnvoyConfig allows custom Envoy proxy configuration for L7 policies."},{"question":"Which Cilium mode is recommended for cloud environments?","choices":["Overlay mode","Native routing with cloud integration","Tunneling mode","Bridge mode"],"correct":1,"section":"Cilium Networking","explanation":"Native routing with cloud-specific IPAM (AWS ENI, Azure, GKE) is recommended for clouds."},{"question":"What is the purpose of Cilium's endpoint health probing?","choices":["Check pod readiness","Verify network connectivity between endpoints","Monitor CPU usage","Check storage availability"],"correct":1,"section":"Cilium Architecture","explanation":"Endpoint health probing verifies network connectivity between Cilium-managed endpoints."},{"question":"Which Cilium feature enables Gateway API support?","choices":["Cilium Gateway API Controller","Hubble Gateway","Cluster Mesh Gateway","Cilium Operator Gateway"],"correct":0,"section":"Cilium Networking","explanation":"Cilium includes a Gateway API Controller for Kubernetes Gateway API resources."},{"question":"What is the purpose of Cilium's node-to-node encryption?","choices":["Encrypt pod-to-pod traffic only","Encrypt all traffic between nodes","Encrypt DNS queries","Encrypt API server traffic"],"correct":1,"section":"Cilium Security","explanation":"Node-to-node encryption secures all traffic between Kubernetes nodes."},{"question":"Which Cilium feature provides service affinity?","choices":["Session affinity using eBPF","Envoy proxy affinity","Cluster Mesh affinity","DNS-based affinity"],"correct":0,"section":"Cilium Networking","explanation":"Cilium provides session affinity for services using eBPF-based connection tracking."}];

let currentQ = 0, userAnswers = [], mode = 'practice', timerInterval = null, timeLeft = 0, startTime = null;

function startQuiz(m) {
  mode = m; currentQ = 0; userAnswers = new Array(questions.length).fill(null); startTime = new Date();
  document.getElementById('startScreen').style.display = 'none';
  document.getElementById('questionScreen').style.display = 'block';
  if (mode === 'timed') { timeLeft = 78 * 60; document.getElementById('timerDisplay').style.display = 'inline-block'; startTimer(); }
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

- [Cilium Documentation](https://docs.cilium.io/)
- [eBPF.io](https://ebpf.io/)
- [Cilium Service Mesh](https://docs.cilium.io/en/stable/network/servicemesh/)

[← Back to CCA Overview](./README.md)
