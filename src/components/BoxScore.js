import React from 'react';
import PropTypes from 'prop-types';
import Winners from './Winners';
import Losers from './Losers';
import componentStyles from './components.module.css';

// TODO: use hooks to fetch softball stats data
const BoxScore = ({ style }) => {
    return (
        <div className={componentStyles.boxScore} style={style}>
            <div className={componentStyles.boxScoreHeading}>
                <h3 className={componentStyles.boxScoreTitle}>Game 240 @ Parkside</h3>
                <span className={componentStyles.boxScoreDate}>Saturday, April 6th</span>
            </div>
            <div className={componentStyles.boxScoreResultsGroup}>
                <div className={componentStyles.boxScoreResults}>
                    <Winners />
                    <span>Winners</span>
                    <span className={componentStyles.boxScoreTotal}>10</span>
                </div>
                <div className={componentStyles.boxScoreResults}>
                    <Losers />
                    <span>Losers</span>
                    <span className={componentStyles.boxScoreTotal}>9</span>
                </div>
            </div>
        </div>
    );
};

BoxScore.propTypes = {
    losers: PropTypes.shape(),
    style: PropTypes.shape(),
    winners: PropTypes.shape(),
};

export default BoxScore;
