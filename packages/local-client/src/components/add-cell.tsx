import './add-cell.css';
import { useActions } from '../hooks/use-actions'
import { build } from 'esbuild-wasm';

interface AddCellProps {
    previousCellId: string | null;
    forceVisible?: boolean;
}

const AddCell: React.FC<AddCellProps> = ({ previousCellId, forceVisible }) => {
    const { insertCellAfter } = useActions();
    return <div className={`add-cell ${forceVisible && 'visible'}`}>
        <div className='add-buttons'>
            <button
                className='button is-rounded is-primary is-small'
                onClick={() => insertCellAfter(previousCellId, 'code')}>
                <span className='icon is-small'>
                    <i className='fas fa-plus' />
                </span>
                <span >Code</span>
            </button>
            <button
                className='button is-rounded is-primary is-small'
                onClick={() => insertCellAfter(previousCellId, 'text')}>
                <span className='icon is-small'>
                    <i className='fas fa-minus' />
                </span>
                <span > Text</span>
            </button>
        </div>
        {previousCellId}

        <div className='divider'></div>
    </div>
}

export default AddCell;