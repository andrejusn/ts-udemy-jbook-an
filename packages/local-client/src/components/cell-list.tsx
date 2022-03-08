import './cell-list.css';
import { useTypedSelector } from '../hooks/use-typed-selector'
import CellListItem from './cell-list-item';
import AddCell from './add-cell'
import React from 'react';

const CellList: React.FC = () => {


    const cells = useTypedSelector(({ cells: { order, data } }) =>
        order.map((id) => data[id])
    );


    // const st = useTypedSelector(({ cells }) => cells);


    // console.log('data: ', st.data)
    // console.log('order: ', st.order)

    const renderedCells = cells.map(cell => {
        return <React.Fragment key={cell.id}>
            <AddCell previousCellId={cell.id} />
            <CellListItem key={cell.id} cell={cell} />
        </React.Fragment>
    })

    return <div className='cell-list'>
        {/* order important */}
        {renderedCells}
        <AddCell forceVisible previousCellId={null} />
    </div>
}

export default CellList;