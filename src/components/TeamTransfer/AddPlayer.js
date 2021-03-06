import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Icon, AutoComplete } from 'antd';
import { PlayerAvatar } from '../Player';
import styles from './transfer.module.css';
import { useMetaData } from '../../utils/hooks';

const { Option } = AutoComplete;

const AddPlayer = ({ currentPlayers, team, onAddPlayer }) => {
    const [searchMode, setSearchMode] = useState(false);
    const [playerMenu, setPlayerMenu] = useState([]);
    const [value, setValue] = useState('');

    const { activePlayers, inactivePlayers } = useMetaData();
    const allPlayers = useMemo(() => {
        return activePlayers
            .concat(inactivePlayers)
            .filter((p) => !currentPlayers.some((curr) => curr.id === p.id));
    }, [activePlayers, inactivePlayers, currentPlayers]);

    const handleChange = (value) => {
        setValue(value);
    };

    const handleSearchMode = () => {
        setSearchMode(!searchMode);
    };

    const handleSearch = (value) => {
        if (value && value.length >= 2) {
            setPlayerMenu(filterOptions(allPlayers, value));
        } else {
            setPlayerMenu([]);
        }
    };

    const handleAddPlayer = (value, instance) => {
        let playerToAdd = allPlayers.find((player) => player.id === instance.key) || {};
        playerToAdd = createPlayer({ ...playerToAdd, battingOrder: currentPlayers.length + 1 });
        onAddPlayer(playerToAdd, team);
        setSearchMode(false);
        setValue('');
    };

    const handleCloseMenu = () => {
        setSearchMode(false);
        setValue('');
    };

    const dropdownStyle = { boxShadow: '0px 3px 10px -5px #243b55' };
    const autoCompleteStyle = { fontSize: '0.75rem', width: '90%' };
    const iconStyle = { color: '#88c559', marginRight: '0.75rem' };

    return (
        <div className={styles.teamTransferListItem} onClick={handleSearchMode}>
            <div className={styles.teamTransferAddPlayer}>
                <Icon type="plus-circle" style={iconStyle} />
                {!searchMode ? (
                    <div className={styles.teamTransferAddPlayerPlaceholder}>add player</div>
                ) : (
                    <AutoComplete
                        autoFocus
                        dataSource={playerMenu}
                        dropdownMatchSelectWidth={false}
                        dropdownStyle={dropdownStyle}
                        onBlur={handleCloseMenu}
                        onChange={handleChange}
                        onSearch={handleSearch}
                        onSelect={handleAddPlayer}
                        open={searchMode && !!value}
                        size="small"
                        style={autoCompleteStyle}
                    >
                        <input type="text" className={styles.addPlayerInput} />
                    </AutoComplete>
                )}
            </div>
        </div>
    );
};

/**
 * Creates a player object in the shape needed for AdminStatsTable
 * @param {Object} player
 */
function createPlayer(player) {
    const { name, id, joined, profile, admin, photos, status, battingOrder } = player;
    return {
        admin,
        battingOrder,
        joined,
        id,
        name,
        photos,
        profile,
        status,
        singles: null,
        doubles: null,
        triples: null,
        bb: null,
        cs: null,
        hr: null,
        k: null,
        o: null,
        r: null,
        rbi: null,
        sac: null,
        sb: null,
    };
}

const playersMap = new Map();
export function filterOptions(players, value) {
    const char = value && value.length === 2 ? value[0].toLowerCase() : null;
    if (char && !playersMap.has(char)) {
        playersMap.set(
            char,
            players.filter((player) =>
                player.name ? player.name.toLowerCase()[0] === char : false,
            ),
        );
    }
    const playerOptions = playersMap.get(value[0]) || players;
    playerOptions.sort((a, b) => (a.gp < b.gp ? 1 : -1));

    return playerOptions
        .filter((player) =>
            player.name ? player.name.toLowerCase().includes(value.toLowerCase()) : false,
        )
        .map((player) => {
            const { id, name, photos } = player;
            return (
                <Option key={id} value={`${name}-${id}`} name={name} id={id}>
                    <PlayerAvatar
                        src={photos.thumb_link}
                        name={name}
                        style={{
                            marginRight: '0.5rem',
                            border: '1px solid #f7b639',
                        }}
                    />
                    {name}
                </Option>
            );
        });
}

AddPlayer.propTypes = {
    currentPlayers: PropTypes.arrayOf(PropTypes.shape()),
    onAddPlayer: PropTypes.func,
    team: PropTypes.string,
};

export default AddPlayer;
