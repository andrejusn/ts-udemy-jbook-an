import './checkbox-switch.css';

interface CheckboxSwitchProps {
    isDarkTheme: boolean;
    toggleTheme: () => void;
}

export const CheckboxSwitch: React.FC<CheckboxSwitchProps> = ({ isDarkTheme, toggleTheme }) => {

    return (
        <div
        // className="switch is-small"
        >
            <label htmlFor='use-dark-theme'>Use dark theme</label>
            <input id='use-dark-theme' type={'checkbox'} checked={isDarkTheme} onChange={toggleTheme} />
            {/* <label htmlFor="use_dark_theme" data-label={`Dark ${isDarkTheme ? 'on' : 'off'}`}>Dark</label>
            <input id="use_dark_theme" type="checkbox" name="darkTheme" checked={isDarkTheme} onChange={toggleTheme} /> */}
        </div>
    )
}
