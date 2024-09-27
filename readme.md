# GenFiit Mobile Application

Welcome to the GenFiit mobile application, a health and fitness app designed to provide users with tools to track their body mass index (BMI) and other fitness metrics. This project is built using React Native and TypeScript, leveraging Expo for development and debugging.

## Features

- **BMI Calculator**: Users can input their age, gender, weight, and height to calculate their BMI and see the corresponding category (underweight, normal, overweight, obese).
- **Navigation**: The app includes a bottom tab navigation for seamless user experience, with a logout button for user session management.
- **Responsive Design**: The UI is designed to be responsive, ensuring a smooth experience across devices.

## Technologies Used

- **Frontend**: React Native, TypeScript
- **Backend**: Strapi (to be implemented)
- **Styling**: Tailwind CSS (or custom styles)
- **State Management**: React hooks for managing state and effects
- **Routing**: React Navigation for handling navigation between screens

## Project Structure

- **src/**: Contains the main application code.
  - **components/**: Reusable components used throughout the app.
  - **screens/**: Contains individual screen components, including `BMICalculatorScreen` and `LogoutScreen`.
  - **assets/**: Static assets such as images and icons.

## Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd genfiit
   
2. **Install Dependencies**:
   npm install

3. **Run the App using Expo**:
   npx expo start
   
   