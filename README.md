# AI Engineering Course Website

A production-ready, modern website that teaches software engineers how to become AI engineers from 0 to 100.

## Features

- **8 Comprehensive Modules**: From fundamentals to production best practices
- **40+ Detailed Lessons**: Each with overview, code examples, common mistakes, and exercises
- **Learning Path**: Visual roadmap showing course progression
- **Progress Tracking**: Track your progress through lessons (localStorage-based)
- **Search**: Search across all lessons and modules
- **Toolbox**: Reference guide for AI engineering tools and patterns
- **Career Page**: Guidance on building your AI engineering career
- **Dark Mode**: Full dark mode support
- **Responsive Design**: Works on all devices

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Content**: MDX for lesson content
- **Search**: MiniSearch (client-side)
- **Progress**: localStorage
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd swe_2_ai_swe
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
swe_2_ai_swe/
├── app/                    # Next.js app directory
│   ├── learning-path/     # Course pages
│   ├── toolbox/           # Toolbox pages
│   ├── career/            # Career page
│   ├── search/            # Search page
│   └── progress/          # Progress dashboard
├── components/            # React components
│   ├── ui/               # UI components (shadcn/ui)
│   ├── layout/           # Layout components
│   ├── course/           # Course-specific components
│   └── common/           # Shared components
├── content/              # Course content (MDX files)
│   ├── modules/         # Module content
│   └── toolbox/         # Toolbox content
├── lib/                  # Utility functions
│   ├── content/         # Content loaders
│   └── progress/        # Progress tracking
├── types/               # TypeScript types
└── hooks/               # React hooks
```

## Adding New Lessons

To add a new lesson:

1. Create a lesson directory in the appropriate module/chapter:
```bash
content/modules/module-X-slug/chapters/chapter-Y-slug/lessons/lesson-Z-slug/
```

2. Create `content.mdx` file with frontmatter:
```mdx
---
id: "lesson-id"
slug: "lesson-slug"
title: "Lesson Title"
description: "Lesson description"
order: 1
chapterId: "chapter-id"
moduleId: "module-id"
prerequisites: []
estimatedMinutes: 30
tags: ["tag1", "tag2"]
difficulty: "beginner"
---

# Lesson Content

Your lesson content here...
```

3. The lesson will automatically appear in the learning path!

## Building for Production

```bash
npm run build
```

This will:
- Build the Next.js application
- Generate static pages for all lessons
- Create the search index

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Vercel will automatically detect Next.js and deploy

Or use the Vercel CLI:
```bash
npm i -g vercel
vercel
```

### Environment Variables

No environment variables are required for basic functionality. All content is stored in the repository.

## Content Structure

### Modules

Each module has:
- `meta.json`: Module metadata (title, description, order, prerequisites)
- `chapters/`: Chapter directories
- Each chapter has `meta.json` and `lessons/` directory

### Lessons

Each lesson is an MDX file with:
- Frontmatter with metadata
- Markdown content with code examples
- Sections for: Overview, Main Content, Code Examples, Common Mistakes, Exercise, Tools & Resources

## Development

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm start`: Start production server
- `npm run lint`: Run ESLint

### Code Style

- TypeScript for type safety
- ESLint for linting
- Prettier for formatting (configured)

## Features in Detail

### Progress Tracking

Progress is stored in browser localStorage. Each lesson has a checkbox to mark as complete. Progress is aggregated at the module and course level.

### Search

Search functionality indexes all lessons and modules. Search is performed client-side using MiniSearch.

### Dark Mode

Full dark mode support using `next-themes`. Toggle available in the header.

## Contributing

This is a course website. To contribute:
1. Add new lessons following the existing structure
2. Improve existing content
3. Fix bugs or improve UI/UX
4. Add new features

## License

[Add your license here]

## Support

For issues or questions, please open an issue on GitHub.

