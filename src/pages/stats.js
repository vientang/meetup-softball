import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import get from 'lodash/get';
import uniqBy from 'lodash/uniqBy';
import { Link } from 'gatsby';
import { Avatar, Skeleton } from 'antd';
import { API, graphqlOperation } from 'aws-amplify';
import dataProvider from '../utils/dataProvider';
import { NotFoundImage, StatsTable } from '../components';
import { getAllPlayerStats } from '../utils/apiService';
import { createSlug, formatCellValue, sortHighToLow } from '../utils/helpers';
import { statPageCategories } from '../utils/constants';
import pageStyles from './pages.module.css';
import legacyData from '../../__mocks__/mockData';
import { convertLegacyPlayerData, convertLegacyGameData } from '../utils/convertLegacyData';

import { createGameStats, createPlayerStats, updatePlayerStats } from '../graphql/mutations';
import { getPlayerStats, listGameStatss, listPlayerStatss } from '../graphql/queries';

const statsTableStyle = {
    height: 800,
    width: 1170,
};

const skeletonConfig = { rows: 20, width: '1165px' };

const defaultSorted = [
    {
        id: 'gp',
        desc: false,
    },
];

class Stats extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playerStats: [],
            sortedColumn: '',
        };
    }

    // async componentDidMount() {
    //     const playerdata = await convertLegacyPlayerData(legacyData);
    //     const gamedata = await convertLegacyGameData(legacyData);
    //     const uniqPlayers = uniqBy(playerdata, 'id');
    //     console.log('player data', { uniqPlayers, gamedata, playerdata });
    //     console.time('submit data');
    //     this.submitPlayerStats(playerdata);
    //     this.submitGameStats(gamedata);
    //     console.timeEnd('submit data');
    // }

    componentDidUpdate(prevProps) {
        if (this.shouldUpdateStats(prevProps.gameData)) {
            const playerStats = getAllPlayerStats(this.props.gameData);
            this.updatePlayerStats(playerStats);
        }
    }

    fetchExistingPlayer = async (player) => {
        const existingPlayer = await API.graphql(
            graphqlOperation(getPlayerStats, { id: player.id }),
        );
        return get(existingPlayer, 'data.getPlayerStats', null);
    };

    /**
     * Update a players game log or create a new player
     * @param {Array} playerStats
     */
    submitPlayerStats = async (playerStats = []) => {
        playerStats.forEach(async (player) => {
            const existingPlayer = await this.fetchExistingPlayer(player);

            if (existingPlayer) {
                // player already exists in database
                const { id, games } = existingPlayer;
                const parsedGames = JSON.parse(games);
                const updatedGames = [...player.games, ...parsedGames];

                await API.graphql(
                    graphqlOperation(updatePlayerStats, {
                        input: { id },
                        games: JSON.stringify(updatedGames),
                    }),
                );
            } else {
                // player does not yet exist in database
                const newPlayer = {
                    ...player,
                    games: JSON.stringify(player.games),
                };

                await API.graphql(
                    graphqlOperation(createPlayerStats, {
                        input: newPlayer,
                    }),
                );
            }
        });
    };

    submitGameStats = async (gameStats) => {
        gameStats.forEach(async (value, key, map) => {
            const game = { ...value };
            game.winners = JSON.stringify(value.winners);
            game.losers = JSON.stringify(value.losers);
            await API.graphql(graphqlOperation(createGameStats, { input: game }));
        });
    };

    shouldUpdateStats = (prevGameData) =>
        prevGameData.length <= 0 || !isEqual(prevGameData, this.props.gameData);

    updatePlayerStats = (playerStats) => {
        this.setState(() => ({ playerStats }));
    };

    handleColumnSort = (newSorted, column) => {
        this.setState(() => ({ sortedColumn: column.id }));
    };

    renderPlayerCell = (playerStats, cellInfo) => {
        const { playerId, playerName, playerImg } = getPlayerMetaData(playerStats, cellInfo);

        const slug = createSlug(playerName);

        // playerData contains name, games, profile, photos, etc.
        const playerData = findPlayer(this.props.allPlayers, playerId);

        return (
            <Link
                to={`/player?name=${slug}`}
                className={pageStyles.playerName}
                state={{ player: playerData }}
            >
                <PlayerAvatar image={playerImg} name={playerName} />
                {playerName}
            </Link>
        );
    };

    renderCell = (cellInfo) => {
        const { playerStats } = this.state;

        const playerName = playerStats[cellInfo.index].name;
        const cellValue = playerStats[cellInfo.index][cellInfo.column.id];

        return cellValue === playerName
            ? this.renderPlayerCell(playerStats, cellInfo)
            : formatCellValue(cellValue);
    };

    render() {
        const { gameData, allPlayers } = this.props;
        const { playerStats, sortedColumn } = this.state;

        if (gameData.length < 0) {
            return <NotFoundImage />;
        }

        if (playerStats.length === 0) {
            return (
                <div className={pageStyles.statsSection}>
                    <Skeleton active paragraph={skeletonConfig} title={false} />
                </div>
            );
        }

        return (
            <div className={pageStyles.statsSection}>
                <StatsTable
                    categories={statPageCategories}
                    cellRenderer={this.renderCell}
                    defaultSorted={defaultSorted}
                    onSortedChange={this.handleColumnSort}
                    sortedColumn={sortedColumn}
                    sortMethod={sortHighToLow}
                    stats={playerStats}
                    style={statsTableStyle}
                    showLegend
                />
            </div>
        );
    }
}

/* eslint-disable react/prop-types */
function PlayerAvatar({ image, name }) {
    const avatarStyle = { marginRight: '0.5rem' };
    const avatarProps = { style: avatarStyle, alt: name };
    if (image) {
        avatarProps.src = image;
    } else {
        avatarProps.icon = 'user';
    }

    return <Avatar {...avatarProps} shape="square" />;
}

function findPlayer(playerStats, playerId) {
    if (!playerId) {
        return {};
    }
    return playerStats.find((player) => Number(player.id) === playerId) || {};
}

function getPlayerMetaData(playerStats, cellInfo) {
    const playerId = playerStats[cellInfo.index].id;
    const playerName = playerStats[cellInfo.index].name;
    const playerImg = get(playerStats[cellInfo.index], 'photos.thumb_link', '');
    return { playerId, playerName, playerImg };
}

Stats.propTypes = {
    gameData: PropTypes.arrayOf(PropTypes.shape),
    allPlayers: PropTypes.arrayOf(PropTypes.shape),
};

Stats.defaultProps = {
    gameData: [],
    allPlayers: [],
};

export default dataProvider(Stats);
