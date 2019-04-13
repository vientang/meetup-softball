import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { Link } from 'gatsby';
import { Skeleton } from 'antd';
import { withFilterBar, NotFoundImage, StatsTable } from '../components';
import { Utils, apiService } from '../utils';
import { statPageCategories } from '../utils/constants';
import pageStyles from './pages.module.css';

const statsTableStyle = { height: 700, width: 1050, fontSize: 12 };
const skeletonConfig = { rows: 20, width: '100%' };
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

    updatePlayerStats = (playerStats) => {
        this.setState(() => ({ playerStats, noDataFound: playerStats.length < 1 }));
    };

    renderCell = (cellInfo) => {
        const { playerStats } = this.state;
        const cellValue = playerStats[cellInfo.index][cellInfo.column.id];
        const playerName = playerStats[cellInfo.index].name;
        if (cellValue === playerName) {
            const slug = playerName
                .split(' ')
                .join('_')
                .toLowerCase();
            return (
                <Link
                    to={`/player?name=${slug}`}
                    state={{
                        playerName,
                        playerStats: this.state.playerStats,
                    }}
                >
                    {playerName}
                </Link>
            );
        }

        return Utils.formatCellValue(cellValue);
    };

    render() {
        const { gameData, playerData } = this.props;
        const { playerStats, noDataFound } = this.state;

        if (noDataFound) {
            return <NotFoundImage />;
        }

        if (gameData.length === 0) {
            return <Skeleton active paragraph={skeletonConfig} title={false} />;
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
