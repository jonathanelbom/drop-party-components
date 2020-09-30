import classnames from 'classnames';
import PropTypes from 'prop-types';
import withState from '../withState/withState';
import styles from './Input.module.scss'

function InputControlled({
    value,
    onChange,
    error,
    errorMsg,
    label,
    id,
    onFocus,
    onBlur,
    type,
    placeholder,
    verified,
    disabled,
    hasFocus,
    beenBlurred,
    ...rest
}) {    
    const isTel = type === 'tel';
    const hasIcon = !!verified  || !!error
    const classes = classnames(styles.Input, 'Input');
    const inputClasses = classnames(styles.Input__input, {
        [styles['Input__input--text']]: isTel,
        [styles['Input__input--tel']]: isTel,
        [styles['Input__input--has-value']]: !!value,
        [styles['Input__input--has-error']]: !!error
    });
    const labelClasses = classnames(styles.Input__label, {
        [styles['Input__label--has-value']]: !!value,
        [styles['Input__label--has-error']]: !!error
    });
    const iconClasses = classnames(styles.Input__icon, {
        [styles['Input__icon--verified']]: !error && !!verified,
        [styles['Input__icon--error']]: !!error
    });
    const inputProps = isTel
        ? {
            ...(!hasFocus && {placeholder}),
            // maxLength: 14,
        }
        : {};
    return (
        <div className={classes} disabled={disabled}>
            <input
                {...rest}
                id={id || `input-${Math.random().toString(36).substr(2, 9)}`}
                type={type}
                className={inputClasses}
                value={value}
                onChange={onChange}
                onFocus={onFocus}
                onBlur={onBlur}
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
            {errorMsg && (
                <span className={styles.Input__error}>{errorMsg}</span>
            )}
        </div>
    );
}

InputControlled.propsTypes = {
    value: PropTypes.string.isRequired,
    type: PropTypes.string,
    placeholder: PropTypes.string,
}

InputControlled.defaultProps = {
    value: '',
    type: 'text',
    // placeholder: '+1 555-555-555',
}

const Input = withState(InputControlled);

export default Input;

export {
    Input,
    InputControlled
};
