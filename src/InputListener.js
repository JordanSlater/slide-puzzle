import React, { useEffect } from 'react';

const handleControlInput = (event, onDirectionPressed) => {
  if (event.key === 'ArrowRight') {
    onDirectionPressed(0);
  }
  else if (event.key === 'ArrowUp') {
    onDirectionPressed(1);
  }
  else if (event.key === 'ArrowLeft') {
    onDirectionPressed(2);
  }
  else if (event.key === 'ArrowDown') {
    onDirectionPressed(3);
  }
};

export default function InputListener({onDirectionPressed, dependencies}) {
  useEffect(() => {
    const handleControlInputWithArgs = (event) => handleControlInput(event, onDirectionPressed);
    window.addEventListener('keydown', handleControlInputWithArgs);
    return () => {
      window.removeEventListener('keydown', handleControlInputWithArgs);
    };
  }, dependencies);

  return (<></>);
}
