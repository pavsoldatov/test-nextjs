# Next.js Project with Matterport SDK

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) that integrates with the Matterport SDK.

## Getting Started

### Prerequisites

- Node.js (recommended version: 18.x or higher)
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/your-project-name.git
cd your-project-name
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```
PUBLIC_MATTERPORT_SDK_KEY=1234567sdk_key
PUBLIC_MATTERPORT_MODEL_ID=model_id
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Notes:

- `PUBLIC_MATTERPORT_SDK_KEY`: Use the same SDK key provided for the test assignment
- `PUBLIC_MATTERPORT_MODEL_ID`: The model ID (e.g., from the space URL: `?m=m72PGKzeknR`)
- `NEXT_PUBLIC_API_URL`: URL where the server will run

### Running the Development Server

Start the development server which runs both the Express backend and the Next.js frontend:

```bash
npm run dev:all
# or
yarn dev:all
# or
pnpm dev:all
# or
bun dev:all
```

Once running, open [http://localhost:5002](http://localhost:5002) in your browser to see the application.

## Project Structure

- `/src`: Next.js frontend code
- `/server`: Express backend code
- `/api`: JSON data file used by the application (menu items)

## Available Scripts

- `dev:all`: Runs both the client and server in development mode
- `dev:client`: Runs only the client in development mode
- `dev:server`: Runs only the server in development mode
