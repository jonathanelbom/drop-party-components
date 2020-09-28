// import PropTypes from 'prop-types';
import {Fragment, useRef, useReducer, useEffect} from 'react';
import classnames from 'classnames';
import Image from './Image';
import PaginationIndicator from '../PaginationIndicator/PaginationIndicator';
import styles from './ImageCarousel.module.scss';

const getUpdatedIndex = (dir, index, length) => {
    return dir === 'next'
        ? index > length - 2 ? index : index + 1
        : index > 0 ? index - 1 : index;
};

const getViewboxTransform = ({panPct, index, moving, transitionDuration, widthPct}) => {
    return {
        transform: `translateX(${(-(widthPct || 1) * 100 * index) + panPct}%)`,
        ...(!moving && {transition: `transform ${transitionDuration}ms ease`}),
    };
}

function ImageCarousel({
    images,
    height,
    transitionDuration,
    changeThreshold,
    onChange,
    index
}) {
    const reducer = (state, newState) => {
        return {...state, ...newState};
    };
    const [state, setState] = useReducer(
        reducer,
        reducer({
            panPct: 0,
            tempPanPct: 0,
            index,
            forceUpdateCount: 0,
        }, {})
    );

    const elemRef = useRef(null);
    const x = useRef(null);
    const y = useRef(null);
    const touchMoved = useRef(false);
    const panAxis = useRef(null);
    const timeoutId = useRef(null);
    const imageWidthAsPct = useRef(0);
    
    useEffect(() => {
        if (state.index !== 0 && elemRef.current) {
            const elemWidth = elemRef.current.clientWidth;
            imageWidthAsPct.current = (elemWidth - 21) / elemWidth;
            setState({forceUpdateCount: state.forceUpdateCount + 1})
        }
    }, [])

    const transition = (dir) => {
        const reset = dir === 'reset';
        const updatedIndex = reset ? state.index : getUpdatedIndex(dir, state.index, images.length);
        setState({
            panPct: 0,
            index: updatedIndex
        });
        clearTimeout(timeoutId.current);
        timeoutId.current = setTimeout(() => {
            if (!reset) {
                return onChange && onChange(updatedIndex)
            }
        }, transitionDuration);
    }

    const onChangeIndex = (dir, e) => {
        e.stopPropagation();
        e.preventDefault();
        transition(dir);
    }

    const handleTouchEnd = (e) => {
        const {panPct} = state;
        x.current = null;
        y.current = null;
        panAxis.current = null;
        if (touchMoved.current) {
            if (panPct <= -changeThreshold) {
                onChangeIndex('next', e);
            } else if (panPct >= changeThreshold) {
                onChangeIndex('prev', e);
            } else {
                transition('reset');
            }
        }
        touchMoved.current = false;
        if (elemRef.current) {
            elemRef.current.removeEventListener('touchmove', handleTouchMove, {passive: false});
        }
    };

    const handleTouchStart = (e) => {
        const clientX = e.touches[0].clientX;
        const clientY = e.touches[0].clientY;
        x.current = clientX;
        y.current = clientY;

        if (elemRef.current) {
            const elemWidth = elemRef.current.clientWidth;
            imageWidthAsPct.current = (elemWidth - 21) / elemWidth;
            elemRef.current.addEventListener('touchmove', handleTouchMove, {passive: false});
        }
    };

    const handleTouchMove = (e) => {
        const clientX = e.touches[0].clientX;
        const clientY = e.touches[0].clientY;

        const xDiff = x.current - clientX;
        touchMoved.current = true;
        // determine pan axis for this swipe
        if (!panAxis.current) {
            const yDiffAbs = Math.abs(y.current - clientY);
            panAxis.current = Math.abs(xDiff) > yDiffAbs ? 'horz' : 'vert';
        }
        /* Get the start position and direction */
        if (panAxis.current === 'horz') {
            /* Prevent vertical scrolling while are are swiping on the image */
            e.preventDefault();
            const width = e.currentTarget.clientWidth;
            const panPct = Math.round(-(xDiff / width) * 100);
            const normalizedPanPct = Math.min(Math.max(-100, panPct), 100);
            setState({panPct: normalizedPanPct});
        }
    };

    return (
        <div
            className={styles.ImageCarousel}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            ref={elemRef}
        >
            <div
                className={styles.ImageCarousel__container}
                style={{height: `${height}px`}}
            >
                <div
                    className={styles.ImageCarousel__viewbox}
                    key={`viewbox-${state.forceUpdateCount}`}
                    style={getViewboxTransform({
                        panPct: state.panPct,
                        index: state.index,
                        moving: touchMoved.current,
                        transitionDuration,
                        widthPct: imageWidthAsPct.current
                    })}
                >
                    {images.map((image, index) => {
                        return (
                            <div
                                className={styles.ImageCarousel__wrapper}
                                key={`image-wrapper-${index}`}
                            >
                                <Image {...image} />
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className={styles.ImageCarousel__pagination}>
                <PaginationIndicator maxItems={images.length} itemIndex={state.index} />
            </div>
        </div>
    );
}

ImageCarousel.defaultProps = {
    height: 300,
    transitionDuration: 250,
    changeThreshold: 15,
    index: 0
}

export default ImageCarousel;