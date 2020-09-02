import React, { useRef } from 'react';

export default function Game(props: { className?: string }): JSX.Element {
  const gameCanvas = useRef<HTMLCanvasElement>();
  return <canvas ref={gameCanvas} className={props.className} />;
}
