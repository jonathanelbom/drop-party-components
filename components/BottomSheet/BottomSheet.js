import {CSSTransition} from 'react-transition-group';
import classnames from 'classnames';
import usePreventScroll from 'components/hooks/usePreventScroll';
import styles from './BottomSheet.module.scss';

const BottomSheet = ({
    children,
    className,
    dismiss,
    show
}) => {
    usePreventScroll(show);
    return (
        <CSSTransition
            in={show}
            timeout={250}
            classNames="BottomSheet-trans"
            mountOnEnter
            unmountOnExit
        >
            <div className={styles.BottomSheet}>
                <div className={classnames(styles.BottomSheet__scrim, 'BottomSheet__scrim')} onTouchStart={dismiss}/>
                <div className={classnames(styles.BottomSheet__content, 'BottomSheet__content')}>
                    {children}
                </div>
            </div>
        </CSSTransition>
    );
}

export default BottomSheet;
