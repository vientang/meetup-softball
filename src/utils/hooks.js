import { useState, useEffect } from 'react';
import {
    fetchPlayerInfo,
    fetchNextGamesFromMeetup,
    fetchSummarizedStats,
    createNewSummarizedStats,
} from './apiService';
import createLeaderBoard from './leadersCalc';
import { getIdFromFilterParams } from './helpers';

export const usePlayerInfo = (id) => {
    const [playerInfo, setPlayerInfo] = useState(null);
    useEffect(() => {
        async function fetchPlayer() {
            if (id) {
                const playerInfo = await fetchPlayerInfo(id);
                setPlayerInfo(playerInfo);
            }
        }
        fetchPlayer();
    }, [id]);
    return playerInfo;
};

export const useSummarizedStats = (id) => {
    const [summarizedStats, setSummarizedStats] = useState([]);
    useEffect(() => {
        let mounted = true;
        if (mounted) {
            const fetchStats = async () => {
                const summarizedStats = await fetchSummarizedStats(id);
                setSummarizedStats(summarizedStats);
            };
            fetchStats();
        }

        return () => {
            if (mounted) {
                mounted = false;
            }
        };
    }, []);

    return [summarizedStats, setSummarizedStats];
};

/**
 * Post a new entry on summarized stats for every leader board filter
 * _leaders_2018_westlake, _leaders_2017, _leaders_2016, etc.
 * @param {Object} filters
 * @param {Array} stats - summarized stats
 */
export const useCreateLeaders = (filters, stats) => {
    useEffect(() => {
        const { year } = filters;
        const id = getIdFromFilterParams({ year });
        const leaderBoard = createLeaderBoard(stats);

        if (id !== '_2018') {
            const createSummarizedLeaderboard = async () => {
                await createNewSummarizedStats({
                    input: {
                        id: `_leaderboard${id}`,
                        stats: JSON.stringify([leaderBoard]),
                    },
                });
            };

            createSummarizedLeaderboard();
        }
    }, [filters, stats]);
};

export const useFetchNextMeetupGames = () => {
    const [nextGames, setNextGames] = useState([]);
    useEffect(() => {
        let mounted = true;
        if (mounted) {
            const fetchNextGame = async () => {
                const nextGames = await fetchNextGamesFromMeetup();
                setNextGames(nextGames);
            };
            fetchNextGame();
        }

        return () => {
            if (mounted) {
                mounted = false;
            }
        };
    }, []);

    return nextGames;
};
