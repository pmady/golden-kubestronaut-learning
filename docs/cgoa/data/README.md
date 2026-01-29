# CGOA Exam Questions Data

This directory contains the question bank for the CGOA (Certified GitOps Associate) demo exam.

## Source

The questions in `questions.json` are sourced from the [hivagr/cgoa-mock-exam](https://github.com/hivagr/cgoa-mock-exam) repository, which provides a comprehensive collection of practice questions for the CGOA certification.

## Data Structure

Each question in the JSON file follows this structure:

```json
{
  "question": "Question text",
  "choices": [
    "Choice A",
    "Choice B",
    "Choice C",
    "Choice D"
  ],
  "correct": 0,
  "section": "Topic Area",
  "explanation": "Detailed explanation of the correct answer"
}
```

## Statistics

- **Total Questions**: 68
- **Topic Areas**: 17
- **Format**: Multiple choice (4 options per question)

## Topic Coverage

1. GitOps Terminology
2. GitOps Principles
3. GitOps Patterns
4. GitOps Tooling
5. GitOps Workflow
6. GitOps and Kubernetes
7. Security in GitOps
8. CI/CD and GitOps
9. Infrastructure as Code
10. Deployment Strategies
11. Observability and Monitoring
12. Troubleshooting GitOps
13. Compliance and Audit
14. Collaboration and Workflow
15. Getting Started with GitOps
16. GitOps Overview
17. Related Practices

## Credits

Questions curated by the [cgoa-mock-exam project](https://github.com/hivagr/cgoa-mock-exam).

## Usage

The questions are loaded dynamically by the demo exam interface at `../demo-exam.md` using the `cgoa-exam.js` JavaScript module.
