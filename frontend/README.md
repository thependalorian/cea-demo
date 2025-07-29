# Climate Economy Assistant Frontend

This is the frontend for the Climate Economy Assistant (CEA) platform, built with Next.js and styled with Tailwind CSS and DaisyUI.

## Features

- **Modern UI**: Clean, responsive design following ACT brand guidelines
- **Dashboard Views**: Job seeker, partner/employer, and admin perspectives
- **Chat Interface**: AI-powered career guidance with OpenAI integration
- **Resume Analysis**: Upload and analyze resumes for clean energy job matches

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (for containerized deployment)

### Development Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Copy the example environment file and update with your values:
   ```bash
   cp .env.example .env.local
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

### Docker Deployment

#### Option 1: Using the helper script

We provide a helper script to build and run the frontend Docker container:

```bash
# From the project root
./build-frontend.sh
```

#### Option 2: Using Docker Compose

To run the entire stack (frontend, agent API, and RAG pipeline):

```bash
# Build all services
docker-compose build

# Run all services
docker-compose up -d

# View logs
docker-compose logs -f
```

#### Option 3: Using npm scripts

We've added convenience scripts in package.json:

```bash
# Build only the frontend Docker image
npm run docker:build

# Build and run the frontend container
npm run docker:run

# Build all services with Docker Compose
npm run docker:build-all

# Run all services with Docker Compose
npm run docker:up
```

## Dashboard Access

After starting the application, you can access the different dashboard views:

- **Job Seeker Dashboard**: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
- **Partner/Employer Dashboard**: [http://localhost:3000/partner/dashboard](http://localhost:3000/partner/dashboard)
- **Admin Dashboard**: [http://localhost:3000/admin](http://localhost:3000/admin)

## UI Components

The UI is built with a combination of custom components and DaisyUI, following the ACT brand guidelines:

- **Color Palette**:
  - Spring Green (`#B2DE26`) - Primary accent color
  - Midnight Forest (`#001818`) - Dark elements
  - Moss Green (`#394816`) - Secondary accent
  - Seafoam Blue (`#E0FFFF`) - Light accent
  - Sand Gray (`#EBE9E1`) - Background

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | - |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | - |
| `NEXT_PUBLIC_AGENT_ENDPOINT` | Agent API endpoint | http://localhost:8001/api/pendo-agent |
| `NEXT_PUBLIC_RAG_PIPELINE_ENDPOINT` | RAG Pipeline endpoint | http://localhost:8000 |
| `NEXT_PUBLIC_ENABLE_STREAMING` | Enable streaming responses | true |

## License

Proprietary - Alliance for Climate Transition 