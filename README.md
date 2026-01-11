# Your Lost Time - React Frontend

A modern React application for tracking wasted time, built with Vite and featuring a beautiful, responsive UI.

## 📋 Overview

This is the frontend component of the **Your Lost Time** project—a minimalist web application that helps users track and visualize the time they've lost or wasted. The React frontend communicates with a Flask backend API to persist user data and manage authentication.

## 🎯 Features

- **User Authentication**: Simple registration and persistent 7-day sessions via cookies
- **Time Tracking Dashboard**: 
  - Submit time lost entries in minutes
  - View accumulated lost time in hours and minutes
  - Real-time counter display
- **Responsive Design**: 
  - Desktop and mobile layouts (separate CSS and HTML files)
  - Random background images for visual variety
  - Smooth animations and transitions
- **User Feedback**: Flash message system with progress bar notifications
- **Modern Tech Stack**:
  - React 19 with hooks
  - Vite build tool for fast development
  - ESLint for code quality
  - dotenv for environment configuration

## 🏗️ Project Structure

```
react/
├── public/              # Static assets (images, fonts)
├── src/
│   ├── components/      # React components
│   │   ├── Flashes.jsx         # Flash message notifications
│   │   ├── LandH1.jsx          # Landing page header
│   │   ├── LossesBook.jsx      # Time entries log
│   │   ├── LostTimeForm.jsx    # Form to submit time lost
│   │   ├── PopupRegister.jsx   # Registration modal
│   │   └── TimeLostCounter.jsx # Time counter display
│   ├── App.jsx                 # Main app component
│   ├── BackendURLContext.js    # Backend URL context provider
│   ├── UserContext.js          # User data context
│   ├── cookies.js              # Cookie management utilities
│   ├── fetchData.js            # API client utilities
│   ├── main.jsx                # React entry point
│   └── index.css               # Global styles
├── eslint.config.js     # ESLint configuration
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
└── vite.config.js       # Vite configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running (see [../back](../back) directory)

### Installation

1. Navigate to the react directory:
```bash
cd react
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `react/` directory with the backend URL:
```
VITE_BACKEND_URL=http://localhost:5000
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

### Building for Production

Build the application:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## 🔍 Code Quality

Lint the code:
```bash
npm run lint
```

ESLint is configured to check for React best practices and code style issues.

## 🌐 API Integration

The frontend communicates with the Flask backend at the URL specified in the `.env` file. Key endpoints used:

- `POST /get/user_data` - Fetch user's time tracking data
- `POST /add/lost_time` - Submit new time lost entry
- `POST /auth/register` - Register or login the user (will create if no such username is in the database)

## 🎨 Components

- **App.jsx**: Main component managing app state and routing
- **TimeLostCounter**: Displays total accumulated lost time
- **LostTimeForm**: Form input for submitting new time entries
- **LossesBook**: Table/list view of all time entries
- **Flashes**: Toast notification system for user feedback
- **PopupRegister**: Modal for user registration
- **LandH1**: Landing page header component

## 📱 Responsive Design

The website can absolutely be used with desktop and mobile. It's up to you.

## 🔧 Technologies Used

- **React 19** - UI library
- **Vite 7** - Build tool and dev server
- **ESLint** - Code linting
- **dotenv** - Environment variable management

## 📝 License

See the main project LICENSE file.

## 🤝 Contributing

For issues or improvements, please refer to the main project documentation. (to be honest i don't know what did the ai mean by main project documentation. Yes, the ai wrote readme)
