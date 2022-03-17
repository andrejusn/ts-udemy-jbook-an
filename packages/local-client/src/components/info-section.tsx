import './cell-list.css';
import React from 'react';

const InfoSection: React.FC = () => {

    return <div><div className='hero is-dark'>
        <div className='hero-body'>
            <h1 className='title'>JSX Note</h1>
            <h2 className='subtitle'>Write, preview & share React code!</h2>
        </div>
    </div >
        <div className='content'>
            <figure>
                <figcaption>Instructions: </figcaption>
                <ul>
                    <li>open code editor cell or text editor cell by clicking the buttons</li>
                    <li>arrange the order by moving up or down, or inserting a cell before</li>
                    <li>use show() function to render the component/function/variable/value to screen</li>
                    <li>reuse components/values from previous (from top to bottom) cells</li>
                    <li>import libraries, styles, etc.</li>
                    <li>find all the contents saved in the notebook.js (or a manually specified) file, in the convenient format</li>
                </ul>
            </figure>
            <pre>
                {`import 'bulmaswatch/superhero/bulmaswatch.min.css';
import React from 'react';

const name = 'Lucky';
const Title = ({name}) => {
    const [count, setCount] = React.useState(5)
    return(<div>
        <h1 className="title">Hello, {name}!</h1>
        <p>Your luck is at: {count}</p>
        <a className="button is-info is-rounded" onClick={()=> setCount(count + 1)}>Increase luck</a>
        </div>);
    }

show(<Title name={name} />);`}
            </pre>
        </div>
    </div>

}

export default InfoSection;