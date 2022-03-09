import './cell-list.css';
import React from 'react';
import { useTypedSelector } from '../hooks/use-typed-selector';
import CellListItem from './cell-list-item';
import AddCell from './add-cell'

const CellList: React.FC = () => {

    const cells = useTypedSelector(({ cells: { order, data } }) =>
        order.map((id) => data[id])
    );

    cells.forEach(c => console.log(c.content));
    const renderedCells = cells.map(cell => {
        return <React.Fragment key={cell.id}>
            <CellListItem cell={cell} />
            <AddCell previousCellId={cell.id} />
        </React.Fragment>
    })

    return <div className='cell-list'>
        {/* order important */}
        <AddCell forceVisible previousCellId={null} />
        {renderedCells}
    </div>
}

export default CellList;