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
    width: 1000,
    height: 1000,
    position: "relative",
  },
  playerAvatar: {
    position: "absolute",
    transformOrigin: "500px 500px",
  },
  activeAvatar: {
    width: 200,
    height: 200,
    borderRadius: "50%",
    position: "relative",
    zIndex: 1,
    "&::before": {
      content: '""',
      position: "absolute",
      top: "-10px",
      left: "-10px",
      right: "-10px",
      bottom: "-10px",
      borderRadius: "50%",
      background:
        "conic-gradient(red, orange, yellow, green, blue, indigo, violet, red)", // Радужный градиент
      animation: "$rainbowGlow 3s linear infinite",
      filter: "blur(25px)", // Размытие для эффекта тени
      zIndex: -1,
    },
  },
  nonActiveAvatar: {
    width: 200,
    height: 200,
  },
  timer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: "300px",
    color: "#000",
    fontWeight: "bold",
    animation: "$pulse 1s ease-in-out infinite", // Анимация пульсации для таймера
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
  "@keyframes rainbowGlow": {
    "0%": {
      transform: "rotate(0deg)", // Начальное вращение
    },
    "100%": {
      transform: "rotate(360deg)", // Полный оборот
    },
  },
});

export function GameField() {
  const [activePlayer, setActivePlayer] = useState(0);
  const [previousPlayer, setPreviousPlayer] = useState(0);
  const [kissCount, setKissCount] = useState(0);
  const [timer, setTimer] = useState(3);
  const [isWindowActive, setIsWindowActive] = useState(true);
  const [angle, setAngle] = useState(0);
  const [correctionAngle, setCorrectionAngle] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null); // Используем ref для аудио
  const spinTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const delayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const classes = useStyles();

  useEffect(() => {
    // Отслеживаем видимость окна
    const handleVisibilityChange = () => {
      setIsWindowActive(!document.hidden);
      if (document.hidden) {
        // Остановить вращение при потере фокуса
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
        if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
        if (delayTimeoutRef.current) clearTimeout(delayTimeoutRef.current);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useEffect(() => {
    if (timer > 0 && isWindowActive) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    } else if (timer === 0 && isWindowActive) {
      startBottleSpin();
      debugger
    }
    debugger
  }, [timer, isWindowActive]);

  const startBottleSpin = () => {
    const spinDuration = 4000; // Время вращения бутылки
    const totalRotation = 6 * 360;

    let randomAngle = Math.floor(Math.random() * 360);
    let newActivePlayer = getPlayerByAngle(randomAngle);

    // Проверяем, что новый игрок не совпадает с предыдущим активным
    while (newActivePlayer === previousPlayer) {
      randomAngle = Math.floor(Math.random() * 360);
      newActivePlayer = getPlayerByAngle(randomAngle);
    }

    setCorrectionAngle(360 - randomAngle);

    // Воспроизведение звука
    if (audioRef.current) {
      audioRef.current.loop = true; // Включаем зацикливание звука
      audioRef.current.play();
    }

    // Устанавливаем вращение
    setTimeout(() => {
      // Останавливаем звук после завершения вращения
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0; // Сброс к началу звука
        audioRef.current.loop = false; // Отключаем зацикливание звука
      }

      // Задержка перед сменой активного игрока
      setTimeout(() => {
        setPreviousPlayer(newActivePlayer); // Обновляем предыдущего игрока
        setActivePlayer(newActivePlayer); // Устанавливаем нового активного игрока
        setKissCount((prev) => prev + 1); // Увеличиваем счетчик поцелуев
        setTimer(3); // Сбрасываем таймер на 3
      }, 1000); // Задержка в 1 секунду
    }, spinDuration);

    // Для каждого вращения начинаем с текущего угла и добавляем полные обороты
    setAngle(
      (prevAngle) => prevAngle + totalRotation + randomAngle + correctionAngle
    );
  };

  const getPlayerByAngle = (angle: number) => {
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
            <div
              key={player.id}
              className={classes.playerAvatar}
              style={{ transform: `rotate(${angle}deg) translate(150px)` }}
            >
              <div
                className={
                  index === activePlayer
                    ? classes.activeAvatar
                    : classes.nonActiveAvatar
                }
                style={{ transform: `rotate(-${angle}deg)` }}
              >
                <PlayerAvatar player={player} />
              </div>
            </div>
          );
        })}
      </div>
      <Bottle angle={angle} />
      <KissCounter count={kissCount} />
      {timer ? <div className={classes.timer}>{timer}</div> : null}

      {/* Элемент аудио */}
      <audio ref={audioRef} src={bottleSound} preload="auto" />
    </div>
  );
}
