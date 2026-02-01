# PCA Interactive Demo Exam

Welcome to the **Prometheus Certified Associate (PCA)** interactive demo exam! Test your knowledge with **80 questions** covering Prometheus monitoring, PromQL, alerting, and operations.

<style>
.quiz-container { max-width: 900px; margin: 0 auto; padding: 20px; }
.quiz-header { background: linear-gradient(135deg, #e65100 0%, #ff9800 100%); color: white; padding: 30px; border-radius: 15px; text-align: center; margin-bottom: 30px; }
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
.progress-fill { height: 100%; background: linear-gradient(90deg, #e65100, #ff9800); transition: width 0.3s; border-radius: 6px; }
.progress-text { display: flex; justify-content: space-between; margin-top: 10px; font-size: 0.95em; color: #666; }
.question-section { display: inline-block; background: #fff3e0; color: #e65100; padding: 5px 15px; border-radius: 20px; font-size: 0.85em; margin-bottom: 15px; }
.question-text { font-size: 1.3em; line-height: 1.6; margin-bottom: 25px; color: #333; }
.choices { display: flex; flex-direction: column; gap: 12px; }
.choice { padding: 18px 20px; border: 2px solid #e0e0e0; border-radius: 12px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 15px; }
.choice:hover { border-color: #e65100; background: #fff3e0; }
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
.nav-btn.primary { background: linear-gradient(135deg, #e65100, #ff9800); color: white; }
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
.section-bar-fill { height: 100%; background: linear-gradient(90deg, #e65100, #ff9800); transition: width 0.5s; }
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
    <h2 style="margin:0;">🔥 PCA Practice Exam</h2>
    <div class="quiz-stats">
      <div class="stat-box"><div class="stat-number" id="totalQ">80</div><div class="stat-label">Questions</div></div>
      <div class="stat-box"><div class="stat-number" id="topicCount">6</div><div class="stat-label">Topics</div></div>
      <div class="stat-box"><div class="stat-number">~120</div><div class="stat-label">Minutes</div></div>
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
        <small>120 min countdown</small>
      </button>
    </div>
  </div>
  
  <div id="questionScreen" style="display:none;"></div>
  <div id="resultsScreen" style="display:none;"></div>
  <div id="reviewScreen" style="display:none;"></div>
</div>

<script>
const questions = [{"question":"What is the primary data model used by Prometheus?","choices":["Key-value pairs","Time series with labels","Relational tables","Document-based"],"correct":1,"section":"Prometheus Fundamentals","explanation":"Prometheus uses a time series data model where each time series is identified by a metric name and key-value label pairs."},{"question":"Which component is responsible for scraping metrics in Prometheus?","choices":["Alertmanager","Pushgateway","Prometheus server","Exporter"],"correct":2,"section":"Prometheus Architecture","explanation":"The Prometheus server is responsible for scraping metrics from configured targets."},{"question":"What is the default scrape interval in Prometheus?","choices":["15 seconds","30 seconds","1 minute","5 minutes"],"correct":2,"section":"Prometheus Configuration","explanation":"The default scrape interval in Prometheus is 1 minute (60 seconds)."},{"question":"Which PromQL function calculates the per-second rate of increase?","choices":["increase()","rate()","irate()","delta()"],"correct":1,"section":"PromQL","explanation":"The rate() function calculates the per-second average rate of increase of a counter over a time range."},{"question":"What type of metric is used to track the number of requests?","choices":["Gauge","Counter","Histogram","Summary"],"correct":1,"section":"Prometheus Fundamentals","explanation":"Counters are used for values that only increase, like the number of requests."},{"question":"Which metric type is best for measuring request latency distributions?","choices":["Counter","Gauge","Histogram","Summary"],"correct":2,"section":"Prometheus Fundamentals","explanation":"Histograms are ideal for measuring distributions like request latencies."},{"question":"What is the purpose of the Pushgateway?","choices":["Push alerts to external systems","Allow short-lived jobs to push metrics","Replace the Prometheus server","Store long-term metrics"],"correct":1,"section":"Prometheus Architecture","explanation":"Pushgateway allows short-lived jobs to push their metrics to Prometheus."},{"question":"Which label is automatically added to all scraped metrics?","choices":["__name__","job","instance","Both job and instance"],"correct":3,"section":"Prometheus Configuration","explanation":"Both 'job' and 'instance' labels are automatically added to scraped metrics."},{"question":"What does the 'up' metric indicate?","choices":["CPU usage","Memory usage","Target health status","Network connectivity"],"correct":2,"section":"Prometheus Fundamentals","explanation":"The 'up' metric indicates whether a scrape target is healthy (1) or unhealthy (0)."},{"question":"Which PromQL operator is used for label matching?","choices":["==","=","=~","All of the above"],"correct":3,"section":"PromQL","explanation":"PromQL supports = for exact match, != for not equal, =~ for regex match, and !~ for negative regex."},{"question":"What is the purpose of recording rules?","choices":["Record alerts","Pre-compute frequently used queries","Log metric values","Record configuration changes"],"correct":1,"section":"Prometheus Configuration","explanation":"Recording rules pre-compute frequently used or expensive queries and save results as new time series."},{"question":"Which component handles alert routing and grouping?","choices":["Prometheus server","Alertmanager","Pushgateway","Exporter"],"correct":1,"section":"Alerting","explanation":"Alertmanager handles alert routing, grouping, silencing, and notification."},{"question":"What is the default retention period for Prometheus data?","choices":["7 days","15 days","30 days","90 days"],"correct":1,"section":"Prometheus Configuration","explanation":"The default retention period in Prometheus is 15 days."},{"question":"Which PromQL function returns the instant value of a gauge?","choices":["rate()","increase()","No function needed","delta()"],"correct":2,"section":"PromQL","explanation":"Gauges can be queried directly without any function to get their instant value."},{"question":"What is the purpose of relabeling in Prometheus?","choices":["Change metric names","Modify labels before scraping or storing","Rename alert rules","Change dashboard labels"],"correct":1,"section":"Prometheus Configuration","explanation":"Relabeling allows modification of labels before scraping (relabel_configs) or storing (metric_relabel_configs)."},{"question":"Which HTTP endpoint exposes Prometheus metrics?","choices":["/metrics","/prometheus","/api/v1/metrics","/health"],"correct":0,"section":"Prometheus Fundamentals","explanation":"The /metrics endpoint is the standard path for exposing Prometheus metrics."},{"question":"What is the difference between rate() and irate()?","choices":["rate() is faster","irate() uses only the last two samples","rate() is for gauges","No difference"],"correct":1,"section":"PromQL","explanation":"irate() calculates instant rate using only the last two data points, while rate() uses all points in the range."},{"question":"Which metric type can both increase and decrease?","choices":["Counter","Gauge","Histogram","Summary"],"correct":1,"section":"Prometheus Fundamentals","explanation":"Gauges can both increase and decrease, representing values like temperature or memory usage."},{"question":"What is the purpose of the histogram_quantile() function?","choices":["Create histograms","Calculate quantiles from histogram buckets","Count histogram samples","Reset histogram buckets"],"correct":1,"section":"PromQL","explanation":"histogram_quantile() calculates quantiles (like p99) from histogram bucket data."},{"question":"Which Prometheus component discovers targets dynamically?","choices":["Alertmanager","Service discovery","Pushgateway","Exporter"],"correct":1,"section":"Prometheus Architecture","explanation":"Service discovery mechanisms allow Prometheus to dynamically discover scrape targets."},{"question":"What is the format of Prometheus exposition format?","choices":["JSON","XML","Plain text with specific format","YAML"],"correct":2,"section":"Prometheus Fundamentals","explanation":"Prometheus uses a plain text exposition format with specific syntax for metrics."},{"question":"Which PromQL aggregation operator calculates the average?","choices":["sum()","avg()","mean()","average()"],"correct":1,"section":"PromQL","explanation":"The avg() aggregation operator calculates the average of values."},{"question":"What is the purpose of the 'for' clause in alerting rules?","choices":["Define alert duration","Specify how long a condition must be true","Set alert frequency","Define retention period"],"correct":1,"section":"Alerting","explanation":"The 'for' clause specifies how long a condition must be true before firing an alert."},{"question":"Which label modifier keeps only specified labels?","choices":["by","without","keep","only"],"correct":0,"section":"PromQL","explanation":"The 'by' clause keeps only the specified labels in aggregation operations."},{"question":"What is the purpose of the absent() function?","choices":["Remove metrics","Check if a time series exists","Delete labels","Clear alerts"],"correct":1,"section":"PromQL","explanation":"absent() returns 1 if the vector has no elements, useful for detecting missing metrics."},{"question":"Which service discovery is built into Prometheus?","choices":["Kubernetes","Consul","EC2","All of the above"],"correct":3,"section":"Prometheus Architecture","explanation":"Prometheus has built-in support for Kubernetes, Consul, EC2, and many other service discoveries."},{"question":"What is the purpose of the offset modifier?","choices":["Shift time series in time","Add offset to values","Change label values","Modify scrape interval"],"correct":0,"section":"PromQL","explanation":"The offset modifier shifts the time series evaluation back in time."},{"question":"Which metric suffix indicates histogram buckets?","choices":["_count","_sum","_bucket","_total"],"correct":2,"section":"Prometheus Fundamentals","explanation":"Histogram buckets use the _bucket suffix with an 'le' (less than or equal) label."},{"question":"What is the purpose of the label_replace() function?","choices":["Delete labels","Create or modify labels using regex","Rename metrics","Sort labels"],"correct":1,"section":"PromQL","explanation":"label_replace() creates or modifies labels based on regex capture groups."},{"question":"Which Alertmanager feature prevents duplicate alerts?","choices":["Silencing","Inhibition","Grouping","Deduplication"],"correct":2,"section":"Alerting","explanation":"Grouping combines similar alerts into a single notification to prevent alert storms."},{"question":"What is the default port for Prometheus server?","choices":["8080","9090","9100","3000"],"correct":1,"section":"Prometheus Configuration","explanation":"Prometheus server runs on port 9090 by default."},{"question":"Which PromQL function returns the number of elements?","choices":["count()","len()","size()","elements()"],"correct":0,"section":"PromQL","explanation":"The count() aggregation operator returns the number of elements in a vector."},{"question":"What is the purpose of the scrape_timeout configuration?","choices":["Set maximum scrape duration","Define retry interval","Set connection timeout","Define data retention"],"correct":0,"section":"Prometheus Configuration","explanation":"scrape_timeout sets the maximum time allowed for a scrape to complete."},{"question":"Which exporter collects host-level metrics?","choices":["blackbox_exporter","node_exporter","mysqld_exporter","redis_exporter"],"correct":1,"section":"Prometheus Architecture","explanation":"node_exporter collects hardware and OS-level metrics from Linux/Unix hosts."},{"question":"What is the purpose of the topk() function?","choices":["Return top k values","Sort in descending order","Filter by threshold","Calculate percentiles"],"correct":0,"section":"PromQL","explanation":"topk() returns the k largest elements by sample value."},{"question":"Which Alertmanager feature suppresses alerts based on other alerts?","choices":["Silencing","Inhibition","Grouping","Routing"],"correct":1,"section":"Alerting","explanation":"Inhibition suppresses alerts when other related alerts are firing."},{"question":"What is the purpose of the increase() function?","choices":["Calculate rate per second","Calculate total increase over time range","Increase metric values","Add to counter"],"correct":1,"section":"PromQL","explanation":"increase() calculates the total increase of a counter over a specified time range."},{"question":"Which configuration section defines scrape targets?","choices":["global","alerting","scrape_configs","rule_files"],"correct":2,"section":"Prometheus Configuration","explanation":"The scrape_configs section defines the targets and parameters for scraping."},{"question":"What is the purpose of the changes() function?","choices":["Count value changes","Track configuration changes","Monitor file changes","Count label changes"],"correct":0,"section":"PromQL","explanation":"changes() returns the number of times a gauge's value has changed within a time range."},{"question":"Which metric type provides pre-calculated quantiles?","choices":["Counter","Gauge","Histogram","Summary"],"correct":3,"section":"Prometheus Fundamentals","explanation":"Summary metrics provide pre-calculated quantiles on the client side."},{"question":"What is the purpose of the predict_linear() function?","choices":["Predict future values","Calculate linear regression","Smooth data","Interpolate missing values"],"correct":0,"section":"PromQL","explanation":"predict_linear() predicts the value of a gauge at a future time based on linear regression."},{"question":"Which Prometheus feature allows horizontal scaling?","choices":["Sharding","Federation","Replication","Clustering"],"correct":1,"section":"Prometheus Architecture","explanation":"Federation allows Prometheus servers to scrape metrics from other Prometheus servers."},{"question":"What is the purpose of the deriv() function?","choices":["Calculate derivative","Derive new metrics","Calculate rate of change","All of the above"],"correct":0,"section":"PromQL","explanation":"deriv() calculates the per-second derivative of a gauge using simple linear regression."},{"question":"Which label is used for histogram bucket boundaries?","choices":["bucket","le","quantile","boundary"],"correct":1,"section":"Prometheus Fundamentals","explanation":"The 'le' (less than or equal) label defines histogram bucket boundaries."},{"question":"What is the purpose of the clamp() function?","choices":["Limit values to a range","Clamp time series together","Fix metric values","Compress data"],"correct":0,"section":"PromQL","explanation":"clamp() limits sample values to be within a specified minimum and maximum."},{"question":"Which Alertmanager receiver sends notifications to Slack?","choices":["webhook_config","slack_config","email_config","pagerduty_config"],"correct":1,"section":"Alerting","explanation":"slack_config configures Slack as a notification receiver in Alertmanager."},{"question":"What is the purpose of the resets() function?","choices":["Reset metrics","Count counter resets","Reset alerts","Clear time series"],"correct":1,"section":"PromQL","explanation":"resets() returns the number of times a counter has been reset within a time range."},{"question":"Which configuration option sets the evaluation interval for rules?","choices":["scrape_interval","evaluation_interval","rule_interval","alert_interval"],"correct":1,"section":"Prometheus Configuration","explanation":"evaluation_interval sets how often Prometheus evaluates recording and alerting rules."},{"question":"What is the purpose of the sort() function?","choices":["Sort by label","Sort by value ascending","Sort by time","Sort alphabetically"],"correct":1,"section":"PromQL","explanation":"sort() returns vector elements sorted by their sample values in ascending order."},{"question":"Which exporter tests endpoint availability?","choices":["node_exporter","blackbox_exporter","snmp_exporter","statsd_exporter"],"correct":1,"section":"Prometheus Architecture","explanation":"blackbox_exporter probes endpoints over HTTP, HTTPS, DNS, TCP, and ICMP."},{"question":"What is the purpose of the vector() function?","choices":["Create a vector from scalar","Convert to vector","Initialize vector","All of the above"],"correct":0,"section":"PromQL","explanation":"vector() returns a scalar as a vector with no labels."},{"question":"Which PromQL operator performs vector matching?","choices":["on","ignoring","group_left","All of the above"],"correct":3,"section":"PromQL","explanation":"on, ignoring, group_left, and group_right are used for vector matching in binary operations."},{"question":"What is the purpose of the timestamp() function?","choices":["Get current time","Return sample timestamp","Set timestamp","Format timestamp"],"correct":1,"section":"PromQL","explanation":"timestamp() returns the timestamp of each sample as a new time series."},{"question":"Which storage format does Prometheus use?","choices":["SQLite","LevelDB","Custom TSDB","InfluxDB"],"correct":2,"section":"Prometheus Architecture","explanation":"Prometheus uses its own custom time series database (TSDB) for storage."},{"question":"What is the purpose of the sgn() function?","choices":["Sign the metric","Return sign of value","Signal processing","Signature verification"],"correct":1,"section":"PromQL","explanation":"sgn() returns the sign of a value: 1 for positive, -1 for negative, 0 for zero."},{"question":"Which Prometheus API endpoint queries instant values?","choices":["/api/v1/query","/api/v1/query_range","/api/v1/series","/api/v1/labels"],"correct":0,"section":"Prometheus Architecture","explanation":"/api/v1/query evaluates an instant query at a single point in time."},{"question":"What is the purpose of the label_join() function?","choices":["Join time series","Concatenate label values","Join labels from multiple metrics","Merge label sets"],"correct":1,"section":"PromQL","explanation":"label_join() joins multiple label values into a new label with a separator."},{"question":"Which metric naming convention is recommended?","choices":["camelCase","PascalCase","snake_case","kebab-case"],"correct":2,"section":"Prometheus Fundamentals","explanation":"Prometheus recommends snake_case for metric names (e.g., http_requests_total)."},{"question":"What is the purpose of the floor() function?","choices":["Round down to integer","Set minimum value","Floor the time series","Truncate decimals"],"correct":0,"section":"PromQL","explanation":"floor() rounds sample values down to the nearest integer."},{"question":"Which Alertmanager feature temporarily mutes alerts?","choices":["Inhibition","Silencing","Grouping","Routing"],"correct":1,"section":"Alerting","explanation":"Silencing temporarily mutes alerts based on matchers for a specified duration."},{"question":"What is the purpose of the ceil() function?","choices":["Set ceiling value","Round up to integer","Cap maximum value","Ceiling the time series"],"correct":1,"section":"PromQL","explanation":"ceil() rounds sample values up to the nearest integer."},{"question":"Which relabel action drops a target?","choices":["drop","keep","replace","labelmap"],"correct":0,"section":"Prometheus Configuration","explanation":"The 'drop' action removes targets that match the specified regex."},{"question":"What is the purpose of the round() function?","choices":["Round to nearest integer","Round to specified precision","Round robin selection","Round trip time"],"correct":1,"section":"PromQL","explanation":"round() rounds sample values to the nearest integer or specified precision."},{"question":"Which PromQL modifier specifies the time range?","choices":["[5m]","offset 5m","@ timestamp","All of the above"],"correct":0,"section":"PromQL","explanation":"Square brackets [5m] specify a range vector selector with a 5-minute range."},{"question":"What is the purpose of the exp() function?","choices":["Export metrics","Calculate exponential","Expand labels","Expression evaluation"],"correct":1,"section":"PromQL","explanation":"exp() calculates the exponential function (e^x) for sample values."},{"question":"Which Prometheus flag sets the storage path?","choices":["--storage.path","--storage.tsdb.path","--data.path","--tsdb.path"],"correct":1,"section":"Prometheus Configuration","explanation":"--storage.tsdb.path sets the directory for Prometheus TSDB storage."},{"question":"What is the purpose of the ln() function?","choices":["Line number","Natural logarithm","Linear interpolation","Link metrics"],"correct":1,"section":"PromQL","explanation":"ln() calculates the natural logarithm of sample values."},{"question":"Which metric suffix indicates a counter total?","choices":["_count","_sum","_total","_bucket"],"correct":2,"section":"Prometheus Fundamentals","explanation":"The _total suffix is recommended for counter metrics (e.g., http_requests_total)."},{"question":"What is the purpose of the sqrt() function?","choices":["Square root","Square values","Sequential root","Standard deviation"],"correct":0,"section":"PromQL","explanation":"sqrt() calculates the square root of sample values."},{"question":"Which Alertmanager configuration defines notification receivers?","choices":["route","receivers","inhibit_rules","templates"],"correct":1,"section":"Alerting","explanation":"The receivers section defines notification endpoints like email, Slack, PagerDuty."},{"question":"What is the purpose of the abs() function?","choices":["Absolute path","Absolute value","Abstract metric","Absorb values"],"correct":1,"section":"PromQL","explanation":"abs() returns the absolute value of sample values."},{"question":"Which PromQL function calculates standard deviation?","choices":["std()","stddev()","stdev()","deviation()"],"correct":1,"section":"PromQL","explanation":"stddev() calculates the population standard deviation of values."},{"question":"What is the purpose of the day_of_week() function?","choices":["Return day name","Return day number (0-6)","Filter by day","Count days"],"correct":1,"section":"PromQL","explanation":"day_of_week() returns the day of the week (0=Sunday to 6=Saturday) for timestamps."},{"question":"Which Prometheus feature compacts old data?","choices":["Retention","Compaction","Garbage collection","Archiving"],"correct":1,"section":"Prometheus Architecture","explanation":"Compaction merges smaller blocks into larger ones for efficient storage."},{"question":"What is the purpose of the hour() function?","choices":["Return current hour","Return hour from timestamp","Count hours","Filter by hour"],"correct":1,"section":"PromQL","explanation":"hour() returns the hour of the day (0-23) for timestamps."},{"question":"Which relabel action keeps matching targets?","choices":["drop","keep","replace","labelmap"],"correct":1,"section":"Prometheus Configuration","explanation":"The 'keep' action keeps only targets that match the specified regex."},{"question":"What is the purpose of the minute() function?","choices":["Return current minute","Return minute from timestamp","Count minutes","Filter by minute"],"correct":1,"section":"PromQL","explanation":"minute() returns the minute of the hour (0-59) for timestamps."},{"question":"Which PromQL function calculates variance?","choices":["var()","variance()","stdvar()","variation()"],"correct":2,"section":"PromQL","explanation":"stdvar() calculates the population variance of values."},{"question":"What is the purpose of the month() function?","choices":["Return month name","Return month number (1-12)","Filter by month","Count months"],"correct":1,"section":"PromQL","explanation":"month() returns the month of the year (1-12) for timestamps."},{"question":"Which Prometheus component stores alert state?","choices":["Prometheus server","Alertmanager","Both","Neither"],"correct":2,"section":"Alerting","explanation":"Both Prometheus (pending/firing) and Alertmanager (notification state) store alert state."},{"question":"What is the purpose of the year() function?","choices":["Return current year","Return year from timestamp","Count years","Filter by year"],"correct":1,"section":"PromQL","explanation":"year() returns the year for timestamps."}];

let currentQ = 0, userAnswers = [], mode = 'practice', timerInterval = null, timeLeft = 0, startTime = null;

function startQuiz(m) {
  mode = m; currentQ = 0; userAnswers = new Array(questions.length).fill(null); startTime = new Date();
  document.getElementById('startScreen').style.display = 'none';
  document.getElementById('questionScreen').style.display = 'block';
  if (mode === 'timed') { timeLeft = 120 * 60; document.getElementById('timerDisplay').style.display = 'inline-block'; startTimer(); }
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

- [Prometheus Documentation](https://prometheus.io/docs/)
- [PromQL Basics](https://prometheus.io/docs/prometheus/latest/querying/basics/)
- [Alertmanager Documentation](https://prometheus.io/docs/alerting/latest/alertmanager/)

[← Back to PCA Overview](./README.md)
