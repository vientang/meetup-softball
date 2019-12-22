import React from 'react';
import loadingStyles from './loading.module.css';

const LoadingDots = () => {
    return (
        <div className={loadingStyles.dotsContainer}>
            <div className={loadingStyles.dots1} />
            <div className={loadingStyles.dots2} />
            <div />
        </div>
    );
};

export default LoadingDots;
