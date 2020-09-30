import classnames from 'classnames';
import styles from './Button.module.scss';

function Button({
    href,
    children,
    className,
    label,
    secondary,
    onClick,
    ...rest
}) {
    const classes = classnames(styles.Button, className, {
        [styles['Button--primary']]: !secondary,
        [styles['Button--secondary']]: secondary,
    });
    if (href) {
        return (
            <a className={classes} href={href} {...rest}>
                <span className={styles.Button__label}>{label}</span>
            </a>
        );
    }
    return (
        <button className={classes} {...rest} {...(onClick && {onClick})} >
            <span className={styles.Button__label}>{label}</span>
        </button>
    );
}

export default Button;
