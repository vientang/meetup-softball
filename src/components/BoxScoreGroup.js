import React from 'react';
import PropTypes from 'prop-types';
import BoxScore from './BoxScore';
import JoinUs from './JoinUs';
import componentStyles from './components.module.css';
import { useRecentGames } from '../utils/hooks';

const BoxScoreGroup = ({ recentGames }) => {
    if (!recentGames.length) {
        return null;
    }
    const games = useRecentGames(recentGames);

    const recentGameData = createBoxScoreData(games);
    return (
        <div className={componentStyles.boxScoreGroup}>
            <JoinUs />
            {recentGameData.map((gameData) => (
                <BoxScore key={gameData.id} gameData={gameData} />
            ))}
        </div>
    );
};

function createBoxScoreData(games) {
    if (!games || !games.length) {
        return [];
    }
    return games.map((game) => ({
        id: game.id,
        name: game.name,
        date: game.date,
        field: game.field,
        time: game.time,
        winners: game.winners.runsScored,
        losers: game.losers.runsScored,
    }));
}

BoxScoreGroup.displayName = 'BoxScoreGroup';
BoxScoreGroup.propTypes = {
    recentGames: PropTypes.arrayOf(PropTypes.shape),
};

BoxScoreGroup.defaultProps = {
    recentGames: [],
};
export default BoxScoreGroup;
