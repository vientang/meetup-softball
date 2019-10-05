import { useState, useEffect } from 'react';
import { fetchAllPlayers, fetchSummarizedStats, clearAllPlayers } from './apiService';

export const usePlayerInfo = (disabled) => {
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        let mounted = true;
        if (!disabled && players.length === 0) {
            const getAllPlayers = async () => {
                const allPlayers = await fetchAllPlayers({ limit: 500 });

                if (allPlayers && allPlayers.length > 0 && mounted) {
                    setPlayers(allPlayers);
                    clearAllPlayers();
                }
            };
            getAllPlayers();
        }

        return () => {
            if (mounted) {
                mounted = false;
            }
        };
    }, [disabled, players]);

    return {
        players: typeof players === 'string' ? JSON.parse(players) : players,
        setPlayers,
    };
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