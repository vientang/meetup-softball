import React, { useState, useEffect } from 'react';
import { FilterBar, Layout, LeaderCard } from '../components';
import pageStyles from './pages.module.css';

const filters = {
    year: '2018',
    month: '',
    field: '',
};

const LeaderBoard = () => {
    const [leaderStats, setLeaders] = useState({});
    useEffect(() => {
        const summarizedStats = JSON.parse(localStorage.getItem('allGames'));
        setLeaders(createLeaderBoard(summarizedStats));
    }, []);

    return (
        <Layout
            className={pageStyles.pageLayout}
            filterBar={<FilterBar filters={filters} disabled />}
        >
            <div className={pageStyles.leaderBoardPage}>
                {Object.keys(leaderStats).map((stat) => (
                    <LeaderCard key={stat} leaders={leaderStats[stat]} stat={stat} />
                ))}
            </div>
        </Layout>
    );
};

function createLeaderBoard(summarizedStats = []) {
    return {
        hr: getLeaders(summarizedStats, 'hr'),
        avg: getLeaders(summarizedStats, 'avg'),
        rbi: getLeaders(summarizedStats, 'rbi'),
        r: getLeaders(summarizedStats, 'r'),
        doubles: getLeaders(summarizedStats, 'doubles'),
        singles: getLeaders(summarizedStats, 'singles'),
        triples: getLeaders(summarizedStats, 'triples'),
        sb: getLeaders(summarizedStats, 'sb'),
    };
}

function getLeaders(summarizedStats = [], stat) {
    let leaders = [];
    summarizedStats.forEach((player) => {
        const playerToInsert = {
            name: player.name,
            [stat]: player[stat],
            photo: player.photos,
            gp: player.gp,
        };
        // build leaders with first 5 players
        if (leaders.length < 5) {
            leaders.push(playerToInsert);
        } else {
            leaders = sortLeaders({ leaders, player: playerToInsert, stat });
        }
    });
    return leaders;
}

function sortLeaders({ leaders, player, stat }) {
    const statValue = player[stat];
    const lastIndex = leaders.length - 1;
    const lastPlayer = leaders[lastIndex];
    let sortedLeaders = leaders.sort((a, b) => (a[stat] < b[stat] ? 1 : -1));
    // minimum qualifier is the last item in sorted array
    const minQualifier = lastPlayer[stat];
    const rankIndex = sortedLeaders.findIndex((leader) => statValue >= leader[stat]);

    // player met the minimum qualifier requirement
    if (statValue > minQualifier) {
        if (rankIndex === 0) {
            // player is top dawg
            sortedLeaders = [player, ...sortedLeaders.slice(0, lastIndex)];
        } else if (rankIndex > 0) {
            sortedLeaders = [
                ...sortedLeaders.slice(0, rankIndex),
                player,
                ...sortedLeaders.slice(rankIndex, lastIndex),
            ];
        }
    }
    return sortedLeaders;
}
export default LeaderBoard;
