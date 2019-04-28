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
    width: 1155,
};

const skeletonConfig = { rows: 20, width: '1155px' };
class Stats extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playerStats: [],
            noDataFound: false,
        };
    }

    componentDidUpdate(prevProps) {
        let playerStats = [];
        const receivedNewStats = !isEqual(prevProps.gameData, this.props.gameData);
        if (prevProps.gameData.length <= 0 || receivedNewStats) {
            this.props.gameData.forEach((game) => {
                const updatedStats = apiService.filterPlayerStats(game);
                playerStats = Array.from(updatedStats.values());
            });
            this.updatePlayerStats(playerStats);
        }

        apiService.clearMasterList();
    }

    getPlayerStats = (playerStats, playerId) => {
        return playerId ? playerStats.find((player) => player.meetupId === playerId) : {};
    };

    updatePlayerStats = (playerStats) => {
        this.setState(() => ({ playerStats, noDataFound: playerStats.length < 1 }));
    };

    renderPlayerCell = (playerStats, cellInfo) => {
        const playerName = playerStats[cellInfo.index].name;
        const playerId = playerStats[cellInfo.index].meetupId;
        const playerImg = get(playerStats[cellInfo.index], 'photos.thumb_link', '');
        const avatarStyle = { marginRight: '0.5rem' };
        const stats = this.getPlayerStats(playerStats, playerId);

        const slug = playerName
            .split(' ')
            .join('_')
            .toLowerCase();

        return (
            <Link
                to={`/player?name=${slug}`}
                className={pageStyles.playerName}
                state={{
                    playerId,
                    playerName,
                    playerStats: stats,
                }}
            >
                {playerImg ? (
                    <Avatar src={playerImg} style={avatarStyle} alt={playerName} shape="square" />
                ) : (
                    <Avatar icon="user" style={avatarStyle} alt={playerName} shape="square" />
                )}
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
        const { gameData, playerData } = this.props;
        const { playerStats, noDataFound } = this.state;

        if (noDataFound) {
            return <NotFoundImage />;
        }

        if (gameData.length === 0) {
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
                    stats={playerStats}
                    sortMethod={Utils.sortHighToLow}
                    style={statsTableStyle}
                />
                <div className={pageStyles.playerPreview}>
                    <h2>Player of the month</h2>
                </div>
            </div>
        );
    }
}

Stats.propTypes = {
    gameData: PropTypes.arrayOf(PropTypes.shape),
    playerData: PropTypes.arrayOf(PropTypes.shape),
};

Stats.defaultProps = {
    gameData: [],
    playerData: [],
};

export default withFilterBar(Stats);
