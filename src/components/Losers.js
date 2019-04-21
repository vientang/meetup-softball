import React from 'react';
import PropTypes from 'prop-types';

const Losers = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        preserveAspectRatio="xMidYMid"
        width="25px"
        height="25px"
        viewBox="0 0 244 244"
    >
        <path
            style={{
                fill: '#c80000',
                stroke: '#fffff',
                strokeWidth: '3px',
                transform: 'translateX(-60px)',
            }}
            d="m 200.65,149.66 24.7,-74 -42.65,0 -24.7,74 -8.57,25.67 42.65,0 68.37,0 8.57,-25.67 -68.37,0 z"
        />
    </svg>
);

Losers.displayName = 'Losers';
Losers.propTypes = {
    size: PropTypes.number,
    uri: PropTypes.string,
};

export default Losers;
