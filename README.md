# CakeDay 🎂

A mobile-first birthday tracker for close friends and family, built with React and Tailwind CSS.

## Features

- **Dashboard**: Scrollable list of birthdays sorted by days remaining.
- **Smart Countdowns**: "Days left" calculation and "It's Today!" confetti animations.
- **Categorization**: Visual tags for Family, Friends, and Work.
- **AI Gift Ideas**: Uses Google Gemini API to generate personalized gift suggestions.
- **Local Storage**: Data persists in your browser's local storage.

## Setup & Configuration

This project uses the Google Gemini API for generating gift suggestions.

1.  **Get an API Key**:
    - Visit [Google AI Studio](https://aistudio.google.com/) to get your API key.

2.  **Configure Environment**:
    - Open the `.env.local` file in the root directory.
    - Replace `YOUR_GEMINI_API_KEY_HERE` with your actual API key.

    ```env
    API_KEY=AIzaSy...
    ```

## Development

This app is built with React and Tailwind CSS. It uses `esm.sh` for dependencies to allow for a no-build-step development environment in compatible runners, or can be bundled using standard tools like Vite.
