# CGOA Interactive Demo Exam

Welcome to the **Certified GitOps Associate (CGOA)** interactive demo exam! Test your knowledge with **68 questions** covering all CGOA domains.

<style>
.quiz-container { max-width: 900px; margin: 0 auto; padding: 20px; }
.quiz-header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 15px; text-align: center; margin-bottom: 30px; }
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
.progress-fill { height: 100%; background: linear-gradient(90deg, #667eea, #764ba2); transition: width 0.3s; border-radius: 6px; }
.progress-text { display: flex; justify-content: space-between; margin-top: 10px; font-size: 0.95em; color: #666; }
.question-section { display: inline-block; background: #e3f2fd; color: #1976d2; padding: 5px 15px; border-radius: 20px; font-size: 0.85em; margin-bottom: 15px; }
.question-text { font-size: 1.3em; line-height: 1.6; margin-bottom: 25px; color: #333; }
.choices { display: flex; flex-direction: column; gap: 12px; }
.choice { padding: 18px 20px; border: 2px solid #e0e0e0; border-radius: 12px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 15px; }
.choice:hover { border-color: #667eea; background: #f5f5ff; }
.choice.selected { border-color: #667eea; background: #e8eaf6; }
.choice.correct { border-color: #4CAF50; background: #e8f5e9; }
.choice.incorrect { border-color: #f44336; background: #ffebee; }
.choice-letter { width: 35px; height: 35px; border-radius: 50%; background: #f0f0f0; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0; }
.choice.selected .choice-letter { background: #667eea; color: white; }
.choice.correct .choice-letter { background: #4CAF50; color: white; }
.choice.incorrect .choice-letter { background: #f44336; color: white; }
.explanation { margin-top: 20px; padding: 20px; border-radius: 12px; display: none; }
.explanation.show { display: block; animation: slideDown 0.3s ease; }
@keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
.explanation.correct { background: #e8f5e9; border-left: 4px solid #4CAF50; }
.explanation.incorrect { background: #ffebee; border-left: 4px solid #f44336; }
.explanation-title { font-weight: bold; margin-bottom: 10px; display: flex; align-items: center; gap: 10px; }
.nav-buttons { display: flex; justify-content: space-between; gap: 15px; margin-top: 25px; flex-wrap: wrap; }
.nav-btn { padding: 15px 30px; border: none; border-radius: 10px; cursor: pointer; font-size: 1em; font-weight: 600; transition: all 0.2s; }
.nav-btn:hover:not(:disabled) { transform: translateY(-2px); }
.nav-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.nav-btn.primary { background: linear-gradient(135deg, #667eea, #764ba2); color: white; }
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
.section-bar-fill { height: 100%; background: linear-gradient(90deg, #667eea, #764ba2); transition: width 0.5s; }
.section-score { min-width: 80px; text-align: right; font-weight: bold; }
.question-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(45px, 1fr)); gap: 8px; margin: 20px 0; }
.q-btn { width: 45px; height: 45px; border: 2px solid #e0e0e0; border-radius: 8px; cursor: pointer; font-weight: bold; transition: all 0.2s; background: white; }
.q-btn:hover { border-color: #667eea; }
.q-btn.answered { background: #4CAF50; color: white; border-color: #4CAF50; }
.q-btn.current { border-color: #667eea; box-shadow: 0 0 0 3px rgba(102,126,234,0.3); }
.review-item { background: white; border-radius: 12px; padding: 20px; margin-bottom: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); border-left: 4px solid #e0e0e0; }
.review-item.correct { border-left-color: #4CAF50; }
.review-item.incorrect { border-left-color: #f44336; }
.review-item.unanswered { border-left-color: #ff9800; }
.filter-buttons { display: flex; gap: 10px; justify-content: center; margin-bottom: 25px; flex-wrap: wrap; }
.filter-btn { padding: 10px 20px; border: 2px solid #e0e0e0; border-radius: 25px; cursor: pointer; background: white; transition: all 0.2s; }
.filter-btn:hover { border-color: #667eea; }
.filter-btn.active { background: #667eea; color: white; border-color: #667eea; }
@media (max-width: 600px) { .quiz-stats { flex-direction: column; } .mode-buttons { flex-direction: column; } .nav-buttons { flex-direction: column; } .nav-btn { width: 100%; } }
</style>

<div class="quiz-container" id="quizApp">
  <div class="quiz-header">
    <h2 style="margin:0;">🎯 CGOA Practice Exam</h2>
    <div class="quiz-stats">
      <div class="stat-box"><div class="stat-number" id="totalQ">68</div><div class="stat-label">Questions</div></div>
      <div class="stat-box"><div class="stat-number" id="topicCount">17</div><div class="stat-label">Topics</div></div>
      <div class="stat-box"><div class="stat-number">~102</div><div class="stat-label">Minutes</div></div>
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
        <small>102 min countdown</small>
      </button>
    </div>
  </div>
  
  <div id="questionScreen" style="display:none;"></div>
  <div id="resultsScreen" style="display:none;"></div>
  <div id="reviewScreen" style="display:none;"></div>
</div>

<script>
const questions = [{"question":"Which of the following best describes GitOps?","choices":["A tool for managing Git repositories","A declarative approach to continuous delivery using Git as the source of truth","A type of version control system","A method for managing application logs"],"correct":1,"section":"GitOps Terminology","explanation":"GitOps is fundamentally about using Git as the single source of truth for declarative infrastructure and applications."},{"question":"What is the primary role of a GitOps operator?","choices":["To manually deploy applications","To write deployment scripts","To monitor Git repositories and reconcile cluster state","To manage user access to Git repositories"],"correct":2,"section":"GitOps Terminology","explanation":"GitOps operators continuously monitor Git repositories and automatically reconcile the actual state of the cluster with the desired state defined in Git."},{"question":"Which component serves as the single source of truth in GitOps?","choices":["The Git repository","The production cluster","The CI pipeline","The container registry"],"correct":0,"section":"GitOps Terminology","explanation":"In GitOps, the Git repository serves as the single source of truth, containing the desired state of the entire system."},{"question":"What is meant by 'declarative configuration' in GitOps?","choices":["Using scripts to define system changes","Writing deployment documentation","Creating manual deployment procedures","Describing the desired system state rather than the steps to achieve it"],"correct":3,"section":"GitOps Terminology","explanation":"Declarative configuration focuses on what the end state should be, not the specific commands or steps to reach that state."},{"question":"Which term describes the process of ensuring the actual state matches the desired state?","choices":["State matching","Reconciliation","Deployment","Activation"],"correct":1,"section":"GitOps Terminology","explanation":"Reconciliation is the process of ensuring the actual state of the system matches the desired state defined in Git."},{"question":"What is drift in the context of GitOps?","choices":["When the actual state differs from the desired state","When code changes are pushed to production","When Git repositories are out of sync","When applications fail to deploy"],"correct":0,"section":"GitOps Terminology","explanation":"Drift occurs when the runtime environment (actual state) no longer matches the configuration defined in Git (desired state)."},{"question":"Which process ensures changes are consistently applied across environments?","choices":["Manual deployment","Version control","Code review","Continuous reconciliation"],"correct":3,"section":"GitOps Terminology","explanation":"Continuous reconciliation ensures changes are consistently applied by constantly comparing and aligning the actual state with the desired state."},{"question":"What is the role of pull requests in GitOps?","choices":["To deploy code to production","To monitor system health","To propose and review changes to system state","To manage container images"],"correct":2,"section":"GitOps Terminology","explanation":"Pull requests provide a mechanism to propose, review, and approve changes to the system state before they are applied."},{"question":"Which environment type typically has the strictest change control in GitOps?","choices":["Development","Testing","Staging","Production"],"correct":3,"section":"GitOps Terminology","explanation":"Production environments typically have the strictest change control procedures to ensure stability and reliability."},{"question":"What is the purpose of branch protection rules in GitOps?","choices":["To prevent unauthorized changes to critical branches","To speed up deployments","To automate testing","To manage dependencies"],"correct":0,"section":"GitOps Terminology","explanation":"Branch protection rules prevent direct modifications to important branches, ensuring all changes go through proper review processes."},{"question":"Which of the following is NOT one of the four key GitOps principles?","choices":["Declarative","Versioned and immutable","Manually approved","Continuously reconciled"],"correct":2,"section":"GitOps Principles","explanation":"The four GitOps principles are: declarative, versioned and immutable, pulled automatically, and continuously reconciled. Manual approval contradicts the automated nature of GitOps."},{"question":"What makes a system 'declarative' in GitOps?","choices":["It uses manual deployment scripts","It describes the desired end state","It requires human intervention","It uses imperative commands"],"correct":1,"section":"GitOps Principles","explanation":"Declarative systems define what the end state should look like rather than how to achieve it."},{"question":"Why is immutability important in GitOps?","choices":["It ensures auditability and reliability","It prevents any system changes","It makes deployments faster","It reduces storage costs"],"correct":0,"section":"GitOps Principles","explanation":"Immutability creates a reliable audit trail and ensures complete history of all system changes."},{"question":"Which principle ensures that system changes are automatically detected and applied?","choices":["Manual approval","Version control","Declarative configuration","Continuous reconciliation"],"correct":3,"section":"GitOps Principles","explanation":"Continuous reconciliation automatically detects and applies changes to ensure the actual state matches the desired state."},{"question":"What is the benefit of using Git as the single source of truth?","choices":["Faster deployments","Complete audit trail and version history","Reduced storage costs","Simplified testing"],"correct":1,"section":"GitOps Principles","explanation":"Git provides a complete history of all changes, creating a reliable audit trail and enabling rollbacks when needed."},{"question":"Which model does GitOps prefer for applying changes?","choices":["Push-based","Hybrid","Pull-based","Manual"],"correct":2,"section":"GitOps Principles","explanation":"GitOps prefers pull-based models where agents in the cluster pull changes from Git, enhancing security by not requiring external access to the cluster."},{"question":"What happens when drift is detected in a GitOps system?","choices":["The system shuts down","An alert is generated","The system automatically reconciles the state","Manual intervention is required"],"correct":2,"section":"GitOps Principles","explanation":"When drift is detected, GitOps systems automatically apply the necessary changes to align with the desired state in Git."},{"question":"Which principle ensures that all changes are traceable?","choices":["Versioned and immutable","Continuous deployment","Declarative configuration","Automated reconciliation"],"correct":0,"section":"GitOps Principles","explanation":"The versioned and immutable principle ensures all changes are recorded in Git, making them traceable and auditable."},{"question":"What is the primary advantage of pull-based deployment?","choices":["Faster deployments","Lower resource usage","Simplified configuration","Enhanced security"],"correct":3,"section":"GitOps Principles","explanation":"Pull-based deployment enhances security by eliminating the need for external systems to have direct access to the cluster."},{"question":"Which practice supports the 'versioned and immutable' principle?","choices":["Direct cluster modifications","Using feature branches","Manual deployments","Skipping code review"],"correct":1,"section":"GitOps Principles","explanation":"Feature branches support the versioned and immutable principle by preserving change history and enabling proper review workflows."},{"question":"Which practice involves managing infrastructure through code?","choices":["Infrastructure as Code (IaC)","Configuration as Code (CaC)","Continuous Integration (CI)","Continuous Deployment (CD)"],"correct":0,"section":"Related Practices","explanation":"Infrastructure as Code involves managing and provisioning infrastructure through machine-readable definition files."},{"question":"What is the primary focus of DevSecOps?","choices":["Fast deployments","Infrastructure management","Integrated security practices","Code quality"],"correct":2,"section":"Related Practices","explanation":"DevSecOps integrates security practices throughout the development and operations process rather than treating security as a separate concern."},{"question":"Which tool is commonly used for Infrastructure as Code?","choices":["Jenkins","Git","Terraform","Docker"],"correct":2,"section":"Related Practices","explanation":"Terraform is a widely used tool for defining and provisioning infrastructure through declarative configuration files."},{"question":"What is Configuration as Code primarily used for?","choices":["Managing application settings","Building containers","Running tests","Monitoring systems"],"correct":0,"section":"Related Practices","explanation":"Configuration as Code focuses on managing application settings and infrastructure configuration through version-controlled files."},{"question":"Which practice ensures code changes are automatically tested?","choices":["Infrastructure as Code","Continuous Integration","Configuration Management","Version Control"],"correct":1,"section":"Related Practices","explanation":"Continuous Integration automatically tests code changes when they are committed to the repository."},{"question":"What is the relationship between GitOps and DevOps?","choices":["They are completely separate practices","DevOps replaces GitOps","They serve different purposes","GitOps is a subset of DevOps practices"],"correct":3,"section":"Related Practices","explanation":"GitOps applies DevOps principles with a specific focus on using Git as the source of truth for operational tasks."},{"question":"Which practice focuses on automated security testing?","choices":["CI/CD","DevSecOps","IaC","CaC"],"correct":1,"section":"Related Practices","explanation":"DevSecOps emphasizes automated security testing and integrating security practices throughout the development lifecycle."},{"question":"What is the main benefit of Configuration as Code?","choices":["Version-controlled configuration management","Faster application development","Improved security","Better performance"],"correct":0,"section":"Related Practices","explanation":"Configuration as Code provides version-controlled management of configuration files, enabling tracking, rollback, and consistency."},{"question":"Which tool is commonly used for CI/CD pipelines?","choices":["Terraform","Ansible","Kubernetes","GitHub Actions"],"correct":3,"section":"Related Practices","explanation":"GitHub Actions is a popular tool for implementing CI/CD pipelines directly integrated with Git repositories."},{"question":"What is the primary goal of continuous delivery?","choices":["Faster code writing","Better documentation","Reliable software releases","Cost reduction"],"correct":2,"section":"Related Practices","explanation":"Continuous delivery focuses on making software releases reliable and predictable through automation."},{"question":"Which deployment strategy maintains two identical environments?","choices":["Rolling update","Blue-Green deployment","Canary release","A/B testing"],"correct":1,"section":"GitOps Patterns","explanation":"Blue-Green deployment maintains two identical environments, allowing immediate switching between versions for zero-downtime deployments."},{"question":"What is the primary purpose of canary deployments?","choices":["Instant rollback capability","Zero downtime updates","Gradual risk mitigation","Feature testing"],"correct":2,"section":"GitOps Patterns","explanation":"Canary deployments gradually release new versions to a subset of users, allowing for risk mitigation through early feedback."},{"question":"Which pattern is best for testing new features with a subset of users?","choices":["Feature flags","Blue-Green deployment","Canary release","Rolling update"],"correct":0,"section":"GitOps Patterns","explanation":"Feature flags enable testing features with specific user subsets by dynamically enabling or disabling functionality."},{"question":"What is the advantage of using feature flags?","choices":["Improved security","Better performance","Simplified deployment","Runtime feature control"],"correct":3,"section":"GitOps Patterns","explanation":"Feature flags provide runtime control over features, allowing them to be enabled or disabled without requiring redeployment."},{"question":"Which deployment pattern offers the fastest rollback capability?","choices":["Blue-Green deployment","Canary release","Rolling update","A/B testing"],"correct":0,"section":"GitOps Patterns","explanation":"Blue-Green deployment offers the fastest rollback capability by simply redirecting traffic back to the previous environment."},{"question":"What is progressive delivery?","choices":["Manual deployment process","Automated deployment with gradual rollout","Direct production updates","Feature branch deployment"],"correct":1,"section":"GitOps Patterns","explanation":"Progressive delivery combines automation with gradual rollout strategies, including controlled testing and verification."},{"question":"Which pattern is best for collecting user feedback on new features?","choices":["Blue-Green deployment","Rolling update","Canary release","A/B testing"],"correct":3,"section":"GitOps Patterns","explanation":"A/B testing is designed to compare different feature versions and collect user feedback to make data-driven decisions."},{"question":"What is the primary advantage of pull-based patterns?","choices":["Faster deployments","Improved performance","Better security control","Simplified configuration"],"correct":2,"section":"GitOps Patterns","explanation":"Pull-based patterns improve security by eliminating the need for external systems to have direct access to the cluster."},{"question":"Which pattern helps prevent configuration drift?","choices":["Continuous reconciliation","Manual updates","Direct cluster access","Push-based deployment"],"correct":0,"section":"GitOps Patterns","explanation":"Continuous reconciliation prevents configuration drift by constantly comparing the actual state with the desired state in Git."},{"question":"What is the purpose of an in-cluster reconciler?","choices":["Manual deployment","Configuration storage","User authentication","Automated state reconciliation"],"correct":3,"section":"GitOps Patterns","explanation":"In-cluster reconcilers automatically apply changes to ensure the cluster state matches the desired state defined in Git."},{"question":"Which tool is specifically designed for GitOps implementations?","choices":["Jenkins","Docker","Flux CD","Terraform"],"correct":2,"section":"GitOps Tooling","explanation":"Flux CD is designed specifically for GitOps implementations, automating the deployment of applications from Git repositories."},{"question":"What is the primary purpose of Helm in GitOps?","choices":["Package management","Version control","Monitoring","Testing"],"correct":0,"section":"GitOps Tooling","explanation":"Helm is primarily used for package management in Kubernetes, providing templating and versioned releases of applications."},{"question":"Which tool provides native Kubernetes configuration management?","choices":["Helm","Kustomize","Jenkins","ArgoCD"],"correct":1,"section":"GitOps Tooling","explanation":"Kustomize provides native Kubernetes configuration management through base configurations and customizable overlays."},{"question":"What is the main function of ArgoCD?","choices":["Container building","Code testing","GitOps controller","Log management"],"correct":2,"section":"GitOps Tooling","explanation":"ArgoCD functions as a GitOps controller that automates the synchronization between Git repositories and Kubernetes clusters."},{"question":"Which format is commonly used for Kubernetes manifests?","choices":["JSON","XML","YAML","INI"],"correct":2,"section":"GitOps Tooling","explanation":"YAML is the most commonly used format for Kubernetes manifests due to its readability and support for complex configurations."},{"question":"What is the purpose of Kustomize overlays?","choices":["Environment-specific configurations","Security scanning","Performance monitoring","Version control"],"correct":0,"section":"GitOps Tooling","explanation":"Kustomize overlays allow for environment-specific configurations to be applied on top of a common base configuration."},{"question":"Which tool is best for managing Kubernetes secrets in GitOps?","choices":["Git","Helm","Kustomize","Sealed Secrets"],"correct":3,"section":"GitOps Tooling","explanation":"Sealed Secrets enables the secure management of Kubernetes secrets in Git repositories by encrypting sensitive information."},{"question":"What is the primary function of Flux CD?","choices":["GitOps automation","Code testing","Container building","Log analysis"],"correct":0,"section":"GitOps Tooling","explanation":"Flux CD's primary function is GitOps automation, continuously ensuring that clusters reflect the state defined in Git."},{"question":"Which tool provides a web UI for GitOps workflows?","choices":["Kustomize","ArgoCD","Helm","Flux CD"],"correct":1,"section":"GitOps Tooling","explanation":"ArgoCD provides a comprehensive web UI for managing and visualizing GitOps workflows and application deployments."},{"question":"What is the purpose of a GitOps notification controller?","choices":["Deployment automation","Configuration validation","Secret management","Alert management"],"correct":3,"section":"GitOps Tooling","explanation":"GitOps notification controllers manage alerts related to reconciliation status, sync failures, and other GitOps-related events."},{"question":"Which of the following is NOT a core principle of GitOps?","choices":["Declarative configuration","Versioned and immutable desired state","Manual synchronization between environments","Automated reconciliation"],"correct":2,"section":"GitOps Principles","explanation":"GitOps relies on automation for synchronization (reconciliation) between the desired state (in Git) and the actual state, not manual processes."},{"question":"Which tool is specifically designed for progressive delivery in GitOps?","choices":["Flux","Argo Rollouts","Jenkins","Terraform"],"correct":1,"section":"GitOps Tooling","explanation":"Argo Rollouts is a Kubernetes controller and set of CRDs that provide advanced deployment capabilities such as blue-green, canary, and canary analysis for progressive delivery."},{"question":"What is a key benefit of using Terraform in a GitOps workflow?","choices":["It replaces the need for Git.","It allows infrastructure to be defined as code and versioned in Git.","It automates application code testing.","It eliminates the need for CI/CD pipelines."],"correct":1,"section":"Infrastructure as Code","explanation":"Terraform enables infrastructure to be defined as code, which can be versioned and managed in Git, aligning with GitOps principles."},{"question":"How does GitOps differ from traditional CI/CD?","choices":["GitOps eliminates the need for CI pipelines.","GitOps uses Git as the single source of truth for both infrastructure and application deployments.","GitOps requires manual approval for every deployment.","GitOps only works with monolithic applications."],"correct":1,"section":"CI/CD and GitOps","explanation":"GitOps extends CI/CD by using Git as the single source of truth for declarative infrastructure and application deployments, enabling automated, auditable, and reproducible processes."},{"question":"What is a best practice for managing secrets in a GitOps workflow?","choices":["Store secrets directly in Git repositories.","Use external secret management tools like HashiCorp Vault or sealed secrets.","Share secrets via email or chat tools.","Hardcode secrets in deployment scripts."],"correct":1,"section":"Security in GitOps","explanation":"Secrets should never be stored in Git. Instead, use external tools like Vault or sealed secrets to manage and inject secrets securely."},{"question":"Why is observability important in GitOps?","choices":["To manually approve deployments.","To detect and alert on drift between desired and actual states.","To replace Git as the source of truth.","To slow down the deployment process."],"correct":1,"section":"Observability and Monitoring","explanation":"Observability helps detect drift, monitor the health of deployments, and alert teams to discrepancies or issues in real time."},{"question":"Which deployment strategy allows traffic to be gradually shifted from an old version to a new version of an application?","choices":["Blue-Green","Canary","Rolling Update","Recreate"],"correct":1,"section":"Deployment Strategies","explanation":"Canary deployments incrementally shift traffic to the new version, reducing risk and allowing for monitoring before full rollout."},{"question":"What is the role of a Kubernetes Custom Resource Definition (CRD) in GitOps?","choices":["To replace Git as the source of truth.","To extend Kubernetes API and define custom resources for GitOps tools like Argo CD or Flux.","To manually scale applications.","To store application source code."],"correct":1,"section":"GitOps and Kubernetes","explanation":"CRDs allow GitOps tools to define and manage custom resources, such as applications and their desired states, within Kubernetes."},{"question":"How does GitOps improve collaboration between development and operations teams?","choices":["By eliminating the need for operations teams.","By providing a transparent, auditable, and automated workflow centered around Git.","By requiring all changes to be approved by a single person.","By removing version control from the process."],"correct":1,"section":"Collaboration and Workflow","explanation":"GitOps fosters collaboration by using Git as a shared, auditable source of truth, with automated processes for consistency and reliability."},{"question":"How does GitOps help with compliance and audit requirements?","choices":["By hiding changes from auditors.","By providing a full audit trail of all changes in Git.","By allowing manual overrides without documentation.","By eliminating the need for documentation."],"correct":1,"section":"Compliance and Audit","explanation":"GitOps ensures all changes are tracked in Git, providing a complete audit trail for compliance and review."},{"question":"What is the first step in adopting GitOps for a new project?","choices":["Manually deploy the application to production.","Define the desired state of the infrastructure and application in Git.","Ignore version control until the project is complete.","Use only imperative commands for deployments."],"correct":1,"section":"Getting Started with GitOps","explanation":"The first step is to define the desired state declaratively and store it in Git, which serves as the foundation for GitOps."},{"question":"If a GitOps agent (e.g., Argo CD) reports a 'OutOfSync' status, what should you do?","choices":["Ignore the status and wait for it to resolve itself.","Manually apply changes to the cluster to match the desired state.","Check the Git repository for recent changes and verify the agent's ability to reconcile the state.","Delete the Git repository and start over."],"correct":2,"section":"Troubleshooting GitOps","explanation":"An 'OutOfSync' status indicates a drift between the desired state (Git) and the actual state. Investigate recent changes and ensure the agent can reconcile the state."},{"question":"Which of the following is a core principle of GitOps?","choices":["The desired state of the system is stored in a version control system like Git.","Changes are pushed directly to production without versioning.","Manual approval is required for every deployment, regardless of the process.","The actual state of the system is never reconciled with the desired state."],"correct":0,"section":"GitOps Principles","explanation":"GitOps requires that the desired state of the system be declarative, versioned, and stored in a version control system (most commonly Git). This allows for auditability, reproducibility, and automated reconciliation between the desired and actual states."},{"question":"What is the primary purpose of using a GitOps approach in software delivery?","choices":["To eliminate the need for version control systems.","To enable faster, more reliable, and auditable deployments using Git as the single source of truth.","To replace CI/CD pipelines with manual deployment scripts.","To reduce the number of developers involved in the deployment process."],"correct":1,"section":"GitOps Overview","explanation":"GitOps leverages Git as the single source of truth for declarative infrastructure and deployments, enabling faster, more reliable, and auditable software delivery."},{"question":"Which tool is commonly used as a GitOps operator for Kubernetes?","choices":["Jenkins","Argo CD","Docker Compose","Ansible"],"correct":1,"section":"GitOps Tooling","explanation":"Argo CD is a popular GitOps operator specifically designed for Kubernetes, enabling automated, Git-driven continuous delivery."},{"question":"In GitOps, what does 'continuous reconciliation' mean?","choices":["The system periodically checks and corrects any drift between the actual and desired state.","Developers must manually approve every change before it is applied.","The desired state is only checked once per deployment cycle.","The system ignores any changes made outside of Git."],"correct":0,"section":"GitOps Principles","explanation":"Continuous reconciliation means the system constantly monitors and automatically corrects any differences (drift) between the actual state of the system and the desired state defined in Git."},{"question":"Which of the following best describes 'Infrastructure as Code' (IaC) in the context of GitOps?","choices":["Managing infrastructure using physical hardware configuration files.","Defining and managing infrastructure using machine-readable definition files stored in version control.","Using only manual processes to configure infrastructure.","Storing infrastructure secrets in plaintext within Git repositories."],"correct":1,"section":"Infrastructure as Code","explanation":"Infrastructure as Code (IaC) involves managing infrastructure through machine-readable definition files, which are typically stored in version control systems like Git."},{"question":"What is the role of a 'GitOps agent' in a GitOps workflow?","choices":["To manually approve pull requests in Git.","To continuously monitor the Git repository and apply changes to the target environment.","To replace the need for a Git repository.","To generate random infrastructure configurations."],"correct":1,"section":"GitOps Workflow","explanation":"A GitOps agent (such as Argo CD or Flux) continuously monitors the Git repository for changes and automatically applies those changes to the target environment, ensuring the actual state matches the desired state."}];

let currentQ = 0, userAnswers = [], mode = 'practice', timerInterval = null, timeLeft = 0, startTime = null;

function startQuiz(m) {
  mode = m;
  currentQ = 0;
  userAnswers = new Array(questions.length).fill(null);
  startTime = new Date();
  document.getElementById('startScreen').style.display = 'none';
  document.getElementById('questionScreen').style.display = 'block';
  if (mode === 'timed') {
    timeLeft = 102 * 60;
    document.getElementById('timerDisplay').style.display = 'inline-block';
    startTimer();
  }
  showQuestion();
}

function startTimer() {
  updateTimer();
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft <= 0) { clearInterval(timerInterval); alert('⏰ Time is up!'); submitQuiz(); }
  }, 1000);
}

function updateTimer() {
  const m = Math.floor(timeLeft / 60), s = timeLeft % 60;
  const display = document.getElementById('timerDisplay');
  display.textContent = `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
  display.className = 'timer-display' + (timeLeft <= 60 ? ' timer-critical' : timeLeft <= 300 ? ' timer-warning' : '');
}

function showQuestion() {
  const q = questions[currentQ];
  const answered = userAnswers.filter(a => a !== null).length;
  const pct = ((currentQ + 1) / questions.length * 100).toFixed(0);
  
  let html = `<div class="question-card">
    <div class="progress-section">
      <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
      <div class="progress-text">
        <span>Question ${currentQ + 1} of ${questions.length}</span>
        <span>Answered: ${answered}/${questions.length}</span>
      </div>
    </div>
    <div class="question-section">${q.section}</div>
    <div class="question-text">${q.question}</div>
    <div class="choices">`;
  
  const letters = ['A', 'B', 'C', 'D'];
  q.choices.forEach((c, i) => {
    let cls = 'choice';
    if (userAnswers[currentQ] === i) cls += ' selected';
    if (mode === 'practice' && userAnswers[currentQ] !== null) {
      if (i === q.correct) cls += ' correct';
      else if (userAnswers[currentQ] === i) cls += ' incorrect';
    }
    html += `<div class="${cls}" onclick="selectAnswer(${i})">
      <div class="choice-letter">${letters[i]}</div>
      <div>${c}</div>
    </div>`;
  });
  
  html += `</div>`;
  
  if (mode === 'practice' && userAnswers[currentQ] !== null) {
    const isCorrect = userAnswers[currentQ] === q.correct;
    html += `<div class="explanation show ${isCorrect ? 'correct' : 'incorrect'}">
      <div class="explanation-title">${isCorrect ? '✅ Correct!' : '❌ Incorrect'}</div>
      <div><strong>Answer:</strong> ${letters[q.correct]}. ${q.choices[q.correct]}</div>
      <div style="margin-top:10px;">${q.explanation}</div>
    </div>`;
  }
  
  html += `<div class="nav-buttons">
    <button class="nav-btn secondary" onclick="prevQuestion()" ${currentQ === 0 ? 'disabled' : ''}>← Previous</button>
    <button class="nav-btn secondary" onclick="showQuestionNav()">📋 Question List</button>
    ${currentQ < questions.length - 1 
      ? `<button class="nav-btn primary" onclick="nextQuestion()">Next →</button>`
      : `<button class="nav-btn submit" onclick="submitQuiz()">Submit Exam ✓</button>`}
  </div></div>`;
  
  document.getElementById('questionScreen').innerHTML = html;
}

function selectAnswer(i) {
  if (mode === 'practice' && userAnswers[currentQ] !== null) return;
  userAnswers[currentQ] = i;
  showQuestion();
}

function prevQuestion() { if (currentQ > 0) { currentQ--; showQuestion(); } }
function nextQuestion() { if (currentQ < questions.length - 1) { currentQ++; showQuestion(); } }

function showQuestionNav() {
  let html = `<div class="question-card">
    <h3 style="margin-bottom:20px;">📋 Question Navigator</h3>
    <div class="question-grid">`;
  questions.forEach((_, i) => {
    let cls = 'q-btn';
    if (userAnswers[i] !== null) cls += ' answered';
    if (i === currentQ) cls += ' current';
    html += `<button class="${cls}" onclick="goToQuestion(${i})">${i + 1}</button>`;
  });
  html += `</div>
    <div class="nav-buttons" style="margin-top:25px;">
      <button class="nav-btn secondary" onclick="showQuestion()">← Back to Question</button>
      <button class="nav-btn submit" onclick="submitQuiz()">Submit Exam ✓</button>
    </div></div>`;
  document.getElementById('questionScreen').innerHTML = html;
}

function goToQuestion(i) { currentQ = i; showQuestion(); }

function submitQuiz() {
  const unanswered = userAnswers.filter(a => a === null).length;
  if (unanswered > 0 && !confirm(`You have ${unanswered} unanswered questions. Submit anyway?`)) return;
  if (timerInterval) clearInterval(timerInterval);
  document.getElementById('timerDisplay').style.display = 'none';
  showResults();
}

function showResults() {
  document.getElementById('questionScreen').style.display = 'none';
  document.getElementById('resultsScreen').style.display = 'block';
  
  let correct = 0;
  userAnswers.forEach((a, i) => { if (a === questions[i].correct) correct++; });
  const pct = Math.round(correct / questions.length * 100);
  const passed = pct >= 70;
  const timeTaken = Math.round((new Date() - startTime) / 60000);
  
  const sections = {};
  questions.forEach((q, i) => {
    if (!sections[q.section]) sections[q.section] = { correct: 0, total: 0 };
    sections[q.section].total++;
    if (userAnswers[i] === q.correct) sections[q.section].correct++;
  });
  
  let html = `<div class="results-container">
    <h2>${passed ? '🎉 Congratulations!' : '📚 Keep Practicing!'}</h2>
    <div class="score-circle ${passed ? 'pass' : 'fail'}">
      <div class="score-percent">${pct}%</div>
      <div class="score-fraction">${correct}/${questions.length}</div>
    </div>
    <div class="results-details">
      <p><strong>${passed ? '✅ PASSED' : '❌ Not Passed'}</strong> (70% required)</p>
      <p>⏱️ Time: ${timeTaken} minutes</p>
      <p>✓ Correct: ${correct} | ✗ Incorrect: ${questions.length - correct - userAnswers.filter(a=>a===null).length} | ⚠️ Unanswered: ${userAnswers.filter(a=>a===null).length}</p>
    </div>
    <h3>Performance by Topic</h3>
    <div class="section-results">`;
  
  Object.entries(sections).forEach(([name, data]) => {
    const secPct = Math.round(data.correct / data.total * 100);
    html += `<div class="section-row">
      <div class="section-name">${name}</div>
      <div class="section-bar"><div class="section-bar-fill" style="width:${secPct}%"></div></div>
      <div class="section-score">${data.correct}/${data.total}</div>
    </div>`;
  });
  
  html += `</div>
    <div class="mode-buttons">
      <button class="mode-btn mode-practice" onclick="showReview()">📝 Review Answers</button>
      <button class="mode-btn mode-exam" onclick="retakeQuiz()">🔄 Retake Quiz</button>
    </div></div>`;
  
  document.getElementById('resultsScreen').innerHTML = html;
}

function showReview() {
  document.getElementById('resultsScreen').style.display = 'none';
  document.getElementById('reviewScreen').style.display = 'block';
  renderReview('all');
}

function renderReview(filter) {
  const letters = ['A', 'B', 'C', 'D'];
  let html = `<h2 style="text-align:center;">📝 Answer Review</h2>
    <div class="filter-buttons">
      <button class="filter-btn ${filter==='all'?'active':''}" onclick="renderReview('all')">All</button>
      <button class="filter-btn ${filter==='correct'?'active':''}" onclick="renderReview('correct')">✓ Correct</button>
      <button class="filter-btn ${filter==='incorrect'?'active':''}" onclick="renderReview('incorrect')">✗ Incorrect</button>
      <button class="filter-btn ${filter==='unanswered'?'active':''}" onclick="renderReview('unanswered')">⚠️ Unanswered</button>
    </div>`;
  
  questions.forEach((q, i) => {
    const ua = userAnswers[i];
    const isCorrect = ua === q.correct;
    const status = ua === null ? 'unanswered' : (isCorrect ? 'correct' : 'incorrect');
    if (filter !== 'all' && filter !== status) return;
    
    html += `<div class="review-item ${status}">
      <div style="display:flex;justify-content:space-between;margin-bottom:10px;">
        <strong>Q${i+1}</strong>
        <span class="question-section">${q.section}</span>
        <span>${status === 'correct' ? '✅' : status === 'incorrect' ? '❌' : '⚠️'}</span>
      </div>
      <div style="margin-bottom:15px;">${q.question}</div>`;
    
    q.choices.forEach((c, j) => {
      let style = 'padding:8px 12px;margin:5px 0;border-radius:6px;';
      if (j === q.correct) style += 'background:#e8f5e9;border-left:3px solid #4CAF50;';
      else if (j === ua && !isCorrect) style += 'background:#ffebee;border-left:3px solid #f44336;';
      html += `<div style="${style}"><strong>${letters[j]}.</strong> ${c} ${j===q.correct?'✓':''} ${j===ua&&!isCorrect?'(Your answer)':''}</div>`;
    });
    
    html += `<div style="margin-top:15px;padding:12px;background:#f5f5f5;border-radius:8px;"><strong>Explanation:</strong> ${q.explanation}</div></div>`;
  });
  
  html += `<div style="text-align:center;margin-top:30px;">
    <button class="nav-btn primary" onclick="backToResults()">← Back to Results</button>
  </div>`;
  
  document.getElementById('reviewScreen').innerHTML = html;
}

function backToResults() {
  document.getElementById('reviewScreen').style.display = 'none';
  document.getElementById('resultsScreen').style.display = 'block';
}

function retakeQuiz() {
  document.getElementById('resultsScreen').style.display = 'none';
  document.getElementById('reviewScreen').style.display = 'none';
  document.getElementById('startScreen').style.display = 'block';
}

document.getElementById('totalQ').textContent = questions.length;
document.getElementById('topicCount').textContent = [...new Set(questions.map(q => q.section))].length;
</script>

---

## Study Resources

- [GitOps Principles](./01-gitops-principles.md)
- [Sample Questions](./sample-questions.md)
- [OpenGitOps Documentation](https://opengitops.dev/)
- [Flux Documentation](https://fluxcd.io/docs/)
- [Argo CD Documentation](https://argo-cd.readthedocs.io/)

[← Back to CGOA Overview](./README.md)
