import classnames from 'classnames';
import PropTypes from 'prop-types';
import withState from '../withState/withState';
import styles from './Select.module.scss'

function SelectControlled({
    children,
    className,
    error,
    id,
    onChange,
    value,
    hasFocus,
    beenBlurred,
    ...rest
}) {
    // const handleChange = (e) => {
    //     return onChange && onChange(e.target.value);
    // }
    const selectClasses = classnames(styles.Select, className, {
        [styles['Select--has-value']]: !!value,
        [styles['Select--has-error']]: !!error,
    });
    const select = (
        <select
            id={id}
            value={value}
            className={selectClasses}
            onChange={onChange}
            // onChange={handleChange}
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

SelectControlled.propsTypes = {
    value: PropTypes.string.isRequired,
}

SelectControlled.defaultProps = {
    value: '',
}

const Select = withState(SelectControlled);

export default SelectControlled;
export {
    Select,
    SelectControlled
}
