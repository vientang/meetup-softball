import React from 'react';
import LoadingDots from './LoadingDots';
import loadingStyles from './loading.module.css';

const LoadingImage = () => {
    return (
        <span className={loadingStyles.loadingText}>
            Loading
            <LoadingDots />
        </span>
    );
};

export default LoadingImage;
