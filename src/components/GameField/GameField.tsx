import player1Image from "../../assets/Regular face 1.png";
import player2Image from "../../assets/Regular face 2.png";
import player3Image from "../../assets/Regular face 3.png";
import player4Image from "../../assets/Regular face 4.png";
import player5Image from "../../assets/Regular face 5.png";
import player6Image from "../../assets/Regular face 6.png";
import player7Image from "../../assets/Regular face 7.png";
import player8Image from "../../assets/Regular face 8.png";
import player9Image from "../../assets/Regular face 9.png";
import player10Image from "../../assets/Regular face 10.png";
import backgroundImage from "../../assets/background.jpg";
import bottleSound from "../../assets/Spinning sound.mp3";
import kissSound from "../../assets/Kiss sound.mp3";
import kissImage from "../../assets/Kiss.png";
import { useState, useEffect, useRef } from "react";
import { IPlayer, PlayerAvatar } from "../PlayerAvatar/PlayerAvatar";
import { createUseStyles } from "react-jss";
import { Bottle } from "../Bottle/Bottle";
import { KissCounter } from "../KissCounter/KissCounter";

const players: IPlayer[] = [
  { id: 1, image: player1Image },
  { id: 2, image: player2Image },
  { id: 3, image: player3Image },
  { id: 4, image: player4Image },
  { id: 5, image: player5Image },
  { id: 6, image: player6Image },
  { id: 7, image: player7Image },
  { id: 8, image: player8Image },
  { id: 9, image: player9Image },
  { id: 10, image: player10Image },
];

const useStyles = createUseStyles({
  container: {
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
    overflow: "hidden",
  },
  playersCircle: {
    width: 750,
    height: 750,
    position: "relative",
    "@media (max-width: 768px)": {
      width: 500,
      height: 500,
    },
    "@media (max-width: 480px)": {
      width: 375,
      height: 375,
    },
  },
  timer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: "225px",
    color: "#000",
    fontWeight: "bold",
    animation: "$pulse 1s ease-in-out infinite",
    "@media (max-width: 768px)": {
      fontSize: "150px",
    },
    "@media (max-width: 480px)": {
      fontSize: "112.5px",
    },
  },
  kissImage: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    width: 300,
    height: 300,
    animation: "$kiss 3s ease-in-out 1",
    zIndex: 20,
    opacity: 0,
    "@media (max-width: 768px)": {
      width: 200,
      height: 200,
    },
    "@media (max-width: 480px)": {
      width: 150,
      height: 150,
    },
  },
  "@keyframes pulse": {
    "0%": {
      transform: "translate(-50%, -50%) scale(0.7)",
      opacity: 0,
    },
    "50%": {
      transform: "translate(-50%, -50%) scale(1.5)",
      opacity: 0.5,
    },
    "100%": {
      transform: "translate(-50%, -50%) scale(1)",
      opacity: 0.8,
    },
  },
  "@keyframes kiss": {
    "0%": {
      transform: "translate(-50%, -50%) scale(0.7)",
      opacity: 0,
    },
    "50%": {
      transform: "translate(-50%, -50%) scale(1.2)",
      opacity: 0.5,
    },
    "70%": {
      transform: "translate(-50%, -50%) scale(1.5)",
      opacity: 1,
    },
    "100%": {
      transform: "translate(-50%, -50%) scale(1)",
      opacity: 0,
    },
  },
});

export function GameField() {
  const [activePlayer, setActivePlayer] = useState<number>(0);
  const [newPlayer, setNewPlayer] = useState<number>(0);
  const [kissCount, setKissCount] = useState<number>(0);
  const [timer, setTimer] = useState<number>(3);
  const [angle, setAngle] = useState<number>(0);
  const [correctionAngle, setCorrectionAngle] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(true);
  const [isKissing, setIsKissing] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const kissAudioRef = useRef<HTMLAudioElement>(null);

  const classes = useStyles();

  // Обработчик паузы при изменении видимости страницы
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsPaused(true); // Включаем паузу
      } else {
        setIsPaused(false); // Снимаем паузу
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (timer > 0 && isTransitioning && !isPaused) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    } else if (timer === 0 && !isPaused) {
      startBottleSpin();
    }
  }, [timer, isPaused]);

  useEffect(() => {
    if (isKissing && kissAudioRef.current) {
      kissAudioRef.current.play();
    }
  }, [isKissing]);

  const startBottleSpin = (): void => {
    const spinDuration = 4000;
    const totalRotation = 6 * 360;

    let randomAngle = Math.floor(Math.random() * 360);
    let newActivePlayer = getPlayerByAngle(randomAngle);

    // Проверяем, что новый игрок не совпадает с предыдущим активным
    while (newActivePlayer === activePlayer) {
      randomAngle = Math.floor(Math.random() * 360);
      newActivePlayer = getPlayerByAngle(randomAngle);
    }

    setCorrectionAngle(360 - randomAngle);

    // Воспроизведение звука
    if (audioRef.current) {
      audioRef.current.loop = true;
      audioRef.current.play();
    }

    // Устанавливаем вращение
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.loop = false;
      }

      setIsTransitioning(false);
      setNewPlayer(newActivePlayer);

      setTimeout(() => {
        setIsKissing(true);
      }, 3000);
    }, spinDuration);

    setTimeout(() => {
      setActivePlayer(newActivePlayer);
      setIsTransitioning(true);
      setIsKissing(false);
      setKissCount((prev) => prev + 1);
    }, spinDuration + 6000);

    setTimeout(() => {
      setTimer(3);
    }, spinDuration + 8000);

    // Для каждого вращения начинаем с текущего угла и добавляем полные обороты
    setAngle(
      (prevAngle) => prevAngle + totalRotation + randomAngle + correctionAngle
    );
  };

  const getPlayerByAngle = (angle: number): number => {
    if (angle >= 306 && angle <= 341) {
      return 0; // Игрок 1
    } else if (angle >= 341 || angle <= 17) {
      return 1; // Игрок 2
    } else if (angle >= 18 && angle <= 53) {
      return 2; // Игрок 3
    } else if (angle >= 54 && angle <= 89) {
      return 3; // Игрок 4
    } else if (angle >= 90 && angle <= 125) {
      return 4; // Игрок 5
    } else if (angle >= 126 && angle <= 161) {
      return 5; // Игрок 6
    } else if (angle >= 162 && angle <= 197) {
      return 6; // Игрок 7
    } else if (angle >= 198 && angle <= 233) {
      return 7; // Игрок 8
    } else if (angle >= 234 && angle <= 269) {
      return 8; // Игрок 9
    } else {
      return 9; // Игрок 10
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.playersCircle}>
        {players.map((player, index) => {
          const angle = (index / players.length) * 360;
          return (
            <PlayerAvatar
              newPlayer={newPlayer}
              key={player.id}
              index={index}
              activePlayer={activePlayer}
              angle={angle}
              player={player}
              isTransitioning={isTransitioning}
            />
          );
        })}
      </div>
      <Bottle angle={angle} />
      <KissCounter count={kissCount} />
      {timer && isTransitioning && !isPaused ? (
        <div className={classes.timer}>{timer}</div>
      ) : null}
      {isKissing ? (
        <img className={classes.kissImage} src={kissImage} alt="" />
      ) : null}

      {/* Элемент аудио */}
      <audio ref={audioRef} src={bottleSound} preload="auto" />
      <audio ref={kissAudioRef} src={kissSound} preload="auto" />
    </div>
  );
}
