import React from 'react';
import LoadingDots from './LoadingDots';
import loadingStyles from './loading.module.css';
import svg from '../../images/softball.svg';

const LoadingImage = () => {
    return (
        <>
            <img src={svg} alt="loading softball" className={loadingStyles.loadingImage} />
            <span className={loadingStyles.loadingText}>
                Loading
                <LoadingDots />
            </span>
        </>
    );
};

export default LoadingImage;
