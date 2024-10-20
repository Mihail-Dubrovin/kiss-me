import { createUseStyles } from "react-jss";

interface IKissCounterProps {
  count: number;
}

const useStyles = createUseStyles({
  kissCounter: {
    position: "absolute",
    right: "0",
    top: "0",
    fontSize: 48,
    color: "#000",
    fontWeight: "bold",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    padding: "10px",
  },
});

export function KissCounter({ count }: IKissCounterProps) {
    const classes = useStyles();

  return <div className={classes.kissCounter}>Kisses: {count}</div>;
}
