import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { Link, graphql } from 'gatsby';
import isEqual from 'lodash/isEqual';
import keyBy from 'lodash/keyBy';
import { Layout, PlayerAvatar, StatsTable } from '../components';
import {
    formatCellValue,
    getDefaultSortedColumn,
    getIdFromFilterParams,
    parsePhotosAndProfile,
    sortHighToLow,
} from '../utils/helpers';
import { statPageCategories } from '../utils/constants';
import pageStyles from './pages.module.css';
import { fetchSummarizedStats } from '../utils/apiService';

const defaultFilters = {
    year: '2018',
    month: '',
    field: '',
};

class Stats extends React.Component {
    constructor(props) {
        super(props);
        const {
            data: {
                softballstats: {
                    players: { items },
                    summarized: { stats },
                },
            },
        } = props;
        this.playersInfoMap = keyBy(items, 'id');
        this.state = {
            filters: defaultFilters,
            currentFilter: 'year',
            playerStats: this.mapPlayerPhotos(JSON.parse(stats), items),
            sortedColumn: '',
        };
    }

    handleColumnSort = (newSorted, column) => {
        this.setState(() => ({ sortedColumn: column.id }));
    };

    renderPlayerCell = (playerStats, cellInfo) => {
        const { playerId, playerName, playerImg } = getPlayerMetaData(playerStats, cellInfo);
        return (
            <Link to={`/player?id=${playerId}`} className={pageStyles.playerName}>
                <PlayerAvatar
                    image={playerImg}
                    name={playerName}
                    style={{ marginRight: '0.5rem', border: '1px solid #f7b639' }}
                />
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

    /**
     * Detect the filter that will be selected
     * Use in handleFilterChange for optimizations
     */
    handleFilterMouseEnter = (e) => {
        const currentFilter = e.target.id;

        if (currentFilter && currentFilter !== this.state.currentFilter) {
            this.setState(() => ({ currentFilter }));
        }
    };

    /**
     * Update active filters from FilterBar selections
     */
    handleFilterChange = async (params) => {
        const { currentFilter, filters } = this.state;
        const updatedFilters = {
            ...filters,
            [currentFilter]: params.key === 'all' ? '' : params.key,
        };

        if (!isEqual(filters, updatedFilters)) {
            const { field, month, year } = updatedFilters;
            const summarizedStatsId = getIdFromFilterParams({ field, month, year });
            const filteredStats = await fetchSummarizedStats(summarizedStatsId);

            this.setState(() => ({
                filters: updatedFilters,
                playerStats: this.mapPlayerPhotos(filteredStats),
            }));
        }
    };

    handleResetFilters = async () => {
        const filters = { ...defaultFilters };
        const { field, month, year } = filters;
        const summarizedId = getIdFromFilterParams({ field, month, year });
        const stats = await fetchSummarizedStats(summarizedId);
        this.setState(() => ({
            playerStats: this.mapPlayerPhotos(stats),
            filters,
        }));
    };

    mapPlayerPhotos = (stats) =>
        stats.map((player) => {
            const playerWithPhotos = { ...player };
            playerWithPhotos.photos = parsePhotosAndProfile(this.playersInfoMap[player.id]).photos;
            return playerWithPhotos;
        });

    render() {
        const {
            data: {
                softballstats: {
                    players: { items },
                },
            },
        } = this.props;

        const { filters, playerStats, sortedColumn } = this.state;

        const statsTableStyle = {
            height: 800,
        };

        const filterBarOptions = {
            disabled: playerStats.length === 0,
            onFilterChange: this.handleFilterChange,
            onMouseEnter: this.handleFilterMouseEnter,
            onResetFilters: this.handleResetFilters,
            filters,
        };

        return (
            <Layout
                filterBarOptions={filterBarOptions}
                loading={playerStats.length === 0}
                players={items}
            >
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
            </Layout>
        );
    }
}

function getPlayerMetaData(playerStats, cellInfo) {
    const playerId = playerStats[cellInfo.index].id;
    const playerName = playerStats[cellInfo.index].name;
    const playerImg = get(playerStats[cellInfo.index], 'photos.thumb_link', '');
    return { playerId, playerName, playerImg };
}

// graphql aliases https://graphql.org/learn/queries/#aliases
export const query = graphql`
    query {
        softballstats {
            players: listPlayerss(limit: 500) {
                items {
                    id
                    name
                    photos
                }
            }
            summarized: getSummarizedStats(id: "_2018") {
                id
                stats
            }
        }
    }
`;

Stats.propTypes = {
    data: PropTypes.shape(),
};

Stats.defaultProps = {
    data: {},
};

export default Stats;
