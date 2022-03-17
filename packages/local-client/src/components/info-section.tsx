import './cell-list.css';
import './info-section.css';

import React from 'react';
import { useTypedSelector } from '../hooks/use-typed-selector';
import { useActions } from '../hooks/use-actions';
import { CheckboxSwitch } from './checkbox-switch';

const InfoSection: React.FC = () => {
    const isDarkTheme = useTypedSelector(({ theme: { darkTheme } }) => darkTheme);
    const { toggleTheme, createDemoNotes, removeDemoNotes } = useActions();

    return <div>
        <div className='hero is-dark'>
            <div className='hero-body'>
                <h1 className='title'>JSX Note</h1>
                <h2 className='subtitle'>Write, preview & share React code!</h2>
            </div>
        </div >
        <div className='content'>
            <div className='theme-toggler-div'>
                <CheckboxSwitch isDarkTheme={isDarkTheme} toggleTheme={toggleTheme} />
            </div>
            <figure style={{ textAlign: 'left' }}>
                <figcaption style={{ fontWeight: 'bold' }}>Instructions: </figcaption>
                <ul>
                    <li>open code editor cell or text editor cell by clicking the buttons</li>
                    <li>arrange the order by moving up or down, or inserting a cell before</li>
                    <li>use show() function to render the component/function/variable/value to screen</li>
                    <li>reuse components/values from previous (from top to bottom) cells</li>
                    <li>import libraries, styles, etc.</li>
                    <li>find all the contents saved in the notebook.js (or a manually specified) file, in the convenient format</li>
                </ul>
            </figure>
            <div>
                <button className='button is-info is-large is-rounded' onClick={createDemoNotes}>Create demo notes for illustration</button>
                <button className='button is-info is-large is-rounded' onClick={removeDemoNotes}>Remove demo notes</button>
            </div>
        </div>
    </div>
}

export default InfoSection;