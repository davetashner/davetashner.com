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

### GitHub Secrets Configuration

The deployment workflow uses AWS OIDC (OpenID Connect) for secure, credential-free authentication. This eliminates the need to store long-lived AWS access keys as secrets.

#### Required Secrets

Configure these secrets in your GitHub repository settings (Settings > Secrets and variables > Actions):

| Secret                           | Description                                               |
| -------------------------------- | --------------------------------------------------------- |
| `AWS_ROLE_ARN`                   | IAM role ARN for OIDC authentication (see setup below)    |
| `AWS_S3_BUCKET`                  | S3 bucket name for static files (e.g., `davetashner.com`) |
| `AWS_CLOUDFRONT_DISTRIBUTION_ID` | CloudFront distribution ID for cache invalidation         |

#### Setting Up AWS OIDC Provider

To allow GitHub Actions to assume an IAM role without access keys, you need to configure an OIDC identity provider in AWS.

**Step 1: Create the OIDC Identity Provider**

1. Go to IAM > Identity providers > Add provider
2. Select "OpenID Connect"
3. For Provider URL, enter: `https://token.actions.githubusercontent.com`
4. Click "Get thumbprint"
5. For Audience, enter: `sts.amazonaws.com`
6. Click "Add provider"

**Step 2: Create an IAM Role for GitHub Actions**

1. Go to IAM > Roles > Create role
2. Select "Web identity" as the trusted entity type
3. Choose the GitHub OIDC provider you just created
4. For Audience, select `sts.amazonaws.com`
5. Click Next and attach the required policies (see below)
6. Name the role (e.g., `github-actions-davetashner-deploy`)

**Step 3: Configure the Trust Policy**

Edit the role's trust policy to restrict access to your specific repository:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::YOUR_ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:YOUR_GITHUB_USERNAME/davetashner.com:*"
        }
      }
    }
  ]
}
```

Replace `YOUR_ACCOUNT_ID` with your AWS account ID and `YOUR_GITHUB_USERNAME` with your GitHub username.

**Step 4: Attach Required Policies**

Create and attach a policy with the following permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "S3Deploy",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::YOUR_BUCKET_NAME",
        "arn:aws:s3:::YOUR_BUCKET_NAME/*"
      ]
    },
    {
      "Sid": "CloudFrontInvalidation",
      "Effect": "Allow",
      "Action": "cloudfront:CreateInvalidation",
      "Resource": "arn:aws:cloudfront::YOUR_ACCOUNT_ID:distribution/YOUR_DISTRIBUTION_ID"
    }
  ]
}
```

Replace the placeholder values with your actual S3 bucket name, AWS account ID, and CloudFront distribution ID.

**Step 5: Add the Role ARN to GitHub Secrets**

Copy the ARN of the role you created (e.g., `arn:aws:iam::123456789012:role/github-actions-davetashner-deploy`) and add it as the `AWS_ROLE_ARN` secret in your GitHub repository.

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
