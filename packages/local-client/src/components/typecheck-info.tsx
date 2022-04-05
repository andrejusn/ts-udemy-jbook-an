import './code-cell.css';
import React from 'react';

import { Cell } from '../state';
import { useTypedSelector } from '../hooks/use-typed-selector'

interface CodeCellProps {
    cell: Cell
}

const TypecheckInfo: React.FC<CodeCellProps> = ({ cell }) => {

    const typecheckData = useTypedSelector((state) => state.typecheck[cell.id]);

    return <>
        <h6>Typecheck info:</h6>
        {typecheckData?.loading ?
            (
                <div className='progress-cover'>
                    <progress
                        className='progress is-small is-primary'
                        max="100"
                    >
                        Loading
                    </progress>
                </div>
            )
            :
            typecheckData?.diags?.map(t => {
                return <p key={t.message}>
                    {t.message} - {t.location}
                </p>
            })}
    </>;
}

export default TypecheckInfo;