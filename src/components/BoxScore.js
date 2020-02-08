import React from 'react';
import PropTypes from 'prop-types';
import Winners from './Winners';
import Losers from './Losers';
import { getMeridiem } from '../utils/helpers';
import componentStyles from './components.module.css';

const BoxScore = ({ gameData }) => {
    const { date, time, field, name, winners, losers } = gameData;
    const gameDesc = name && field ? `${name} @ ${field}` : null;
    const gameTime = time && date ? `${date}, ${time}${getMeridiem(time)}` : null;

    return (
        <div className={componentStyles.boxScore}>
            <div className={componentStyles.boxScoreHeading}>
                <h3 className={componentStyles.boxScoreTitle}>{gameDesc}</h3>
                <span className={componentStyles.boxScoreDate}>{gameTime}</span>
            </div>
            <div className={componentStyles.boxScoreResultsGroup}>
                <div className={componentStyles.boxScoreResults}>
                    <Winners />
                    <span>WINNERS</span>
                    <span className={componentStyles.boxScoreTotal}>{winners}</span>
                </div>
                <div className={componentStyles.boxScoreResults}>
                    <Losers />
                    <span>LOSERS</span>
                    <span className={componentStyles.boxScoreTotal}>{losers}</span>
                </div>
            </div>
        </div>
    );
};

BoxScore.displayName = 'BoxScore';
BoxScore.propTypes = {
    gameData: PropTypes.shape({
        name: PropTypes.string,
        field: PropTypes.string,
        date: PropTypes.string,
        time: PropTypes.string,
        gameId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        winners: PropTypes.number,
        losers: PropTypes.number,
    }),
};

export default BoxScore;
