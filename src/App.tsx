import { useEffect, useState } from 'react';
import './App.css';
import { BREAK_TIME_MS, INTERVAL_SAMPLE_TIME_MS, MORSE_CODES, PRESSED_BUTTON_TIME_MS } from './config';

type Mark = '.' | '-' | '_' | '';
type ClickState = 'stateUp' | 'stateDown' | '';

function App() {
  const [pattern, setPattern] = useState('');
  const [clickState, setClickState] = useState<ClickState>('');

  useEffect(() => {
    let mark: Mark = '';

    let mouseDownTimerId: NodeJS.Timer;
    let mouseDownTime = 0;

    if (clickState === 'stateDown') {
      mark = '.';
      let onlyOnce = true;

      mouseDownTimerId = setInterval(() => {
        mouseDownTime += INTERVAL_SAMPLE_TIME_MS;

        if (mouseDownTime >= PRESSED_BUTTON_TIME_MS && onlyOnce) {
          mark = '-';
          onlyOnce = false;

          clearInterval(mouseDownTimerId);
        }
      }, INTERVAL_SAMPLE_TIME_MS);
    }

    let mouseUpTimerId: NodeJS.Timer;
    let mouseUpTime = 0;

    if (clickState === 'stateUp') {
      let onlyOnce1 = true;

      mouseUpTimerId = setInterval(() => {
        mouseUpTime += INTERVAL_SAMPLE_TIME_MS;

        if (mouseUpTime >= BREAK_TIME_MS && onlyOnce1) {
          mark = '_';
          setPattern(prevPattern => prevPattern.concat(mark));

          onlyOnce1 = false;
          clearInterval(mouseUpTimerId);
        }
      }, INTERVAL_SAMPLE_TIME_MS);
    }

    return () => {
      clearInterval(mouseDownTimerId);
      clearInterval(mouseUpTimerId);

      if (clickState === 'stateDown') {
        setPattern(prevPattern => prevPattern.concat(mark));
      }
    }
  }, [clickState]);

  useEffect(() => {
    function keyDownHandler(e: KeyboardEvent) {
      if (e.code.toLowerCase() === 'space') {
        setClickState('stateDown');
      }
    }

    document.addEventListener('keydown', keyDownHandler);

    function keyUpHandler(e:KeyboardEvent) {
      if (e.code.toLowerCase() === 'space') {
        setClickState('stateUp');
      }
    }

    document.addEventListener('keyup', keyUpHandler);

    return () => {
      document.removeEventListener('keydown', keyDownHandler);
      document.removeEventListener('keyup', keyUpHandler);
    }
  }, []);

  const onMouseDownHandler = () => {
    setClickState('stateDown');
  };

  const onMouseUpHandler = () => {
    setClickState('stateUp');
  };

  const decoded = pattern.split('_').map(code => MORSE_CODES[code]);

  return (
    <div className='app'>
      <h1>Morse Alphabet</h1>
      <div className='info'>Click button or SPACE to generate Morse code</div>
      <button
        onMouseDown={onMouseDownHandler}
        onMouseUp={onMouseUpHandler}>
        Click
      </button>
      <div>Pattern: {pattern}</div>
      <div>Decoded: {decoded }</div>
    </div>
  );
}

export default App;
