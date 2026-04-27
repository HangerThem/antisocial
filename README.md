# AntiSocial

A simple, self-hosted, expiring social media feed built with Next.js and Prisma.

## Features

- Create posts that expire after a certain time (default: 7 days)
- Option to preserve posts from expiration
- Simple and clean user interface
- Self-hosted with SQLite database

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/HangerThem/antisocial.git
   ```
2. Navigate to the project directory:
   ```bash
   cd antisocial
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env.local` file in the root of the project and add the following environment variables:
   ```env
   DATABASE_FILE=file:./data/antisocial.db
   ```
5. Run the development server:
   ```bash
   npm run dev
   ```
6. Open your browser and navigate to `http://localhost:3000` to see the app in action.

## License

This project is licensed under the MIT License.
