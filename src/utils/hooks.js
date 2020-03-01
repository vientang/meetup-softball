import { useState, useEffect, useMemo, useRef } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import {
    fetchGameStats,
    fetchPlayerInfo,
    fetchPlayerStats,
    fetchNextGamesFromMeetup,
    fetchSummarizedStats,
    createNewSummarizedStats,
} from './apiService';
import createLeaderBoard from './leadersCalc';
import { getIdFromFilterParams } from './helpers';

export const useIsMounted = () => {
    const isMounted = useRef(false);
    useEffect(() => {
        isMounted.current = true;
        return () => (isMounted.current = false);
    }, []);
    return isMounted;
};

export const useMetaData = () => {
    const data = useStaticQuery(graphql`
        query {
            softballstats {
                metadata: getMetaData(id: "_metadata") {
                    id
                    activePlayers
                    allFields
                    allYears
                    inactivePlayers
                    perYear
                    recentGames
                    totalGamesPlayed
                    totalPlayersCount
                }
            }
        }
    `);
    const {
        id,
        activePlayers,
        allFields,
        allYears,
        inactivePlayers,
        perYear,
        recentGames,
        totalGamesPlayed,
        totalPlayersCount,
    } = data.softballstats.metadata;
    return {
        id,
        activePlayers: JSON.parse(activePlayers),
        allFields: JSON.parse(allFields),
        allYears: JSON.parse(allYears),
        inactivePlayers: JSON.parse(inactivePlayers),
        perYear: JSON.parse(perYear),
        recentGames: JSON.parse(recentGames),
        totalGamesPlayed,
        totalPlayersCount,
    };
};

export const useGameStats = (id) => {
    const [gameStats, setGameStats] = useState({});
    const [loading, setLoading] = useState(true);
    const isMounted = useIsMounted();
    useEffect(() => {
        async function fetchGame() {
            if (id && isMounted) {
                const stats = await fetchGameStats(id);
                setGameStats(stats);
                setLoading(false);
            }
        }
        fetchGame();
    }, [id]);
    return [gameStats, loading];
};

export const usePlayerStats = (id) => {
    const [playerStats, setPlayerStats] = useState({});
    const isMounted = useIsMounted();
    useEffect(() => {
        async function fetchStats() {
            if (id && isMounted) {
                const playerStats = await fetchPlayerStats(id);
                setPlayerStats(playerStats);
            }
        }
        fetchStats();
    }, [id]);
    return playerStats;
};

export const usePlayerInfo = (id) => {
    const [playerInfo, setPlayerInfo] = useState(null);
    const isMounted = useIsMounted();
    useEffect(() => {
        async function fetchInfo() {
            if (id && isMounted) {
                const playerInfo = await fetchPlayerInfo(id);
                setPlayerInfo(playerInfo);
            }
        }
        fetchInfo();
    }, [id]);
    return playerInfo;
};

export const useSummarizedStats = (id) => {
    const [summarizedStats, setSummarizedStats] = useState([]);
    useEffect(() => {
        let mounted = true;
        if (mounted) {
            const fetchSummarized = async () => {
                const summarizedStats = await fetchSummarizedStats(id);
                setSummarizedStats(summarizedStats);
            };
            fetchSummarized();
        }

        return () => {
            if (mounted) {
                mounted = false;
            }
        };
    }, []);

    return [summarizedStats, setSummarizedStats];
};

export const useRecentGames = (recent) => {
    const [game1, game1Loading] = useGameStats(recent[0].id);
    const [game2, game2Loading] = useGameStats(recent[1].id);

    const games = useMemo(() => {
        if (game1Loading || game2Loading) {
            return [];
        }
        return [game1, game2];
    }, [game1, game2, game1Loading, game2Loading]);

    return games;
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
