# Interview Preparation Platform

This project is an interview preparation platform designed to help users prepare for various technical interviews. It features a categorized question bank, user authentication, and analytics to track performance.

## Project Structure

The project is divided into two main parts: the client and the server.

### Client

The client is built using React and Vite. It includes:

- **Components**: Reusable UI components such as Navbar, Footer, and Loader.
- **Pages**: Different pages for Home, Dashboard, Quiz, Practice, and Leaderboard.
- **Context**: Context providers for managing authentication and quiz state.
- **Hooks**: Custom hooks for managing authentication, quiz logic, and timers.
- **Services**: API services for handling requests to the server.
- **Utils**: Utility functions for validation and other helper tasks.

### Server

The server is built using Express and MongoDB. It includes:

- **Controllers**: Handles requests related to authentication, quizzes, users, and analytics.
- **Middleware**: Custom middleware for authentication, error handling, and rate limiting.
- **Models**: MongoDB models for User, Question, QuizAttempt, and Performance.
- **Routes**: Defines routes for authentication, quizzes, users, and analytics.
- **Services**: Functions for managing questions, analytics, and sending emails.
- **Utils**: Utility functions for logging, validation, and seeding the database.

## Features

- **User Authentication**: Secure login and registration for users.
- **Categorized Questions**: A wide range of interview questions categorized by topics.
- **Performance Analytics**: Users can track their performance over time.
- **Custom Quiz Creation**: Users can create and share their own quizzes.
- **Notifications**: Alerts for new questions and updates.
- **Dark Mode**: Toggle for dark mode for better user experience.
- **Mobile Responsiveness**: Fully responsive design for mobile devices.
- **Gamification**: Badges and rewards for completing quizzes.

## Advanced Features

1. **User Profiles**: Manage user information and preferences.
2. **Question Tagging**: Enhance searchability with tags.
3. **Real-time Collaboration**: Collaborate on quizzes in real-time.
4. **Analytics Dashboard**: Detailed performance analytics.
5. **API Integration**: Integrate third-party resources for additional learning materials.

## Getting Started

To get started with the project, clone the repository and install the dependencies for both the client and server:

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the client directory
cd client
npm install

# Navigate to the server directory
cd ../server
npm install
```

### Running the Application

To run the application, start the server and client:

```bash
# Start the server
cd server
node server.js

# Start the client
cd ../client
npm run dev
```

## License

This project is licensed under the MIT License.