import React from 'react';
import { Timer } from './components/Timer';
import './App.css';

function App() {
  const handleTimerComplete = () => {
    console.log('Timer completed!');
  };

  return (
    <div className="app">
      <Timer 
        initialMinutes={0}
        initialSeconds={0}
        onComplete={handleTimerComplete}
      />
    </div>
  );
}

export default App;
