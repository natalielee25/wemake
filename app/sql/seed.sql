-- Seed file for wemake database
-- Using profile_id: '8831ea23-0257-4f52-971c-117d2e5fd5d4' for all profile references
-- Note: profiles table is NOT seeded - assumes profile already exists

-- ============================================
-- TIER 1: Tables with no dependencies
-- ============================================
-- Categories (5 rows)
INSERT INTO categories (name, description, created_at, updated_at)
VALUES 
  ('Developer Tools', 'Tools and utilities that help developers write better code faster', '2025-01-01 00:00:00', '2025-01-01 00:00:00'),
  ('Productivity', 'Apps and services that boost your daily productivity', '2025-01-01 00:00:00', '2025-01-01 00:00:00'),
  ('AI & Machine Learning', 'Products leveraging artificial intelligence and machine learning', '2025-01-01 00:00:00', '2025-01-01 00:00:00'),
  ('Design Tools', 'Software for designers, including UI/UX and graphic design tools', '2025-01-01 00:00:00', '2025-01-01 00:00:00'),
  ('Marketing', 'Tools for marketers to grow and engage their audience', '2025-01-01 00:00:00', '2025-01-01 00:00:00');

-- Jobs (5 rows)
INSERT INTO jobs (position, overview, responsibilities, qualifications, benefits, skills, company_name, company_logo, company_location, apply_url, job_type, location, salary_range)
VALUES 
  ('Senior Frontend Developer', 'We are looking for a Senior Frontend Developer to join our dynamic team.', 'Build and maintain web applications, collaborate with designers, review code', 'At least 5 years of experience with React, TypeScript proficiency', 'Health insurance, 401k matching, unlimited PTO', 'React, TypeScript, Tailwind CSS, Node.js', 'TechCorp Inc', 'https://example.com/logos/techcorp.png', 'San Francisco, CA', 'https://techcorp.com/careers/senior-frontend', 'full-time', 'hybrid', '$125,000 - $150,000'),
  ('Backend Engineer', 'Join our backend team to build scalable APIs and services.', 'Design and implement REST APIs, optimize database queries, write tests', '3+ years experience with Node.js or Python, SQL expertise', 'Remote work, stock options, annual learning budget', 'Node.js, PostgreSQL, Redis, Docker', 'DataFlow Systems', 'https://example.com/logos/dataflow.png', 'Austin, TX', 'https://dataflow.io/jobs/backend', 'full-time', 'remote', '$100,000 - $125,000'),
  ('Product Designer', 'Create beautiful and intuitive user experiences for our products.', 'Design UI/UX, create prototypes, conduct user research, collaborate with engineers', '4+ years product design experience, Figma proficiency', 'Flexible hours, health benefits, design conference budget', 'Figma, User Research, Prototyping, Design Systems', 'DesignHub Co', 'https://example.com/logos/designhub.png', 'New York, NY', 'https://designhub.co/careers/product-designer', 'full-time', 'on-site', '$100,000 - $125,000'),
  ('DevOps Engineer', 'Help us build and maintain our cloud infrastructure.', 'Manage CI/CD pipelines, monitor systems, implement security best practices', '3+ years DevOps experience, AWS or GCP certification preferred', 'Competitive salary, remote-first, home office stipend', 'AWS, Kubernetes, Terraform, GitHub Actions', 'CloudNine Tech', 'https://example.com/logos/cloudnine.png', 'Seattle, WA', 'https://cloudnine.tech/careers/devops', 'full-time', 'remote', '$150,000 - $200,000'),
  ('Part-time Marketing Coordinator', 'Support our marketing team with campaign execution.', 'Manage social media, coordinate campaigns, analyze metrics', '2+ years marketing experience, social media savvy', 'Flexible schedule, growth opportunities', 'Social Media, Analytics, Content Creation, SEO', 'GrowthLabs', 'https://example.com/logos/growthlabs.png', 'Los Angeles, CA', 'https://growthlabs.com/jobs/marketing', 'part-time', 'remote', '$50,000 - $75,000');


-- Topics (5 rows)
INSERT INTO topics (name, slug)
VALUES 
  ('General Discussion', 'general-discussion'),
  ('Show & Tell', 'show-and-tell'),
  ('Ask the Community', 'ask-the-community'),
  ('Feature Requests', 'feature-requests'),
  ('Bug Reports', 'bug-reports');

-- Team (5 rows)
INSERT INTO team (product_name, team_size, equity_split, product_stage, roles, product_description)
VALUES 
  ('TaskFlow Pro', 2, 50, 'mvp', 'Looking for a backend developer', 'A task management app with AI-powered prioritization'),
  ('HealthTrack', 3, 33, 'prototype', 'Need a mobile developer and designer', 'Personal health tracking with smart insights'),
  ('EcoShop', 1, 100, 'idea', 'Seeking co-founder with e-commerce experience', 'Sustainable marketplace for eco-friendly products'),
  ('CodeReview AI', 4, 25, 'product', 'Looking for ML engineer', 'AI-powered code review assistant for teams'),
  ('MeetingBot', 2, 40, 'mvp', 'Need a frontend developer', 'Smart meeting scheduler with calendar integration');

