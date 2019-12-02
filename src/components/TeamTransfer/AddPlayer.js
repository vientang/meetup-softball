import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Icon, AutoComplete } from 'antd';
import { fetchAllPlayers } from '../../utils/apiService';
import styles from './transfer.module.css';

const { Option } = AutoComplete;

const AddPlayer = ({ allRsvpIds, listCount, listType, onAddPlayer }) => {
    const [searchMode, setSearchMode] = useState(false);
    const [allPlayers, setAllPlayers] = useState([]);
    const [playerMenu, setPlayerMenu] = useState([]);

    useEffect(() => {
        let isMounted = true;

        // async function fetchData() {
        //     if (isMounted) {
        //         let allPlayersList = await fetchAllPlayers();
        //         allPlayersList = allPlayersList.filter((player) => {
        //             const playerFound = allRsvpIds.find(
        //                 (playerId) => playerId.toString() === player.id,
        //             );
        //             return !playerFound;
        //         });
        //         setAllPlayers(allPlayersList);
        //     }
        // }

        // fetchData();
        return () => {
            isMounted = false;
        };
    }, [listCount]);

    const handleSearchMode = async () => {
        await setSearchMode(true);
    };

    const handleSearch = (value) => {
        const playerNames = allPlayers
            .filter((player) => player.name.toLowerCase().includes(value.toLowerCase()))
            .map((player) => (
                <Option key={player.id} value={player.name}>
                    {player.name}
                </Option>
            ));
        setPlayerMenu(playerNames);
    };

    const handleAddPlayer = (value, instance) => {
        let playerToAdd = allPlayers.find((player) => player.id === instance.key) || {};
        playerToAdd = createPlayer({ ...playerToAdd, battingOrder: listCount + 1 });
        onAddPlayer(playerToAdd, listType);
        setSearchMode(false);
    };

    const handleCloseMenu = () => {
        setSearchMode(false);
    };

    const autoCompleteStyle = { fontSize: 12, width: '90%' };
    const iconStyle = { color: '#88c559', marginRight: '0.3rem' };

    return (
        <div className={styles.teamTransferListItem} onClick={handleSearchMode}>
            <span className={styles.teamTransferAddPlayer}>
                <Icon type="plus-circle" style={iconStyle} />
                {!searchMode ? (
                    'add player'
                ) : (
                    <AutoComplete
                        autoFocus
                        dataSource={playerMenu}
                        dropdownMatchSelectWidth={false}
                        onBlur={handleCloseMenu}
                        onSearch={handleSearch}
                        onSelect={handleAddPlayer}
                        size="small"
                        style={autoCompleteStyle}
                    >
                        <input type="text" className={styles.addPlayerInput} />
                    </AutoComplete>
                )}
            </span>
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

AddPlayer.propTypes = {
    allRsvpIds: PropTypes.arrayOf(PropTypes.number),
    listType: PropTypes.string,
    onAddPlayer: PropTypes.func,
    listCount: PropTypes.number,
};

AddPlayer.defaultProps = {
    allRsvpIds: [],
};

export default AddPlayer;
