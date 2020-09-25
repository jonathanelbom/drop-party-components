// import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import styles from './ImageCarousel.module.css';
// import './ImageCarousel.scss';


function ImageCarousel({
}) {
    const images = new Array(4).fill('');
    const index = 0;
    // const classNames = styleClass(styles, ['ImageCarousel'], {'ImageCarousel__green': false});
    return (
        <Fragment>
            {/* <div className={classNames} /> */}
        </Fragment>
        // <Fragment>
        //     <div className={styles.ImageCarousel}/>
        //     <div className={styles.ImageCarousel__indicators}>
        //         {images.map((value, i) => (
        //             <div className={i = index ? styles.ImageCarousel__indicator__selected : styles.ImageCarousel__indicator}/>
        //         ))}
        //     </div>
        // </Fragment>
    );
}

export default ImageCarousel;