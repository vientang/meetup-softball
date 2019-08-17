import React from 'react';
import get from 'lodash/get';
import { Link } from 'gatsby';
import { Avatar, Skeleton } from 'antd';
import { API, graphqlOperation } from 'aws-amplify';
import { FilterBar, Layout, StatsTable } from '../components';
import { getAllPlayerStats } from '../utils/apiService';
import { getDefaultSortedColumn, formatCellValue, sortHighToLow } from '../utils/helpers';
import { statPageCategories } from '../utils/constants';
import pageStyles from './pages.module.css';
// import gamedata from '../../__mocks__/GameStats.json';
import { convertLegacyPlayerData, convertLegacyGameData } from '../utils/convertLegacyData';
import { createGameStats, createPlayerStats, updatePlayerStats } from '../graphql/mutations';
import { getPlayerStats, listGameStatss, listPlayerStatss } from '../graphql/queries';

const defaultFilters = {
    year: '2018',
    month: '',
    field: '',
};
class Stats extends React.Component {
    games = [];

    constructor(props) {
        super(props);
        this.state = {
            filters: {
                year: '2018',
                month: '',
                field: '',
            },
            currentFilter: 'year',
            playerStats: [],
            sortedColumn: '',
        };
    }

    async componentDidMount() {
        const summarizedStats = localStorage.getItem('allGames');
        if (summarizedStats) {
            this.updateState({ playerStats: JSON.parse(summarizedStats) });
        } else {
            this.mounted = true;
            if (this.mounted) {
                const allGames = await this.fetchAllGames({
                    limit: 50,
                });
                try {
                    const playerStats = getAllPlayerStats(allGames);
                    localStorage.setItem('allGames', JSON.stringify(playerStats));
                    this.updateState({ playerStats });
                } catch (error) {
                    throw new Error(error);
                }
            }
        }

        // const playerdata = await convertLegacyPlayerData(legacyData);
        // const gamedata = await convertLegacyGameData(legacyData);
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

    async componentDidUpdate() {
        const allGames = localStorage.getItem('allGames');
        if (!this.state.playerStats.length) {
            this.updateState({ playerStats: JSON.parse(allGames) });
        }
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    fetchAllGames = async (queryParams = {}) => {
        const games = await API.graphql(graphqlOperation(listGameStatss, queryParams));
        const { items, nextToken } = games.data.listGameStatss;
        this.games.push(...items);
        if (nextToken) {
            const queries = { ...queryParams };
            queries.nextToken = nextToken;
            await this.fetchAllGames(queries);
        }

        return this.games;
    };

    updateState = (newState) => {
        this.setState(() => newState);
    };

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

    handleColumnSort = (newSorted, column) => {
        this.updateState({ sortedColumn: column.id });
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

    setQueryFilters = (filters) => {
        return Object.keys(filters).reduce((queryFilters, key) => {
            if (filters[key]) {
                const queries = { ...queryFilters };
                queries[key] = { eq: filters[key] };
            }
            return queryFilters;
        }, {});
    };

    /**
     * Update active filters from FilterBar selections
     */
    handleFilterChange = async (params) => {
        // const { currentFilter } = this.state;
        // const filters = {
        //     ...this.state.filters,
        //     [currentFilter]: params.key === 'all' ? '' : params.key,
        // };
        // this.games = [];
        // const allGames = JSON.parse(localStorage.getItem('allGames'));
        // const allGames = await this.fetchAllGames({
        //     filter: this.setQueryFilters(filters),
        //     limit: 100,
        // });
        // try {
        //     this.updateState({ filters, playerStats: getAllPlayerStats(summarizedStats) });
        // } catch (error) {
        //     throw new Error(error);
        // }
    };

    /**
     * Detect the filter that will be selected
     * Use in handleFilterChange for optimizations
     */
    handleCurrentFilter = (e) => {
        const currentFilter = e.target.id;
        if (currentFilter && currentFilter !== this.state.currentFilter) {
            this.updateState({ currentFilter });
        }
    };

    handleResetFilters = () => {
        this.updateState({ filters: { ...defaultFilters } });
    };

    render() {
        const { filters, playerStats, sortedColumn } = this.state;

        if (playerStats.length === 0) {
            return (
                <Layout className={pageStyles.pageLayout}>
                    <Skeleton active paragraph={{ rows: 20, width: '1170px' }} title={false} />
                </Layout>
            );
        }

        const statsTableStyle = {
            height: 800,
        };

        return (
            <Layout
                className={pageStyles.pageLayout}
                filterBar={
                    <FilterBar
                        filters={filters}
                        onFilterChange={this.handleFilterChange}
                        onMouseEnter={this.handleCurrentFilter}
                        onResetFilters={this.handleResetFilters}
                    />
                }
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

/* eslint-disable react/prop-types */
function PlayerAvatar({ image, name }) {
    const avatarStyle = {
        marginRight: '0.5rem',
        border: '1px solid #f7b639',
        objectFit: 'cover',
        objectPosition: '100% 0',
    };
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

export default Stats;
