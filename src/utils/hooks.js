import React, { useState, useEffect } from 'react';
import { Link } from 'gatsby';
import { AutoComplete } from 'antd';
import { fetchAllPlayers, clearAllPlayers } from './apiService';

const { Option } = AutoComplete;

export const usePlayerInfo = (disabled) => {
    const [players, setPlayers] = useState(localStorage.getItem('players') || []);
    const [searchList, setSearchList] = useState([]);

    useEffect(() => {
        let mounted = true;
        if (!disabled && players.length === 0) {
            const getAllPlayers = async () => {
                const allPlayers = await fetchAllPlayers({ limit: 500 });

                if (allPlayers && allPlayers.length > 0 && mounted) {
                    const playersAsOptions = renderOptions(allPlayers);
                    setPlayers(allPlayers);
                    setSearchList(playersAsOptions);
                    localStorage.setItem('players', JSON.stringify(allPlayers));
                }
            };
            getAllPlayers();
        }
        clearAllPlayers();

        return () => {
            if (mounted) {
                mounted = false;
            }
        };
    }, [disabled, players]);

    return {
        players: typeof players === 'string' ? JSON.parse(players) : players,
        searchList,
        setSearchList,
        setPlayers,
    };
};

export function renderOptions(players) {
    return players.map((player) => {
        const { id, name } = player;
        return (
            <Option key={id} value={`${name}-${id}`} name={name} id={id}>
                <Link to={`/player?id=${id}`}>{name}</Link>
            </Option>
        );
    });
}
