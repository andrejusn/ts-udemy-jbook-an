import './cell-list.css';
import React from 'react';
import { useTypedSelector } from '../hooks/use-typed-selector';
import { useActions } from '../hooks/use-actions';

const InfoSection: React.FC = () => {
    const isLightTheme = useTypedSelector(({ theme: { lightTheme } }) => lightTheme);
    const { toggleTheme } = useActions();

    return <div className='hero-body'>
        Copy this code to the Code cell:
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
        <input type='checkbox' className='switch' checked={isLightTheme} onClick={toggleTheme} />

    </div>
}

export default InfoSection;