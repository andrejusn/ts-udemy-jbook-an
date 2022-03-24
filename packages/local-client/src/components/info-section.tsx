import './cell-list.css';
import './info-section.css';

import React, { useState } from 'react';
import { useTypedSelector } from '../hooks/use-typed-selector';
import { useActions } from '../hooks/use-actions';
import { CheckboxSwitch } from './checkbox-switch';

const InfoSection: React.FC = () => {
    const [showingInstructions, setShowingInstructions] = useState(false);
    const isDarkTheme = useTypedSelector(({ theme: { darkTheme } }) => darkTheme);
    const hasDemoCells = useTypedSelector(({ cells: { data } }) => !!Object.keys(data).find(keyOfId => keyOfId.startsWith('DEMO')));

    const { toggleTheme, createDemoNotes, removeDemoNotes, loadNotesFromDisk } = useActions();

    return (
        <div>
            <div className='hero is-dark'>
                <div className='hero-body'>
                    <h1 className='title'>JSX Note</h1>
                    <h2 className='subtitle'>Write, preview & share React code!</h2>
                </div>
                <div className='hero-right'>
                    <div>
                        <button className='button is-info is-small demo-button' onClick={loadNotesFromDisk} disabled={hasDemoCells}>
                            <span className="icon"><i className='fa fa-upload'></i></span>
                            <span>Load notes from disk</span>
                        </button>
                    </div>
                    <div className='theme-toggler'>
                        <CheckboxSwitch isDarkTheme={isDarkTheme} toggleTheme={toggleTheme} />
                    </div>
                </div>
            </div >
            <div className='content'>
                <div style={{ textAlign: 'left' }}>
                    <div className='guide-toggle' onClick={() => setShowingInstructions(!showingInstructions)}>
                        {showingInstructions ? `Hide guide` : `Show guide`}
                        <span className="icon"><i className={`fa ${showingInstructions ? 'fa-angle-up' : 'fa-angle-down'}`}></i></span>
                    </div>
                    {showingInstructions && (
                        <div className='guide-content'>
                            <ul className='guide-content-list'>
                                <li>open code editor cell or text editor cell by clicking the buttons</li>
                                <li>arrange the order by moving up or down, or inserting a cell before</li>
                                <li>use show() function to render the component/function/variable/value to screen</li>
                                <li>reuse components/values from previous (from top to bottom) cells</li>
                                <li>import libraries, styles, etc.</li>
                                <li>find all the contents saved in the notebook.js (or a manually specified) file</li>
                            </ul>
                            <div className="demo-buttons">
                                <div><button className='button is-info is-small demo-button' onClick={createDemoNotes} disabled={hasDemoCells}>Create demo notes for illustration</button></div>
                                <div><button className='button is-info is-small demo-button' onClick={removeDemoNotes} disabled={!hasDemoCells}>Remove demo notes</button></div>
                            </div>
                        </div>)}
                </div>

            </div>
        </div >
    )
}

export default InfoSection;
