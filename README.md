# HK-Joint-School - iGEM 2025

Biosensor analysis app by CPU student to quantify pesticide concentration by analyzing the brightness of a sample image of our biosensor. Users can calibrate standard curves, analyze samples, and view historical data ^^ ~

## Tech Stack

*   **Frontend**: [React](https://reactjs.org/), [Vite](https://vitejs.dev/), [TypeScript](https://www.typescriptlang.org/)
*   **State Management**: [Zustand](https://github.com/pmndrs/zustand)
*   **Charting**: [Recharts](https://recharts.org/)

## Ready to start? 

! Follow these instructions to set up and run the project locally !

### Prerequisites (IMPORTANT)

Make sure you have [Node.js](https://nodejs.org/en/) installed!!!

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/e-muzi/biosensor-apptesting.git
    cd biosensor-apptesting
    ```

2.  **Install dependencies:**
    This command will install all the necessary packages defined in `package.json`~ 
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  Open your browser and navigate to `http://localhost:5173` (the port may be different, check your terminal output!!!)

## How to Use?

1.  **Calibrate (Optional)**: The standard curve of pesticides are currently hard coded in "pesticideStore.ts".
2.  **Capture/Upload**: Navigate to the 'Capture' to either take a photo with your device's camera or upload an existing image file.
3.  **Analyze**: After uploading, you will be prompted to select a Region of Interest (ROI) on the image.
4.  **View Results**: The app will display the calculated brightness and the corresponding pesticide concentration. This result is automatically saved to your history.
5.  **Check History**: Go to 'History' to see a list of all your past analyses. You may clear all history data in 'Settings' function also.

UPDATE: Users can now access our app directly! https://e-muzi.netlify.app/