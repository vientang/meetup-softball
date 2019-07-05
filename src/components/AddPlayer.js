import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { API, graphqlOperation } from 'aws-amplify';
import { Icon, AutoComplete } from 'antd';
import { listPlayerStatss } from '../graphql/queries';
import componentStyles from './components.module.css';

const { Option } = AutoComplete;

const AddPlayer = ({ allRsvpIds, listCount, listType, onAddPlayer }) => {
    const [searchMode, setSearchMode] = useState(false);
    const [allPlayers, setAllPlayers] = useState([]);
    const [playerMenu, setPlayerMenu] = useState([]);

    useEffect(() => {
        async function fetchData() {
            let allPlayersList = await API.graphql(graphqlOperation(listPlayerStatss));
            allPlayersList = allPlayersList.data.listPlayerStatss.items.filter((player) => {
                const playerFound = allRsvpIds.find(
                    (playerId) => playerId.toString() === player.id,
                );
                return !playerFound;
            });
            setAllPlayers(allPlayersList);
        }
        fetchData();
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
        <div className={componentStyles.teamTransferListItem} onClick={handleSearchMode}>
            <span className={componentStyles.teamTransferAddPlayer}>
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
                        <input type="text" className={componentStyles.addPlayerInput} />
                    </AutoComplete>
                )}
            </span>
        </div>
    );
};

/**
 * Change the background of the page when in search mode
 * @param {Object} listRef
 * @param {Boolean} searchMode
 */
function changeListTheme(searchMode) {
    if (searchMode) {
        document.body.style.setProperty('--transfer-list-background', 'rgba(0, 0, 0, 0.5)');
    } else {
        document.body.style.setProperty('--transfer-list-background', '#ffffff');
    }
}

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
