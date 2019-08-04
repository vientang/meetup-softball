import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import get from 'lodash/get';
import { Link } from 'gatsby';
import { Avatar, Skeleton } from 'antd';
import { API, graphqlOperation, JS } from 'aws-amplify';
import dataProvider from '../utils/dataProvider';
import { NotFoundImage, StatsTable } from '../components';
import { getAllPlayerStats } from '../utils/apiService';
import { getDefaultSortedColumn, formatCellValue, sortHighToLow } from '../utils/helpers';
import { statPageCategories } from '../utils/constants';
import pageStyles from './pages.module.css';
import legacyData from '../../__mocks__/mockData';
// import legacyPlayerData from '../../__mocks__/mockData';
// import legacyGameData from '../../__mocks__/mockData';
import { convertLegacyPlayerData, convertLegacyGameData } from '../utils/convertLegacyData';
import { createGameStats, createPlayerStats, updatePlayerStats } from '../graphql/mutations';
import { getPlayerStats, listGameStatss, listPlayerStatss } from '../graphql/queries';

class Stats extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playerStats: [],
            sortedColumn: '',
        };
    }

    async componentDidMount() {
        // console.time('converting legacy data')
        // const playerdata = await convertLegacyPlayerData(legacyData);
        // const gamedata = await convertLegacyGameData(legacyData);
        // console.timeEnd('converting legacy data')
        // const dupes = uniqBy(playerdata, 'id');
        // console.log('legacy data', { 
        //     playerdata, 
        //     strData: JSON.stringify(playerdata), 
        //     gamedata,
        //     strGameData: JSON.stringify(gamedata) 
        // });
        // console.time('submit data');
        // slice legacy data
        // this.submitPlayerStats(playerdata);
        // this.submitGameStats(gamedata);
        // console.timeEnd('submit data');
    }

    componentDidUpdate(prevProps) {
        if (this.shouldUpdateStats(prevProps.gameData)) {
            const playerStats = getAllPlayerStats(this.props.gameData);
            this.updatePlayerStats(playerStats);
        }
    }

    /**
     * Update a players game log or create a new player
     * @param {Array} playerStats
     */
    submitPlayerStats = async (playerStats = []) => {
        playerStats.forEach(async (player) => {
            await API.graphql(
                graphqlOperation(createPlayerStats, {
                    input: {
                        ...player,
                        games: JSON.stringify(player.games),
                    },
                }),
            );
        });
    };

    submitGameStats = async (gameStats) => {
        gameStats.forEach(async (value) => {
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

        return (
            <Link to={`/player?id=${playerId}`} className={pageStyles.playerName}>
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
        const { gameData } = this.props;
        const { playerStats, sortedColumn } = this.state;

        if (gameData.length < 0) {
            return <NotFoundImage />;
        }

        if (playerStats.length === 0) {
            const skeletonConfig = { rows: 20, width: '1170px' };

            return (
                <div className={pageStyles.statsSection}>
                    <Skeleton active paragraph={skeletonConfig} title={false} />
                </div>
            );
        }

        const statsTableStyle = {
            height: 800,
        };

        return (
            <div className={pageStyles.statsSection}>
                <StatsTable
                    categories={statPageCategories}
                    cellRenderer={this.renderCell}
                    defaultSorted={getDefaultSortedColumn('gp', false)}
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

function getPlayerMetaData(playerStats, cellInfo) {
    const playerId = playerStats[cellInfo.index].id;
    const playerName = playerStats[cellInfo.index].name;
    const playerImg = get(playerStats[cellInfo.index], 'photos.thumb_link', '');
    return { playerId, playerName, playerImg };
}

Stats.propTypes = {
    gameData: PropTypes.arrayOf(PropTypes.shape),
};

Stats.defaultProps = {
    gameData: [],
};

export default dataProvider(Stats);
