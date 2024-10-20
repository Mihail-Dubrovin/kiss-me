import { createUseStyles } from "react-jss";

export interface IPlayer {
  id: number;
  image: string;
}

interface PlayerAvatarProps {
  player: IPlayer;
  angle: number;
  index: number;
  activePlayer: number;
  newPlayer: number;
  isTransitioning: boolean;
}

const useStyles = createUseStyles({
  avatar: {
    width: 150,
    height: 150,
    borderRadius: "50%",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundImage: (props: IPlayer) => `url(${props.image})`,
    display: "inline-block",
    transition: "all 3s ease-in-out",
    "@media (max-width: 768px)": {
      width: 100,
      height: 100,
    },
    "@media (max-width: 480px)": {
      width: 75,
      height: 75,
    },
  },
  avatarKissing: {
    width: 300,
    height: 300,
    "@media (max-width: 768px)": {
      width: 200,
      height: 200,
    },
    "@media (max-width: 480px)": {
      width: 150,
      height: 150,
    },
  },
  playerAvatar: {
    position: "absolute",
    transformOrigin: "375px 375px",
    transition: "all 3s ease-in-out",
    "@media (max-width: 768px)": {
        transformOrigin: "250px 250px",
    },
    "@media (max-width: 480px)": {
        transformOrigin: "187.5px 187.5px",
    },
  },
  activeAvatar: {
    width: 150,
    height: 150,
    borderRadius: "50%",
    position: "relative",
    zIndex: 1,
    transition: "all 3s ease-in-out",
    "&::before": {
      content: '""',
      position: "absolute",
      top: "-5px",
      left: "-5px",
      right: "-5px",
      bottom: "-5px",
      borderRadius: "50%",
      background:
        "conic-gradient(red, orange, yellow, green, blue, indigo, violet, red)", // Радужный градиент
      animation: "$rainbowGlow 3s linear infinite",
      filter: "blur(25px)", // Размытие для эффекта тени
      zIndex: -1,
    },
    "@media (max-width: 768px)": {
      width: 100,
      height: 100,
    },
    "@media (max-width: 480px)": {
      width: 75,
      height: 75,
    },
  },
  nonActiveAvatar: {
    width: 150,
    height: 150,
    transition: "all 3s ease-in-out",
    "@media (max-width: 768px)": {
      width: 100,
      height: 100,
    },
    "@media (max-width: 480px)": {
      width: 75,
      height: 75,
    },
  },
  newPlayer: {
    width: 300,
    height: 300,
    "@media (max-width: 768px)": {
      width: 200,
      height: 200,
    },
    "@media (max-width: 480px)": {
      width: 150,
      height: 150,
    },
  },
  kissing: {
    width: 300,
    height: 300,
    "@media (max-width: 768px)": {
      width: 200,
      height: 200,
    },
    "@media (max-width: 480px)": {
      width: 150,
      height: 150,
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

export function PlayerAvatar({
  player,
  angle,
  index,
  activePlayer,
  newPlayer,
  isTransitioning,
}: PlayerAvatarProps) {
  const classes = useStyles(player);
  return (
    <div
      className={classes.playerAvatar}
      style={
        index === activePlayer && !isTransitioning
          ? {
              transform: `translate(10%, 75%)`,
              zIndex: "10",
            }
          : index !== activePlayer && index === newPlayer
          ? {
              transform: "translate(140%, 75%)",
              zIndex: "10",
            }
          : { transform: `rotate(${angle}deg) translate(75px)` }
      }
    >
      <div
        className={
          index === activePlayer
            ? `${classes.activeAvatar} ${
                !isTransitioning ? classes.kissing : ""
              }`
            : `${classes.nonActiveAvatar} ${
                index === newPlayer ? classes.newPlayer : ""
              }`
        }
        style={
          (index === activePlayer && isTransitioning) ||
          (index !== newPlayer && index !== activePlayer)
            ? { transform: `rotate(-${angle}deg)` }
            : {}
        }
      >
        <div
          className={`${classes.avatar} ${
            (index === activePlayer && isTransitioning === false) ||
            (index !== activePlayer && index === newPlayer)
              ? classes.avatarKissing
              : ""
          }`}
        ></div>
      </div>
    </div>
  );
}
