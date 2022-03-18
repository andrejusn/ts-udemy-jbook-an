import './checkbox-switch.css';
import 'bulma-switch';

interface CheckboxSwitchProps {
    isDarkTheme: boolean;
    toggleTheme: () => void;
}

export const CheckboxSwitch: React.FC<CheckboxSwitchProps> = ({ isDarkTheme, toggleTheme }) => {

    return (
        <div className="field">
            <input id="theme-switch" type="checkbox" className="switch is-small" checked={isDarkTheme} onChange={toggleTheme} />
            <label htmlFor="theme-switch">{isDarkTheme ? `Dark` : `Light`}</label>
        </div>

    )
}
