import { useActions } from "../hooks/use-actions";
import './action-bar.css'

interface ActionBarProps {
    id: string;
    openInNewWindow?: () => void;
}

const ActionBar: React.FC<ActionBarProps> = ({ id, openInNewWindow }) => {
    const { moveCell, deleteCell } = useActions();

    return <div className="action-bar">
        {openInNewWindow && <button
            className="button is-primary is-small"
            onClick={() => {
                if (openInNewWindow) {
                    openInNewWindow()
                }
                console.log(openInNewWindow)
            }}
        >
            <span className="icon">
                <i className="fa-solid fa-up-right-and-down-left-from-center"></i>
            </span>
        </button>}

        <button
            className="button is-primary is-small"
            onClick={() => moveCell(id, 'up')}
        >
            <span className="icon"><i className="fas fa-arrow-up"></i></span>
        </button>

        <button
            className="button is-primary is-small"
            onClick={() => moveCell(id, 'down')}>
            <span className="icon"><i className="fas fa-arrow-down"></i></span>
        </button>

        <button
            className="button is-primary is-small"
            onClick={() => deleteCell(id)}>
            <span className="icon"><i className="fas fa-times"></i></span>
        </button>
    </div>
}

export default ActionBar;