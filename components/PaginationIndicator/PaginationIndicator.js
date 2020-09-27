import classnames from 'classnames';
import styles from './PaginationIndicator.module.css';

function PaginationIndicator({maxItems, itemIndex, transitionDuration = 250}) {
    let paginationOffset = 0;
    const adj = 12 * 4.5;
    if (itemIndex > 2 && itemIndex + 4 <= maxItems) {
        paginationOffset = -adj * (itemIndex - 2);
    } else if (itemIndex > 3) {
        paginationOffset = -adj * (maxItems - 5);
    }
    return (
        <div className={styles.PaginationItem}>
            <div
                className={styles.PaginationItem__wrapper}
                style={{
                    transform: `translateX(${paginationOffset}px)`,
                    transition: `transform ${transitionDuration}ms ease-out`,
                }}
            >
                {Array(maxItems)
                    .fill()
                    .map((item, i) => {
                        return (
                            <div
                                className={classnames(styles['pagination-item'], {
                                    [styles['pagination-item--active']]: itemIndex === i
                                })}
                                key={`p-d-${i}`}
                                style={{
                                    transition: `background-color ${transitionDuration}ms ease, transform ${transitionDuration}ms ease`,
                                }}
                            />
                        );
                    })}
            </div>
        </div>
    );
}

PaginationIndicator.defaultProps = {
    maxItems: 0,
    itemIndex: 0,
    transitionDuration: 250,
};

export default PaginationIndicator;
