import './code-cell.css';
import React from 'react';

import { Cell } from '../state';
import { useTypedSelector } from '../hooks/use-typed-selector'

interface CodeCellProps {
    cell: Cell
}

const TypecheckInfo: React.FC<CodeCellProps> = ({ cell }) => {

    const typecheckData = useTypedSelector((state) => state.typecheck[cell.id]);


    console.log(typecheckData)
    return <>
        {typecheckData?.diags?.map(t => {
            return <p key={t.message}>
                {t.message} - {t.location}
            </p>
        })}
    </>;
}

export default TypecheckInfo;