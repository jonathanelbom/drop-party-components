import classnames from 'classnames';
import { useReducer } from 'react';
import styles from './Input.module.css'

function Input({
    value,
    onChange,
    error,
    label,
    id,
    onFocus,
    onBlur,
    type,
    placeholder,
    verified,
    disabled,
    ...rest
}) {
    const reducer = (state, newState) => {
        return {...state, ...newState};
    };
    const [state, setState] = useReducer(
        reducer,
        reducer({value: value, hasFocus: false, beenBlurred: false}, {})
    );
    const handleChange = (e) => {
        const value = e.target.value;
        setState({value});
        return onChange && onChange(value);
    }
    const handleFocus = (e) => {
        setState({hasFocus: true});
        return onFocus && onFocus(e);
    }
    const handleBlur = (e) => {
        setState({hasFocus: false, beenBlurred: true});
        return onBlur && onBlur(e);
    }
    const isTel = type === 'tel';
    const hasIcon = !!verified  || !!error
    const classes = classnames(styles.Input, 'Input');
    const inputClasses = classnames(styles.Input__input, {
        [styles['Input__input--text']]: isTel,
        [styles['Input__input--tel']]: isTel,
        [styles['Input__input--has-value']]: !!state.value,
        [styles['Input__input--has-error']]: !!error
    });
    const labelClasses = classnames(styles.Input__label, {
        [styles['Input__label--has-value']]: !!state.value,
        [styles['Input__label--has-error']]: !!error
    });
    const iconClasses = classnames(styles.Input__icon, {
        [styles['Input__icon--verified']]: !error && !!verified,
        [styles['Input__icon--error']]: !!error
    });
    const inputProps = isTel
        ? {
            ...(!state.hasFocus && {placeholder}),
            maxLength: 11,
        }
        : {};

    return (
        <div className={classes} disabled={disabled}>
            <input
                {...rest}
                id={id || `input-${Math.random().toString(36).substr(2, 9)}`}
                type={type}
                className={inputClasses}
                value={state.value}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                disabled={disabled}
                {...inputProps}
            />
            {isTel && hasIcon && (
                <div className={iconClasses} />
            )}
            {!isTel && (
                <label
                    className={labelClasses}
                    htmlFor={id}
                >
                    {label}
                </label>
            )}
            {error && (
                <span className={styles.Input__error}>{error}</span>
            )}
        </div>
    );
}

Input.defaultProps = {
    type: 'text',
    placeholder: '+1 555-555-555',
}

export default Input;