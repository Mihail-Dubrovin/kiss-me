import { createUseStyles } from "react-jss";

export interface IPlayer {
    id: number;
    image: string;
}

const useStyles = createUseStyles({
    avatar: {
        width: 200,
        height: 200,
        borderRadius: '50%',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundImage: (props: IPlayer) => `url(${props.image})`,
        display: 'inline-block',
    }
})

export function PlayerAvatar({ player }: { player: IPlayer }) {
    const classes = useStyles(player);
    return (
        <div className={classes.avatar}></div>
    )
}