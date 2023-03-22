import { useEffect } from 'react';

import { useTelegram } from './hooks/useTelegram';

import './App.css';
import Button from './components/Button/Button';
import Header from './components/Header/Header';

function App() {
  const { tg, onToggleButton } = useTelegram();

  useEffect(() => {
    tg.ready();
  }, [tg]);

  return (
    <div className="App">
      <Header />
      <Button onClick={onToggleButton}>toggle</Button>
    </div>
  );
}

export default App;
