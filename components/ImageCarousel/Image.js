// import PropTypes from 'prop-types';
import {Fragment, useState, useRef, useEffect} from 'react';
import classnames from 'classnames';
import styles from './ImageCarousel.module.css';

const Image = ({
    alt,
    className,
    src,
    index,
    style
}) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const imageRef = useRef(null);
    useEffect(() => {
        const alreadyLoaded = [
            !imageLoaded,
            !imageError,
            imageRef.current && imageRef.current.complete,
        ].every((condition) => {
            return !!condition;
        });
        if (alreadyLoaded) {
            setImageLoaded(true);
        }
    }, []);

    const isLoading = () => !imageLoaded && !imageError;
    const renderAltText = () =>
        imageLoaded ? <span role="img" aria-label={alt || `Image ${index}`} /> : null;
    const classes = classnames(styles.Image, 'Image', className);
    const imageClasses = classnames(styles.Image__image, 'Image__image', {
        [styles['Image__image--loaded-or-error']]: imageLoaded || imageError,
    });
    const bgStyle = {
        ...(imageLoaded && {backgroundImage: `url('${src}')`}),
        ...style
    };
    return (
        <div className={classes}>
            <div
                className={imageClasses}
                style={bgStyle}
            >
                {imageError && (
                    <div>{'Image error'}</div>
                )}
                {renderAltText()}
            </div>
            {isLoading() && (
                <img
                    src={src}
                    className={styles['Image__img-loader']}
                    ref={imageRef}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageError(true)}
                    alt={alt}
                />
            )}
        </div>
    );
};

export default Image;
