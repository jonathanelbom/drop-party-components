import classnames from 'classnames';
import styles from './Select.module.css'

function Select({
    children,
    className,
    error,
    id,
    onChange,
    value,
    ...rest
}) {
    const handleChange = (e) => {
        return onChange && onChange(e.target.value);
    }
    const selectClasses = classnames(styles.Select, className, {
        [styles['Select--has-value']]: !!value,
        [styles['Select--has-error']]: !!error,
    });
    const select = (
        <select
            id={id || `select-${Math.random().toString(36).substr(2, 9)}`}
            value={value}
            className={selectClasses}
            onChange={handleChange}
            {...rest}
        >
            {children}
        </select>
    );
    if (error) {
        return (
            <div className={styles.Select__wrapper}>
                {select}
                <span className={styles.Select__error}>{error}</span>
            </div>
        );
    }
    return select;
}

export default Select;
