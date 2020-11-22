import React, { useEffect, useRef, useState } from 'react';
import { dpr, GameBase } from '../canvas/gameBase';
import { createGameBase } from '../util/create';

export default function Game(props: { className?: string }): JSX.Element {
  const gameCanvas = useRef<HTMLCanvasElement>();
  const [gameBase, setGameBase] = useState<GameBase>();
  const [gaming, setGaming] = useState<boolean>(false);
  useEffect(() => {
    setGameBase(createGameBase(gameCanvas.current, 80, 20));
  }, []);
  useEffect(() => {
    gameBase?.draw();
  }, [gameBase]);
  return (
    <>
      <div className="sidebar">
        <button
          onClick={() => {
            gaming ? gameBase.gamePauses() : gameBase.gameStart();
            setGaming((value) => !value);
          }}
        >
          {gaming ? '暂停' : '开始'}
        </button>
      </div>
      <canvas
        style={{
          width: 750 / dpr,
          height: 750 / dpr,
        }}
        ref={gameCanvas}
        className={props.className}
      />
      <div className="sidebar" />
    </>
  );
}
