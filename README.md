# AI Story Development App Documentation

## Project Structure

```
story-development-app/
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── manifest.json
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   └── Header.tsx
│   │   │   ├── navigation/
│   │   │   │   └── MainNav.tsx
│   │   │   ├── scene/
│   │   │   │   ├── SceneList.tsx
│   │   │   │   ├── SceneContent.tsx
│   │   │   │   └── SceneFilters.tsx
│   │   │   └── shared/
│   │   ├── types/
│   │   │   ├── index.ts
│   │   │   └── navigation.ts
│   │   ├── App.tsx
│   │   ├── index.tsx
│   │   └── index.css
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── postcss.config.js
├── backend/
│   ├── main.py
│   └── requirements.txt
├── stories/
│   ├── master/
│   │   ├── characters/ # Initial characters at the start
│   │   ├── locations/ # Initial locations at the start
│   │   ├── discoveries/ # Initial discoveries at the start
│   │   ├── memories/ # Initial memories at the start
│   │   └── templates/ # Master templates
│   └── scenes/ # One alphanumeric sorted folder per scene
│       ├── scene_1_short_title/
│       │   ├── scene_directions.md # Scene directions
│       │   ├── input/
│       │   │   ├── characters/ # Initial characters at the start
│       │   │   ├── locations/ # Initial locations at the start
│       │   │   ├── discoveries/ # Initial discoveries at the start
│       │   │   ├── memories/ # Initial memories at the start
│       │   └── output/
│       │       ├── characters/ # Initial characters at the start
│       │       ├── locations/ # Initial locations at the start
│       │       ├── discoveries/ # Initial discoveries at the start
│       │       └── memories/ # Initial memories at the start
│       └── scene_2_new_title/
│       │   ├── scene_directions.md # Scene directions
│           ├── input/
│           │   ├── characters/ # Initial characters at the start
│           │   ├── locations/ # Initial locations at the start
│           │   ├── discoveries/ # Initial discoveries at the start
│           │   ├── memories/ # Initial memories at the start
│           └──  output/
│               ├── characters/ # Initial characters at the start
│               ├── locations/ # Initial locations at the start
│               ├── discoveries/ # Initial discoveries at the start
│               └── memories/ # Initial memories at the start
├── config/
│   ├── ai_models.yaml
│   └── writing_styles.yaml
├── docker/
│   ├── frontend/
│   │   └── Dockerfile
│   └── backend/
│       └── Dockerfile
├── docker-compose.yml
└── .env
```

## File names

### Master templates
- character_template.yaml # Basic character template
- location_template.yaml # Basic location template
- discovery_template.yaml # Basic discovery template
- memory_template.yaml # Basic memory template
- scene_template.yaml # Basic scene template
- scene_directions.md # Basic scene directions (steps to take in scene)

### Scene templates
- scene_builder.yaml # Who what when in the scene
- scene_directions1.md # Basic scene directions (steps to take in scene, can be multiple files)
- Add other files as needed - characters, discoveries, locations, memories



## Development Setup

1. **Prerequisites**
   - Docker
   - Docker Compose
   - Git

2. **Environment Variables**
   ```env
   POSTGRES_DB=storydev
   POSTGRES_USER=storydev
   POSTGRES_PASSWORD=devpassword
   DATABASE_URL=postgresql://storydev:devpassword@db:5432/storydev
   ```

3. **Install & Run**
   ```bash
   # Clone repository
   git clone [repository-url]
   cd story-development-app

   # Start services
   docker-compose up -d
   ```

   Access the application:
   - Frontend: http://localhost:4444
   - Backend: http://localhost:9999

## Key Components

### Frontend

1. **Navigation**
   - MainNav: Top-level navigation for all sections
   - SceneFilters: Right sidebar filters in scene view

2. **Scene Management**
   - SceneList: List of available scenes
   - SceneContent: Scene editor with input/analysis/output tabs
   - SceneFilters: Context-specific filters

3. **Types**
   ```typescript
   // types/navigation.ts
   export type NavSection = 'brainstorm' | 'scenes' | 'characters' | 
                          'locations' | 'discoveries' | 'memories';

   // types/index.ts
   export interface Scene {
     id: string;
     title: string;
     sequence: string;
     description?: string;
     directions?: string;
   }

   export interface Story {
     id: string;
     title: string;
   }
   ```

### Backend

1. **FastAPI Server**
   - Health check endpoints
   - CORS configuration
   - PostgreSQL integration

2. **Database Models**
   - Stories
   - Scenes
   - Characters
   - Locations
   - Discoveries
   - Memories

## Docker Configuration

1. **Frontend Container**
   - Node.js 18
   - React development server
   - Port 4444

2. **Backend Container**
   - Python 3.11
   - FastAPI
   - Port 9999

3. **Database Container**
   - PostgreSQL 14
   - Port 5432

## Development Workflow

1. **Story Creation**
   - Define characters, locations, discoveries
   - Create scenes
   - Set relationships between elements

2. **Scene Development**
   - Input: Scene details and directions
   - Analysis: AI processing
   - Output: Generated content

3. **Navigation**
   - Top-level sections when no scene selected
   - Scene-specific filters when viewing/editing scenes

## File Organization

1. **Story Content**
   - Master templates in stories/master/
   - Scene-specific content in stories/scenes/
   - Each scene has input/ and output/ directories

2. **Component Structure**
   - Logical grouping by feature
   - Shared components in components/shared/
   - Type definitions in types/

## Adding New Features

1. **New Component**
   ```typescript
   // src/components/new-feature/NewComponent.tsx
   import React from 'react';
   import type { ComponentProps } from '../../types';

   export const NewComponent: React.FC<ComponentProps> = (props) => {
     // Implementation
   };

   export default NewComponent;
   ```

2. **New Type**
   ```typescript
   // src/types/index.ts
   export interface NewType {
     id: string;
     // Additional properties
   }
   ```

## Working with Docker

1. **Building**
   ```bash
   docker-compose build
   ```

2. **Development**
   ```bash
   docker-compose up -d
   docker-compose logs -f
   ```

3. **Cleanup**
   ```bash
   docker-compose down
   docker-compose down -v  # Include volumes
   ```

## Common Commands

```bash
# Frontend Development
docker-compose exec frontend npm install [package]
docker-compose exec frontend npm run lint

# Backend Development
docker-compose exec backend pip install [package]
docker-compose exec backend pytest

# Database
docker-compose exec db psql -U storydev -d storydev
```

## Troubleshooting

1. **Frontend Issues**
   - Check port conflicts (4444)
   - Verify node_modules mounting
   - Check TypeScript errors

2. **Backend Issues**
   - Verify FastAPI running
   - Check database connection
   - Verify CORS settings

3. **Database Issues**
   - Check credentials
   - Verify port availability
   - Check volume mounting