# Webster Pack Tracker

A pharmacy application for tracking and managing Webster packs, medications, and customers.

## Features

- Dashboard with status summaries and recent Webster packs
- Customer management and search
- Webster pack tracking with detailed views
- Medication lists organized by time of day
- Checklist tracking for Webster pack preparation
- Barcode scanning for medication verification

## Tech Stack

- React with Vite
- Tailwind CSS for styling
- Supabase for backend and database
- React Router for navigation
- Lucide React for icons

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/webster-pack-tracker.git
   cd webster-pack-tracker
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

## Deployment

This project can be easily deployed to Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Set the environment variables in the Vercel dashboard
4. Deploy!

## License

MIT 