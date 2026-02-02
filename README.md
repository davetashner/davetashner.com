# davetashner.com

Personal website and blog built with Astro, Tailwind CSS, and TypeScript. Features a blog with markdown content, contact form, and automatic deployment to AWS.

## Tech Stack

- **Framework:** [Astro](https://astro.build/) v5 - Static site generator with excellent performance
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) v4 - Utility-first CSS framework
- **Language:** TypeScript - Type-safe JavaScript
- **Testing:** Vitest - Fast unit testing
- **Linting:** ESLint + Prettier - Code quality and formatting
- **Backend:** AWS Lambda + API Gateway - Serverless contact form handler
- **Hosting:** AWS S3 + CloudFront - Static hosting with CDN

## Getting Started

### Prerequisites

- Node.js 20 or later
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/davetashner.com.git
cd davetashner.com

# Install dependencies
npm install

# Start development server
npm run dev
```

The development server runs at `http://localhost:4321`.

## Available Scripts

| Command                 | Description                                |
| ----------------------- | ------------------------------------------ |
| `npm run dev`           | Start development server at localhost:4321 |
| `npm run build`         | Build production site to `./dist/`         |
| `npm run preview`       | Preview production build locally           |
| `npm run test`          | Run tests once                             |
| `npm run test:watch`    | Run tests in watch mode                    |
| `npm run test:coverage` | Run tests with coverage report             |
| `npm run lint`          | Check for linting errors                   |
| `npm run lint:fix`      | Fix linting errors automatically           |
| `npm run format`        | Format code with Prettier                  |
| `npm run format:check`  | Check code formatting                      |

## Project Structure

```
/
├── .github/
│   └── workflows/        # GitHub Actions CI/CD
│       ├── ci.yml        # Pull request checks
│       └── deploy.yml    # Production deployment
├── infrastructure/       # AWS Lambda backend
│   ├── contact-handler/  # Contact form Lambda function
│   ├── template.yaml     # AWS SAM template
│   └── samconfig.toml    # SAM deployment config
├── public/               # Static assets (served as-is)
│   ├── blog/             # Blog images
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── components/       # Reusable Astro components
│   ├── content/
│   │   └── blog/         # Markdown blog posts
│   ├── layouts/          # Page layouts
│   ├── pages/            # File-based routing
│   │   ├── blog/         # Blog pages and RSS feed
│   │   ├── about.astro
│   │   ├── contact.astro
│   │   └── index.astro
│   ├── styles/           # Global styles
│   └── utils/            # Utility functions
├── tests/                # Test files
├── astro.config.mjs      # Astro configuration
├── tailwind.config.mjs   # Tailwind configuration
└── package.json
```

### Blog Content

Blog posts are written in Markdown and stored in `src/content/blog/`. Each post requires frontmatter with the following schema:

```yaml
---
title: 'Post Title'
description: 'Brief description of the post'
pubDate: 2025-01-15
updatedDate: 2025-01-16 # optional
heroImage: '/blog/image.jpg' # optional
tags: ['tag1', 'tag2'] # optional
---
```

## Deployment

### Frontend (GitHub Actions)

The site automatically deploys to AWS S3/CloudFront when changes are pushed to `main`:

1. CI job runs formatting checks, linting, type checking, and builds the site
2. Deploy job syncs the built files to S3
3. CloudFront cache is invalidated to serve updated content

#### Required GitHub Secrets

Configure these secrets in your GitHub repository settings:

| Secret                           | Description                          |
| -------------------------------- | ------------------------------------ |
| `AWS_ROLE_ARN`                   | IAM role ARN for OIDC authentication |
| `AWS_S3_BUCKET`                  | S3 bucket name for static files      |
| `AWS_CLOUDFRONT_DISTRIBUTION_ID` | CloudFront distribution ID           |

### Contact Form Lambda (AWS SAM)

The contact form backend is deployed separately using AWS SAM:

```bash
cd infrastructure

# Build the Lambda function
sam build

# Deploy to AWS (first time - guided)
sam deploy --guided

# Deploy updates
sam deploy
```

The Lambda function uses AWS SES to send emails. Ensure your sender email is verified in SES.

## Environment Variables

### Lambda Function

These are configured in `infrastructure/template.yaml`:

| Variable          | Description                               | Default                 |
| ----------------- | ----------------------------------------- | ----------------------- |
| `RECIPIENT_EMAIL` | Email address to receive form submissions | davetashner@gmail.com   |
| `SENDER_EMAIL`    | Verified SES email address for sending    | hello@davetashner.com   |
| `ALLOWED_ORIGIN`  | CORS allowed origin                       | https://davetashner.com |

### Frontend

The contact form endpoint URL needs to be configured in the contact page component after deploying the Lambda.

## CI/CD Pipeline

### Pull Request Checks (ci.yml)

- Formatting check (Prettier)
- Linting (ESLint)
- Type checking (Astro check)
- Build verification

### Production Deploy (deploy.yml)

Runs on push to `main`:

- All CI checks
- Build production site
- Sync to S3 bucket
- Invalidate CloudFront cache

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Ensure all checks pass: `npm run format && npm run lint && npm run build`
4. Submit a pull request

### Pre-commit Hooks

This project uses Husky and lint-staged to run formatting and linting on staged files before each commit. These hooks run automatically after `npm install`.

## License

All rights reserved.
