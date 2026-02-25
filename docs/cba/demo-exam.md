# CBA Interactive Demo Exam

Welcome to the **Certified Backstage Associate (CBA)** interactive demo exam! Test your knowledge with **54 questions** covering Backstage development, catalog, infrastructure, and customization.

<style>
.quiz-container { max-width: 900px; margin: 0 auto; padding: 20px; }
.quiz-header { background: linear-gradient(135deg, #f9a825 0%, #ffc107 100%); color: #333; padding: 30px; border-radius: 15px; text-align: center; margin-bottom: 30px; }
.quiz-stats { display: flex; justify-content: space-around; margin-top: 20px; flex-wrap: wrap; gap: 15px; }
.stat-box { background: rgba(255,255,255,0.4); padding: 15px 25px; border-radius: 10px; text-align: center; }
.stat-number { font-size: 2em; font-weight: bold; }
.stat-label { font-size: 0.9em; opacity: 0.9; }
.timer-display { font-size: 2.5em; font-weight: bold; padding: 15px 30px; background: rgba(255,255,255,0.4); border-radius: 10px; display: inline-block; margin-top: 15px; }
.timer-warning { background: #ff9800 !important; animation: pulse 1s infinite; }
.timer-critical { background: #f44336 !important; color: white !important; animation: pulse 0.5s infinite; }
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
.progress-fill { height: 100%; background: linear-gradient(90deg, #f9a825, #ffc107); transition: width 0.3s; border-radius: 6px; }
.progress-text { display: flex; justify-content: space-between; margin-top: 10px; font-size: 0.95em; color: #666; }
.question-section { display: inline-block; background: #fff8e1; color: #f57f17; padding: 5px 15px; border-radius: 20px; font-size: 0.85em; margin-bottom: 15px; }
.question-text { font-size: 1.3em; line-height: 1.6; margin-bottom: 25px; color: #333; }
.choices { display: flex; flex-direction: column; gap: 12px; }
.choice { padding: 18px 20px; border: 2px solid #e0e0e0; border-radius: 12px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 15px; }
.choice:hover { border-color: #f9a825; background: #fffde7; }
.choice.selected { border-color: #f9a825; background: #fff8e1; }
.choice.correct { border-color: #4CAF50; background: #e8f5e9; }
.choice.incorrect { border-color: #f44336; background: #ffebee; }
.choice-letter { width: 35px; height: 35px; border-radius: 50%; background: #f0f0f0; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0; }
.choice.selected .choice-letter { background: #f9a825; color: white; }
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
.nav-btn.primary { background: linear-gradient(135deg, #f9a825, #ffc107); color: #333; }
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
.section-bar-fill { height: 100%; background: linear-gradient(90deg, #f9a825, #ffc107); transition: width 0.5s; }
.section-score { min-width: 80px; text-align: right; font-weight: bold; }
.question-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(45px, 1fr)); gap: 8px; margin: 20px 0; }
.q-btn { width: 45px; height: 45px; border: 2px solid #e0e0e0; border-radius: 8px; cursor: pointer; font-weight: bold; transition: all 0.2s; background: white; }
.q-btn:hover { border-color: #f9a825; }
.q-btn.answered { background: #4CAF50; color: white; border-color: #4CAF50; }
.q-btn.current { border-color: #f9a825; box-shadow: 0 0 0 3px rgba(249,168,37,0.3); }
.review-item { background: white; border-radius: 12px; padding: 20px; margin-bottom: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); border-left: 4px solid #e0e0e0; }
.review-item.correct { border-left-color: #4CAF50; }
.review-item.incorrect { border-left-color: #f44336; }
.review-item.unanswered { border-left-color: #ff9800; }
.filter-buttons { display: flex; gap: 10px; justify-content: center; margin-bottom: 25px; flex-wrap: wrap; }
.filter-btn { padding: 10px 20px; border: 2px solid #e0e0e0; border-radius: 25px; cursor: pointer; background: white; transition: all 0.2s; }
.filter-btn:hover { border-color: #f9a825; }
.filter-btn.active { background: #f9a825; color: #333; border-color: #f9a825; }
@media (max-width: 600px) { .quiz-stats { flex-direction: column; } .mode-buttons { flex-direction: column; } .nav-buttons { flex-direction: column; } .nav-btn { width: 100%; } }
</style>

<div class="quiz-container" id="quizApp">
  <div class="quiz-header">
    <h2 style="margin:0;">🎭 CBA Practice Exam</h2>
    <div class="quiz-stats">
      <div class="stat-box"><div class="stat-number" id="totalQ">54</div><div class="stat-label">Questions</div></div>
      <div class="stat-box"><div class="stat-number" id="topicCount">5</div><div class="stat-label">Topics</div></div>
      <div class="stat-box"><div class="stat-number">~90</div><div class="stat-label">Minutes</div></div>
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
        <small>90 min countdown</small>
      </button>
    </div>
  </div>
  
  <div id="questionScreen" style="display:none;"></div>
  <div id="resultsScreen" style="display:none;"></div>
  <div id="reviewScreen" style="display:none;"></div>
</div>

<script>
const questions = [{"question":"Which command correctly creates a new Backstage application?","choices":["npm create backstage-app","npx @backstage/create-app","yarn create backstage-app","backstage init new-app"],"correct":1,"section":"Backstage Development Workflow","explanation":"The official command to create a new Backstage app is `npx @backstage/create-app`, which sets up the initial project structure with all necessary dependencies."},{"question":"In a Backstage project, which directory contains the frontend code?","choices":["packages/frontend","frontend","src/app","packages/app"],"correct":3,"section":"Backstage Development Workflow","explanation":"In a Backstage project, the frontend application code is located in the `packages/app` directory, following the monorepo structure."},{"question":"Which command starts only the backend service during local development?","choices":["yarn backend","yarn run:backend","yarn start-backend","yarn server"],"correct":2,"section":"Backstage Development Workflow","explanation":"The command to start only the backend service during local development is `yarn start-backend`, leaving the frontend inactive."},{"question":"What file extension is used for Backstage configuration files?","choices":[".yaml",".json",".js",".config"],"correct":0,"section":"Backstage Development Workflow","explanation":"Backstage uses YAML (.yaml) files for configuration, with the primary configuration file being `app-config.yaml`."},{"question":"Which of the following statements about the Backstage project structure is true?","choices":["The project uses a monolithic structure with all code in a single package","Each plugin requires its own Git repository","Backstage uses a microservices architecture with separate repositories for each service","The project follows a monorepo structure with packages in the 'packages' directory"],"correct":3,"section":"Backstage Development Workflow","explanation":"Backstage uses a monorepo structure, with different packages such as 'app' and 'backend' organized under the 'packages' directory."},{"question":"Which command adds a new dependency to a specific package in a Backstage project?","choices":["yarn add react-router --package app","yarn workspace @internal/my-plugin add react-router","npm install react-router --save-to=my-plugin","yarn package-add my-plugin react-router"],"correct":1,"section":"Backstage Development Workflow","explanation":"To add a dependency to a specific package in a Backstage project, you use Yarn workspaces with the package name as shown."},{"question":"What is the recommended approach for running a Backstage application in Docker?","choices":["Single-stage build with a Node.js base image","Multi-stage build separating build and runtime environments","Using an official Backstage Docker image","Building directly on an Alpine Linux base image"],"correct":1,"section":"Backstage Development Workflow","explanation":"The recommended approach for Docker builds is using multi-stage builds to separate the build environment from the runtime environment, resulting in smaller and more secure containers."},{"question":"When applying TypeScript configuration in a Backstage plugin, what is the typical base configuration extended?","choices":["@typescript/recommended","@backstage/cli/config/tsconfig.json","@backstage/core/tsconfig.json","../../tsconfig.json"],"correct":1,"section":"Backstage Development Workflow","explanation":"The typical TypeScript configuration for Backstage plugins extends from `@backstage/cli/config/tsconfig.json`, which provides standardized settings."},{"question":"What command compiles a Backstage project without starting the development server?","choices":["yarn tsc","yarn compile","yarn build","yarn make"],"correct":2,"section":"Backstage Development Workflow","explanation":"The `yarn build` command compiles the Backstage project without starting the development server, creating a production-ready build."},{"question":"Which approach is used to override configuration values for different environments in Backstage?","choices":["Creating `app-config.${NODE_ENV}.yaml` files","Modifying the `config/environments` directory","Using a `.env` file with environment-specific variables","Directly editing the main configuration for each deployment"],"correct":0,"section":"Backstage Development Workflow","explanation":"Backstage uses environment-specific configuration files named `app-config.${NODE_ENV}.yaml` to override values for different environments, such as development, production, or testing."},{"question":"What is the primary purpose of the Backstage Catalog?","choices":["Managing infrastructure deployments","Storing documentation","Providing a centralized inventory of software and resources","Monitoring system health"],"correct":2,"section":"Backstage Catalog","explanation":"The primary purpose of the Backstage Catalog is to provide a centralized inventory of software, infrastructure, documentation, and other resources."},{"question":"Which field is required in all Backstage catalog entity definitions?","choices":["spec.owner","metadata.description","metadata.name","spec.type"],"correct":2,"section":"Backstage Catalog","explanation":"The `metadata.name` field is required in all Backstage catalog entity definitions as it provides the unique identifier for the entity."},{"question":"What file format is used for entity definitions in the Backstage Catalog?","choices":["JSON","XML","YAML","TOML"],"correct":2,"section":"Backstage Catalog","explanation":"Entity definitions in the Backstage Catalog use YAML format for structured data representation."},{"question":"Which annotation would you use to connect a catalog component to its GitHub repository?","choices":["github.com/project-path","github.com/repo-url","github.com/project-slug","backstage.io/github-url"],"correct":2,"section":"Backstage Catalog","explanation":"The `github.com/project-slug` annotation is used to connect a catalog component to its GitHub repository, typically in the format `organization/repo-name`."},{"question":"How can you add a TechDocs connection to an entity in the catalog?","choices":["By setting `spec.docs.enabled: true`","By adding an annotation `backstage.io/techdocs-ref: dir:.`","By creating a separate `docs.yaml` file","By adding a `documentation` field to `spec`"],"correct":1,"section":"Backstage Catalog","explanation":"The `backstage.io/techdocs-ref: dir:.` annotation is used to indicate that TechDocs documentation exists in the same directory as the entity."},{"question":"What is a common reason for entity ingestion failures in the Backstage Catalog?","choices":["Database connectivity issues","YAML syntax errors in entity definitions","Network latency","Missing plugin dependencies"],"correct":1,"section":"Backstage Catalog","explanation":"A common reason for entity ingestion failures is YAML syntax errors in entity definition files, including incorrect indentation or invalid fields."},{"question":"Which API endpoint can be used to validate an entity definition without registering it?","choices":["POST /api/catalog/validate","GET /api/catalog/check","POST /api/entities/validate","GET /api/backstage/validate-entity"],"correct":0,"section":"Backstage Catalog","explanation":"The endpoint for validating an entity definition without registering it is `POST /api/catalog/validate`."},{"question":"What relationship field would you use to indicate that a Component entity depends on an API entity?","choices":["spec.dependencies","spec.consumesApis","spec.api-dependencies","spec.requires"],"correct":1,"section":"Backstage Catalog","explanation":"The `spec.consumesApis` field is used to indicate that a Component entity depends on API entities, establishing a formal relationship."},{"question":"Which of the following would you configure to refresh catalog locations on a schedule?","choices":["catalog:\\n  refresh:\\n    interval: 60","catalog:\\n  cron: \\\"*/30 * * * *\\\"","catalog:\\n  locations:\\n    - schedule:\\n        frequency: { minutes: 30 }","catalog:\\n  processingInterval: 30"],"correct":2,"section":"Backstage Catalog","explanation":"This configuration sets up scheduled refreshes for catalog locations, with a frequency of every 30 minutes."},{"question":"Which of the following best describes Backstage's architecture?","choices":["A monolithic application with embedded plugins","A client-server architecture with plugin-based frontend and backend","A serverless architecture running on cloud functions","A microservices-based application with each plugin as an independent service"],"correct":1,"section":"Backstage Infrastructure","explanation":"Backstage follows a client-server architecture with a React-based frontend and Node.js backend, both of which use a plugin system for extensibility."},{"question":"What statement best describes the Backstage client-server architecture?","choices":["The frontend and backend are completely isolated and communicate solely through REST APIs","A React-based frontend communicates with a Node.js backend through HTTP, both sharing a plugin system that maps frontend plugins to backend plugins","The frontend is a thin client that only renders data, while the backend contains all business logic","Each plugin has its own dedicated frontend and backend microservice that operate independently"],"correct":1,"section":"Backstage Infrastructure","explanation":"Backstage uses a React frontend and Node.js backend that communicate over HTTP. The plugin system is shared between frontend and backend, with frontend plugins often having corresponding backend plugins that provide necessary APIs and services."},{"question":"What is the recommended database for a production Backstage deployment?","choices":["SQLite","MongoDB","PostgreSQL","MySQL"],"correct":2,"section":"Backstage Infrastructure","explanation":"PostgreSQL is the recommended database for production Backstage deployments due to its reliability, feature set, and compatibility."},{"question":"Which of the following is NOT a core backend plugin in Backstage?","choices":["catalog","scaffolder","kubernetes","techdocs"],"correct":2,"section":"Backstage Infrastructure","explanation":"While the kubernetes plugin is commonly used, it is not one of the core backend plugins like catalog, scaffolder, or techdocs."},{"question":"What is the minimum recommended setup for running Backstage in a production Kubernetes environment?","choices":["A single pod with the Backstage application","Separate deployments for frontend and backend with a shared database","Independent microservices for each plugin","A StatefulSet for the backend and a Deployment for the frontend"],"correct":1,"section":"Backstage Infrastructure","explanation":"The recommended production setup includes separate deployments for frontend and backend components, sharing a common database."},{"question":"Which environment variable substitution format is used in Backstage configuration files?","choices":["{{ENV_VAR}}","$ENV_VAR","${ENV_VAR}","%ENV_VAR%"],"correct":2,"section":"Backstage Infrastructure","explanation":"Backstage uses the `${ENV_VAR}` format for environment variable substitution in its configuration files."},{"question":"What configuration is necessary to enable CORS in the Backstage backend?","choices":["backend:\\n  cors:\\n    enabled: true","backend:\\n  cors:\\n    origin: https://example.com\\n    methods: [GET, POST, PUT, DELETE]","server:\\n  cors:\\n    allowedOrigins: ['https://example.com']","http:\\n  cors:\\n    - origin: https://example.com\\n      methods: '*'"],"correct":1,"section":"Backstage Infrastructure","explanation":"This configuration correctly enables CORS in the Backstage backend, specifying allowed origins and methods."},{"question":"In a Kubernetes deployment, how would you typically manage Backstage configuration?","choices":["As environment variables in the Deployment manifest","Using a ConfigMap mounted as a volume","Using a Secret for the entire configuration","Embedding it directly in the container image"],"correct":1,"section":"Backstage Infrastructure","explanation":"In a Kubernetes deployment, Backstage configuration is typically managed using a ConfigMap mounted as a volume to the pods."},{"question":"What is the purpose of the 'discovery' service in Backstage's backend architecture?","choices":["To discover new plugins","To find and catalog services in your infrastructure","To locate internal service URLs in the Backstage backend","To enable service mesh features"],"correct":2,"section":"Backstage Infrastructure","explanation":"The 'discovery' service helps backend plugins locate and communicate with other services within the Backstage backend."},{"question":"How do you create a new frontend plugin in Backstage?","choices":["yarn add --plugin frontend my-plugin","backstage create-plugin my-plugin","yarn new --select plugin","yarn add @backstage/plugin-generator"],"correct":2,"section":"Customizing Backstage","explanation":"To create a new frontend plugin, you use the `yarn new --select plugin` command, which runs the plugin creation wizard."},{"question":"Which command creates a new backend plugin?","choices":["yarn new --select backend-plugin","yarn create-backend-plugin","backstage add backend-plugin","yarn plugin --backend"],"correct":0,"section":"Customizing Backstage","explanation":"The command to create a new backend plugin is `yarn new --select backend-plugin`."},{"question":"What is the difference between frontend and backend plugins in Backstage?","choices":["Frontend plugins are written in JavaScript, backend plugins in TypeScript","Frontend plugins handle UI components while backend plugins provide API endpoints","Frontend plugins run in the browser while backend plugins run in separate containers","Frontend plugins are configured in app-config.yaml, backend plugins in plugins.yaml"],"correct":1,"section":"Customizing Backstage","explanation":"The main difference is that frontend plugins handle UI components and user interaction, while backend plugins provide API endpoints and integrate with external services."},{"question":"How do you share functionality between different components, both frontend and backend?","choices":["By using global variables shared between frontend and backend","By using common libraries in a shared package that can be imported by both frontend and backend components","By configuring shared functions in app-config.yaml","By replicating code between frontend and backend components"],"correct":1,"section":"Customizing Backstage","explanation":"Shared functionality in Backstage is typically implemented in common libraries that are packaged separately and imported where needed, allowing code reuse between frontend and backend components."},{"question":"Which Docker command is used to build a Backstage image?","choices":["docker-compose up","docker build .","docker run -p 7007:7007","docker pull backstage"],"correct":1,"section":"Backstage Development Workflow","explanation":"'docker build .' builds a Docker image from the Dockerfile in the current directory. For Backstage, you can also use 'yarn build-image --tag backstage:1.0.0'."},{"question":"How can you customize the default Backstage layout?","choices":["By modifying the app-config.yaml file","By overriding React components in App.tsx","By creating new backend plugins","By editing routes.ts in the backend"],"correct":1,"section":"Customizing Backstage","explanation":"Customize the layout by overriding React components in App.tsx. This defines frontend structure and routes, while app-config.yaml handles configuration."},{"question":"When creating a new Backstage plugin, which command initializes the plugin structure?","choices":["backstage-cli new","npm plugin-init","yarn plugin-init","npm create-plugin"],"correct":0,"section":"Customizing Backstage","explanation":"'backstage-cli new' initializes a new Backstage plugin structure, scaffolding the necessary files and directories following plugin architecture conventions."},{"question":"What type of file is typically used to specify dependencies for Backstage backend plugins?","choices":["package.json","app-config.yaml","Dockerfile","backend-config.yaml"],"correct":0,"section":"Customizing Backstage","explanation":"package.json specifies dependencies for Backstage backend plugins, containing npm/yarn dependencies. app-config.yaml is for runtime configuration, not dependencies."},{"question":"What are the purposes of running a Backstage project locally?","choices":["To debug deployment issues","To test custom plugins","To update global dependencies","To troubleshoot global configurations"],"correct":1,"section":"Backstage Development Workflow","explanation":"Running locally allows testing custom plugins during development, validating functionality and debugging before deployment."},{"question":"What is a key difference between frontend and backend plugins in Backstage?","choices":["Frontend plugins manage API integrations, while backend plugins manage UI components.","Frontend plugins handle user interfaces, while backend plugins manage server-side logic.","Backend plugins are required for CI/CD integration, while frontend plugins handle entity ingestion.","Backend plugins render UI components dynamically, while frontend plugins are static."],"correct":1,"section":"Backstage Development Workflow","explanation":"Frontend plugins handle UI components and user interaction, while backend plugins manage server-side logic like APIs and integrations."},{"question":"What is the primary configuration file used to customize Backstage behavior?","choices":["backstage.json","app-config.yaml","package.json","config.ts"],"correct":1,"section":"Backstage Infrastructure","explanation":"app-config.yaml is the primary configuration file containing settings for the app, backend, integrations, plugins, and core functionality."},{"question":"Which command is used to validate your Backstage configuration schema?","choices":["backstage-cli config:validate","backstage-cli config:check","yarn config:test","npm run validate-config"],"correct":1,"section":"Backstage Development Workflow","explanation":"'backstage-cli config:check' validates configuration schema, ensuring app-config.yaml conforms to expected format and identifying errors."},{"question":"What is the default database client used by Backstage for plugin storage?","choices":["MySQL","PostgreSQL","better-sqlite3","MongoDB"],"correct":2,"section":"Backstage Infrastructure","explanation":"Backstage uses better-sqlite3 as the default database client for development. PostgreSQL is recommended for production deployments."},{"question":"Which file specifies the configuration schema for a Backstage plugin?","choices":["schema.json","config.d.ts","plugin.yaml","manifest.json"],"correct":1,"section":"Customizing Backstage","explanation":"config.d.ts specifies the configuration schema for a plugin, defining expected structure and types referenced in package.json."},{"question":"What is TechDocs in Backstage primarily used for?","choices":["Managing software dependencies","Generating and serving technical documentation","Monitoring application health","Creating scaffolder templates"],"correct":1,"section":"Customizing Backstage","explanation":"TechDocs generates and serves technical documentation using MkDocs, publishing to various storage backends like S3, Google Cloud Storage, or local filesystem."},{"question":"Which storage backend is NOT supported by TechDocs?","choices":["AWS S3","Google Cloud Storage","Azure Blob Storage","MongoDB GridFS"],"correct":3,"section":"Customizing Backstage","explanation":"TechDocs supports AWS S3, Google Cloud Storage, Azure Blob Storage, and local filesystem, but not MongoDB GridFS."},{"question":"What annotation is used to connect a catalog entity to its TechDocs?","choices":["backstage.io/docs-ref","backstage.io/techdocs-ref","techdocs.io/path","docs.backstage.io/location"],"correct":1,"section":"Customizing Backstage","explanation":"'backstage.io/techdocs-ref: dir:.' indicates TechDocs documentation exists, typically in the same directory as catalog-info.yaml."},{"question":"What is the Scaffolder in Backstage used for?","choices":["Building Docker containers","Creating new software projects from templates","Managing user permissions","Monitoring system metrics"],"correct":1,"section":"Backstage Development Workflow","explanation":"The Scaffolder creates new software projects from predefined templates, ensuring consistency and automating setup tasks across teams."},{"question":"Which file format is used for Scaffolder templates?","choices":["JSON","XML","YAML","TOML"],"correct":2,"section":"Backstage Development Workflow","explanation":"Scaffolder templates use YAML format with API version 'scaffolder.backstage.io/v1beta3', defining parameters, steps, and metadata."},{"question":"What is the purpose of the 'integrations' section in app-config.yaml?","choices":["Configuring database connections","Setting up authentication with external services like GitHub, GitLab","Defining plugin dependencies","Managing user roles and permissions"],"correct":1,"section":"Customizing Backstage","explanation":"The 'integrations' section configures authentication for external services like GitHub, GitLab, and Azure DevOps, enabling data fetching and interaction."},{"question":"Which authentication provider is NOT natively supported by Backstage?","choices":["GitHub OAuth","Google OAuth","LDAP","Slack OAuth"],"correct":3,"section":"Customizing Backstage","explanation":"Backstage supports GitHub OAuth, Google OAuth, and LDAP, but not Slack OAuth. It focuses on development-focused identity providers."},{"question":"What is the default port that Backstage backend runs on during development?","choices":["3000","7007","8080","5000"],"correct":1,"section":"Backstage Development Workflow","explanation":"Backstage backend runs on port 7007 by default, configured in app-config.yaml under backend.listen.port."},{"question":"How do you register a new location in the Backstage Catalog?","choices":["Only through the app-config.yaml file","Only through the UI","Both through app-config.yaml and the UI","Only programmatically via API calls"],"correct":2,"section":"Backstage Catalog","explanation":"Catalog locations can be registered through app-config.yaml (permanent) and the UI (ad-hoc), plus programmatically via API."},{"question":"What is the purpose of the Software Templates feature in Backstage?","choices":["Creating reusable UI components","Generating standardized software projects and components","Managing container orchestration","Building CI/CD pipelines"],"correct":1,"section":"Customizing Backstage","explanation":"Software Templates provide self-service project bootstrapping with best practices, proper structure, and necessary configuration built-in."},{"question":"Which command is used to start both frontend and backend in development mode?","choices":["yarn start","yarn dev","yarn run:all","yarn develop"],"correct":1,"section":"Backstage Development Workflow","explanation":"'yarn dev' starts both frontend and backend services in development mode with hot reloading for a complete development environment."},{"question":"What is the role of the Discovery API in Backstage?","choices":["Finding new plugins in the marketplace","Locating internal service URLs within the Backstage backend","Discovering entities in the catalog","Auto-detecting configuration files"],"correct":1,"section":"Backstage Infrastructure","explanation":"The Discovery API helps backend plugins locate and communicate with other services by resolving service URLs dynamically."}];

let currentQ = 0, userAnswers = [], mode = 'practice', timerInterval = null, timeLeft = 0, startTime = null;

function startQuiz(m) {
  mode = m; currentQ = 0; userAnswers = new Array(questions.length).fill(null); startTime = new Date();
  document.getElementById('startScreen').style.display = 'none';
  document.getElementById('questionScreen').style.display = 'block';
  if (mode === 'timed') { timeLeft = 90 * 60; document.getElementById('timerDisplay').style.display = 'inline-block'; startTimer(); }
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
  const pct = Math.round(correct / questions.length * 100); const passed = pct >= 75; const timeTaken = Math.round((new Date() - startTime) / 60000);
  const sections = {}; questions.forEach((q, i) => { if (!sections[q.section]) sections[q.section] = { correct: 0, total: 0 }; sections[q.section].total++; if (userAnswers[i] === q.correct) sections[q.section].correct++; });
  let html = `<div class="results-container"><h2>${passed ? '🎉 Congratulations!' : '📚 Keep Practicing!'}</h2><div class="score-circle ${passed ? 'pass' : 'fail'}"><div class="score-percent">${pct}%</div><div class="score-fraction">${correct}/${questions.length}</div></div><div class="results-details"><p><strong>${passed ? '✅ PASSED' : '❌ Not Passed'}</strong> (75% required)</p><p>⏱️ Time: ${timeTaken} minutes</p><p>✓ Correct: ${correct} | ✗ Incorrect: ${questions.length - correct - userAnswers.filter(a=>a===null).length} | ⚠️ Unanswered: ${userAnswers.filter(a=>a===null).length}</p></div><h3>Performance by Topic</h3><div class="section-results">`;
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

- [Backstage Documentation](https://backstage.io/docs/)
- [Backstage GitHub Repository](https://github.com/backstage/backstage)
- [CBA Certification Info](https://training.linuxfoundation.org/certification/certified-backstage-associate-cba/)

[← Back to CBA Overview](./README.md)
