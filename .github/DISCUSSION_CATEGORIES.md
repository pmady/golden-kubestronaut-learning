# GitHub Discussions Categories Setup

This document provides instructions for setting up discussion categories for the Golden Kubestronaut Learning repository.

## Recommended Categories

GitHub Discussions categories should be configured via the repository settings. Here are the recommended categories:

### 1. 📢 Announcements
- **Format**: Announcement
- **Description**: Official updates, new content releases, and important notices
- **Permissions**: Maintainers only can post

### 2. 💬 General
- **Format**: Open-ended discussion
- **Description**: General discussions about cloud native certifications and learning paths

### 3. ❓ Q&A
- **Format**: Question/Answer
- **Description**: Ask questions about certifications, exam preparation, or study materials
- **Features**: Enable "Mark as Answer" functionality

### 4. 🎓 Certification-Specific Discussions

Create separate categories for major certification tracks:

#### Kubestronaut Track (5 Certs)
- **KCNA Discussions** - Kubernetes and Cloud Native Associate
- **KCSA Discussions** - Kubernetes and Cloud Native Security Associate  
- **CKA Discussions** - Certified Kubernetes Administrator
- **CKAD Discussions** - Certified Kubernetes Application Developer
- **CKS Discussions** - Certified Kubernetes Security Specialist

#### Golden Kubestronaut Track (Additional Certs)
- **PCA Discussions** - Prometheus Certified Associate
- **CGOA Discussions** - Certified GitOps Associate
- **CAPA Discussions** - Certified Argo Project Associate
- **CCA Discussions** - Cilium Certified Associate
- **CBA Discussions** - Cilium Basics Associate
- **OTCA Discussions** - OpenTelemetry Certified Associate
- **KCA Discussions** - Kyverno Certified Associate
- **CNPA Discussions** - Cloud Native Platform Associate
- **CNPE Discussions** - Cloud Native Platform Engineer
- **LFCS Discussions** - Linux Foundation Certified System Administrator
- **ICA Discussions** - Istio Certified Associate

### 5. 🎯 Study Groups
- **Format**: Open-ended discussion
- **Description**: Find study partners, form study groups, or organize group sessions

### 6. 📝 Exam Experiences
- **Format**: Open-ended discussion
- **Description**: Share your exam experiences, study tips, and success stories (without violating NDA)

### 7. 💡 Ideas & Suggestions
- **Format**: Open-ended discussion
- **Description**: Suggest new features, content, or improvements to the learning resources

### 8. 🐛 Issues & Help
- **Format**: Question/Answer
- **Description**: Report issues with quizzes, labs, or documentation

## Setup Instructions

1. **Navigate to Repository Settings**
   - Go to: https://github.com/pmady/golden-kubestronaut-learning/settings

2. **Enable Discussions** (Already enabled ✓)
   - Under "Features", ensure "Discussions" is checked

3. **Configure Categories**
   - Go to: https://github.com/pmady/golden-kubestronaut-learning/discussions/categories
   - Click "New category" for each category above
   - Set the appropriate format (Announcement, Q&A, or Open-ended)
   - Add descriptions and emojis

4. **Set Category Permissions**
   - For "Announcements", restrict posting to maintainers only
   - All other categories should allow community posting

5. **Enable Features**
   - Enable "Mark as Answer" for Q&A categories
   - Enable upvoting for all categories
   - Enable search functionality (enabled by default)

## Category Organization Tips

- Use emojis in category names for better visual organization
- Keep category descriptions concise but informative
- Pin important discussions in each category
- Regularly review and merge similar discussions
- Archive outdated or resolved discussions

## Moderation

See [MODERATION_GUIDELINES.md](./MODERATION_GUIDELINES.md) for community moderation policies.

## Discussion Templates

Discussion templates are available in `.github/DISCUSSION_TEMPLATE/`:
- `ask-question.yml` - For asking questions
- `share-experience.yml` - For sharing exam experiences
- `study-group.yml` - For forming study groups

These templates will guide users to provide structured, helpful information when starting discussions.
