import React from 'react';
import PropTypes from 'prop-types';
import BoxScore from './BoxScore';
import JoinUs from './JoinUs';
import componentStyles from './components.module.css';

const BoxScoreGroup = ({ recentGames }) => {
    if (!recentGames.length) {
        return null;
    }
    const recentGameData = createBoxScoreData(recentGames.slice(0, 2));
    return (
        <div className={componentStyles.boxScoreGroup}>
            <JoinUs />
            {recentGameData.map((gameData) => (
                <BoxScore key={gameData.gameId} gameData={gameData} />
            ))}
        </div>
    );
};

function createBoxScoreData(games) {
    if (!games || !games.length) {
        return [];
    }
    return games.map((game) => {
        const recentGameData = {
            name: game.name,
            date: game.date,
            field: game.field,
            gameId: game.gameId,
            time: game.time,
            winners: game.winners.runsScored,
            losers: game.losers.runsScored,
        };
        return recentGameData;
    });
}

BoxScoreGroup.displayName = 'BoxScoreGroup';
BoxScoreGroup.propTypes = {
    recentGames: PropTypes.arrayOf(PropTypes.shape),
};

BoxScoreGroup.defaultProps = {
    recentGames: [],
};
export default BoxScoreGroup;