-- GPT Ideas (5 rows)
INSERT INTO gpt_ideas (idea, views, claimed_at, claimed_by)
VALUES 
  ('An AI-powered app that generates personalized workout routines based on your fitness level and available equipment', 150, NULL, NULL),
  ('A browser extension that summarizes long articles and documents in one click', 230, NULL, NULL),
  ('A collaborative whiteboard tool specifically designed for remote brainstorming sessions', 89, '2025-12-15 10:30:00', '8831ea23-0257-4f52-971c-117d2e5fd5d4'),
  ('An app that tracks your subscriptions and alerts you before renewals', 312, NULL, NULL),
  ('A platform connecting local farmers directly with consumers for fresh produce delivery', 178, NULL, NULL);

-- Message Rooms (5 rows)
INSERT INTO message_rooms DEFAULT VALUES;
INSERT INTO message_rooms DEFAULT VALUES;
INSERT INTO message_rooms DEFAULT VALUES;
INSERT INTO message_rooms DEFAULT VALUES;
INSERT INTO message_rooms DEFAULT VALUES;

-- ============================================
-- TIER 2: Tables depending on tier 1
-- ============================================

-- Products (5 rows) - depends on profiles, categories
INSERT INTO products (name, tagline, description, how_it_works, icon, url, stats, profile_id, category_id)
VALUES 
  ('CodeAssist Pro', 'Your AI-powered coding companion', 'CodeAssist Pro helps developers write better code faster with intelligent suggestions and real-time error detection.', 'Simply install the extension, and it analyzes your code in real-time, providing suggestions and catching bugs before they happen.', 'https://example.com/icons/codeassist.png', 'https://codeassist.pro', '{"views": 1520, "reviews": 23}', '8831ea23-0257-4f52-971c-117d2e5fd5d4', 1),
  ('FocusFlow', 'Stay focused, get more done', 'A productivity app that blocks distractions and helps you maintain deep focus sessions.', 'Set your focus duration, select apps to block, and let FocusFlow create an distraction-free environment.', 'https://example.com/icons/focusflow.png', 'https://focusflow.app', '{"views": 890, "reviews": 15}', '8831ea23-0257-4f52-971c-117d2e5fd5d4', 2),
  ('PromptGenius', 'Craft perfect AI prompts', 'A library and generator for high-quality AI prompts across various use cases.', 'Browse our curated prompt library or use our generator to create custom prompts optimized for your AI model.', 'https://example.com/icons/promptgenius.png', 'https://promptgenius.io', '{"views": 2100, "reviews": 42}', '8831ea23-0257-4f52-971c-117d2e5fd5d4', 3),
  ('DesignSystem.io', 'Build design systems faster', 'A comprehensive toolkit for creating and maintaining design systems across your organization.', 'Import your brand guidelines, and we automatically generate a complete design system with tokens, components, and documentation.', 'https://example.com/icons/designsystem.png', 'https://designsystem.io', '{"views": 650, "reviews": 8}', '8831ea23-0257-4f52-971c-117d2e5fd5d4', 4),
  ('GrowthMetrics', 'Marketing analytics simplified', 'All your marketing metrics in one beautiful dashboard with actionable insights.', 'Connect your marketing tools, and GrowthMetrics aggregates data and provides AI-powered recommendations.', 'https://example.com/icons/growthmetrics.png', 'https://growthmetrics.co', '{"views": 430, "reviews": 6}', '8831ea23-0257-4f52-971c-117d2e5fd5d4', 5);

-- Posts (5 rows) - depends on topics, profiles
INSERT INTO posts (title, content, topic_id, profile_id)
VALUES 
  ('Welcome to the community!', 'Hey everyone! Excited to be part of this community. Looking forward to connecting with fellow makers and sharing ideas.', 1, '8831ea23-0257-4f52-971c-117d2e5fd5d4'),
  ('Just launched my first product!', 'After 6 months of hard work, I finally launched CodeAssist Pro. Would love to get your feedback!', 2, '8831ea23-0257-4f52-971c-117d2e5fd5d4'),
  ('How do you handle user authentication?', 'I am building a SaaS app and wondering what authentication solutions you all recommend. Considering Auth0, Clerk, or building custom.', 3, '8831ea23-0257-4f52-971c-117d2e5fd5d4'),
  ('Feature Request: Dark mode for dashboard', 'Would love to see a dark mode option for the dashboard. My eyes would thank you!', 4, '8831ea23-0257-4f52-971c-117d2e5fd5d4'),
  ('Bug: Login page not loading on Safari', 'The login page seems to hang on Safari 17. Anyone else experiencing this issue?', 5, '8831ea23-0257-4f52-971c-117d2e5fd5d4');

