import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import get from 'lodash/get';
import { Link } from 'gatsby';
import { Avatar, Skeleton } from 'antd';
import { withFilterBar, NotFoundImage, StatsTable } from '../components';
import { Utils, apiService } from '../utils';
import { statPageCategories } from '../utils/constants';
import pageStyles from './pages.module.css';

const statsTableStyle = {
    height: 800,
    width: 1148,
};

const skeletonConfig = { rows: 20, width: '1155px' };

class Stats extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playerStats: [],
        };
    }

    componentDidUpdate(prevProps) {
        let playerStats = [];
        if (this.shouldUpdateStats(prevProps.gameData)) {
            this.props.gameData.forEach((game) => {
                const updatedStats = apiService.filterPlayerStats(game);
                playerStats = Array.from(updatedStats.values());
            });
            this.updatePlayerStats(playerStats);
        }
        apiService.clearMasterList();
    }

    shouldUpdateStats = (prevGameData) =>
        prevGameData.length <= 0 || !isEqual(prevGameData, this.props.gameData);

    updatePlayerStats = (playerStats) => {
        this.setState(() => ({ playerStats }));
    };

    renderPlayerCell = (playerStats, cellInfo) => {
        const { playerId, playerName, playerImg } = getPlayerMetaData(playerStats, cellInfo);
        const slug = createSlug(playerName);

        // playerData contains name, games, profile, photos, etc.
        const playerData = getPlayerStats(this.props.allPlayers, playerId);

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
            : Utils.formatCellValue(cellValue);
    };

    render() {
        const { gameData, allPlayers } = this.props;
        const { playerStats } = this.state;

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
                    sortMethod={Utils.sortHighToLow}
                    stats={playerStats}
                    style={statsTableStyle}
                    showLegend
                />
            </div>
        );
    }
}

function getPlayerStats(playerStats, playerId) {
    if (!playerId) {
        return {};
    }
    return playerStats.find((player) => Number(player.meetupId) === playerId) || {};
}

function createSlug(name) {
    return name
        .split(' ')
        .join('_')
        .toLowerCase();
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
    const playerId = playerStats[cellInfo.index].meetupId;
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

export default withFilterBar(Stats);
