import { createUseStyles } from "react-jss";
import bottleImg from "../../assets/Bottle.png";

const useStyles = createUseStyles({
  bottle: {
    width: "120px",
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    transition: "transform 4s ease-in-out", // Плавное вращение
  },
});

interface BottleProps {
  angle: number; // Угол остановки бутылки
}

export function Bottle({ angle }: BottleProps) {
  const classes = useStyles();
  
  // Общее вращение: 8 полных оборотов (8 * 360) + угол остановки
  const totalRotation = angle;

  return (
    <img
      className={classes.bottle}
      style={{ transform: `translate(-50%, -50%) rotate(${totalRotation}deg)` }} // Устанавливаем полный угол
      src={bottleImg}
      alt="Bottle"
    />
  );
}
