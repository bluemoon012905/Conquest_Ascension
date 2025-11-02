
import React, { useState } from 'react';
import MainMenu from './views/MainMenu';
import LevelSelection from './views/LevelSelection';
import GameView from './views/GameView';

function App() {
  const [currentView, setCurrentView] = useState('MAIN_MENU');

  const renderView = () => {
    switch (currentView) {
      case 'LEVEL_SELECTION':
        return <LevelSelection setView={setCurrentView} />;
      case 'GAME_VIEW':
        return <GameView setView={setCurrentView} />;
      case 'MAIN_MENU':
      default:
        return <MainMenu setView={setCurrentView} />;
    }
  };

  return (
    <div>
      {renderView()}
    </div>
  );
}

export default App;
