import React from 'react';
import Board from './components/buttons/Board';

const App: React.FC = () => {
  return (
    <div>
      <h1>TicTacToe</h1>
      <Board />
    </div>
  );
};

export default App;