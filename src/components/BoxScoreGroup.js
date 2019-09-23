import React, { useState, useEffect } from 'react';
import { fetchAllGames } from '../utils/apiService';
import { sortTimeStamp } from '../utils/helpers';
import BoxScore from './BoxScore';
import JoinUs from './JoinUs';
import componentStyles from './components.module.css';

const BoxScoreGroup = () => {
    const [recentGames, setRecentGameData] = useState([]);
    useEffect(() => {
        let isMounted = true;
        async function fetchData() {
            let allGames = await fetchAllGames();
            allGames = allGames.sort(sortTimeStamp);
            if (isMounted) {
                setRecentGameData(createBoxScoreData([allGames[1], allGames[0]].filter(Boolean)));
            }
        }
        fetchData();
        return () => (isMounted = false);
    }, []);

    if (!recentGames.length) {
        return null;
    }

    return (
        <div className={componentStyles.boxScoreGroup}>
            <JoinUs />
            {recentGames.map((gameData) => (
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
            winners: JSON.parse(game.winners).runsScored,
            losers: JSON.parse(game.losers).runsScored,
        };
        return recentGameData;
    });
}

BoxScoreGroup.displayName = 'BoxScoreGroup';

export default BoxScoreGroup;