-- Messages (5 rows) - depends on message_rooms, profiles
INSERT INTO messages (message_room_id, sender_id, content, seen)
VALUES 
  (1, '8831ea23-0257-4f52-971c-117d2e5fd5d4', 'Hey! I saw your product and would love to chat about a potential collaboration.', true),
  (1, '8831ea23-0257-4f52-971c-117d2e5fd5d4', 'Sure, I am available this week. What time works for you?', true),
  (2, '8831ea23-0257-4f52-971c-117d2e5fd5d4', 'Thanks for the feedback on my launch!', false),
  (3, '8831ea23-0257-4f52-971c-117d2e5fd5d4', 'Would you be interested in joining our beta program?', false),
  (4, '8831ea23-0257-4f52-971c-117d2e5fd5d4', 'Just wanted to follow up on our conversation from last week.', false);

-- ============================================
-- TIER 3: Tables depending on tier 2
-- ============================================

-- Reviews (5 rows) - depends on products, profiles
INSERT INTO reviews (product_id, profile_id, rating, review)
VALUES 
  (1, '8831ea23-0257-4f52-971c-117d2e5fd5d4', 5, 'CodeAssist Pro has completely transformed my workflow. The AI suggestions are incredibly accurate!'),
  (1, '8831ea23-0257-4f52-971c-117d2e5fd5d4', 4, 'Great tool overall, but wish it had better support for Python. Still highly recommend.'),
  (2, '8831ea23-0257-4f52-971c-117d2e5fd5d4', 5, 'FocusFlow helped me reclaim my productivity. No more endless scrolling during work hours!'),
  (3, '8831ea23-0257-4f52-971c-117d2e5fd5d4', 5, 'PromptGenius is a game changer for anyone working with AI. The prompt library is extensive.'),
  (4, '8831ea23-0257-4f52-971c-117d2e5fd5d4', 4, 'Solid design system tool. The auto-generation feature saved us weeks of work.');

-- Post Replies (5 rows) - depends on posts, profiles
INSERT INTO post_replies (post_id, parent_id, profile_id, reply)
VALUES 
  (1, NULL, '8831ea23-0257-4f52-971c-117d2e5fd5d4', 'Welcome to the community! Feel free to reach out if you have any questions.'),
  (2, NULL, '8831ea23-0257-4f52-971c-117d2e5fd5d4', 'Congratulations on the launch! The product looks amazing.'),
  (3, NULL, '8831ea23-0257-4f52-971c-117d2e5fd5d4', 'I have been using Clerk and it has been great. Easy to set up and good documentation.'),
  (3, 3, '8831ea23-0257-4f52-971c-117d2e5fd5d4', 'Thanks for the recommendation! I will check out Clerk.'),
  (4, NULL, '8831ea23-0257-4f52-971c-117d2e5fd5d4', 'Dark mode is definitely on our roadmap! Stay tuned.');

-- Notifications (5 rows) - depends on profiles, products, posts
INSERT INTO notifications (source_id, product_id, post_id, target_id, type)
VALUES 
  ('8831ea23-0257-4f52-971c-117d2e5fd5d4', NULL, NULL, '8831ea23-0257-4f52-971c-117d2e5fd5d4', 'follow'),
  ('8831ea23-0257-4f52-971c-117d2e5fd5d4', 1, NULL, '8831ea23-0257-4f52-971c-117d2e5fd5d4', 'review'),
  ('8831ea23-0257-4f52-971c-117d2e5fd5d4', NULL, 1, '8831ea23-0257-4f52-971c-117d2e5fd5d4', 'reply'),
  ('8831ea23-0257-4f52-971c-117d2e5fd5d4', NULL, 2, '8831ea23-0257-4f52-971c-117d2e5fd5d4', 'mention'),
  ('8831ea23-0257-4f52-971c-117d2e5fd5d4', 2, NULL, '8831ea23-0257-4f52-971c-117d2e5fd5d4', 'review');

-- ============================================
-- COMPOSITE PRIMARY KEY TABLES (1 row each)
-- ============================================

-- Product Upvotes (1 row) - composite PK: (product_id, profile_id)
INSERT INTO product_upvotes (product_id, profile_id)
VALUES (1, '8831ea23-0257-4f52-971c-117d2e5fd5d4');

-- GPT Ideas Likes (1 row) - composite PK: (gpt_idea_id, profile_id)
INSERT INTO gpt_ideas_likes (gpt_idea_id, profile_id)
VALUES (1, '8831ea23-0257-4f52-971c-117d2e5fd5d4');

-- Post Upvotes (1 row) - composite PK: (post_id, profile_id)
INSERT INTO post_upvotes (post_id, profile_id)
VALUES (1, '8831ea23-0257-4f52-971c-117d2e5fd5d4');

-- Message Room Members (1 row) - composite PK: (message_room_id, profile_id)
INSERT INTO message_room_members (message_room_id, profile_id)
VALUES (1, '8831ea23-0257-4f52-971c-117d2e5fd5d4');

-- ============================================
-- NOTE: follows table does not have a defined primary key constraint
-- but conceptually follower_id + following_id would be unique
-- Since we only have one profile_id, we cannot create meaningful follow relationships
-- Skipping follows table seeding
-- ============================================
