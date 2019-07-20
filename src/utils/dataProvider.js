import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { API, graphqlOperation } from 'aws-amplify';
import isEqual from 'lodash/isEqual';
import { listGameStatss, listPlayerStatss } from '../graphql/queries';
import Layout from '../components/Layout';
import FilterBar from '../components/FilterBar';
import styles from '../pages/pages.module.css';
import configuration from '../aws-exports';

API.configure(configuration);

const queryLimit = 1000;
const defaultFilter = '2013';
const defaultFilters = {
    year: '',
    month: '',
    field: '',
    batting: '',
};

// Store data outside of component context to prevent
// excessive network queries in the same app session
const dataMap = new Map();
const dataProvider = (Page) => {
    return class PageWithFilters extends Component {
        static propTypes = {
            location: PropTypes.shape(),
        };

        constructor(props) {
            super(props);
            this.state = {
                activeFilters: { ...defaultFilters, year: defaultFilter },
                currentFilter: 'year',
                fields: [''],
                filterTypes: ['year', 'month', 'field', 'batting'],
                gameStats: [],
                playerStats: [],
                years: [''],
            };
        }

        async componentDidMount() {
            this.mounted = true;
            const gameData = dataMap.get('gameData');
            const playerData = dataMap.get('playerData');
            if (gameData && playerData) {
                if (this.mounted) {
                    this.setState(() => ({
                        gameStats: gameData.data.listGameStatss.items,
                        playerStats: playerData.data.listPlayerStatss.items,
                        years: dataMap.get('years'),
                        fields: dataMap.get('fields'),
                    }));
                }
            } else {
                const gameStats = await API.graphql(
                    graphqlOperation(listGameStatss, {
                        filter: {
                            year: {
                                eq: defaultFilter,
                            },
                        },
                        limit: queryLimit,
                    }),
                );
                const playerStats = await API.graphql(
                    graphqlOperation(listPlayerStatss, {
                        limit: queryLimit,
                    }),
                );

                try {
                    const years = this.getFilterMenu(gameStats.data.listGameStatss.items, 'year');
                    const fields = this.getFilterMenu(gameStats.data.listGameStatss.items, 'field');

                    dataMap.set('gameData', gameStats);
                    dataMap.set('playerData', playerStats);
                    dataMap.set('years', years);
                    dataMap.set('fields', fields);

                    if (this.mounted) {
                        this.setState(() => ({
                            gameStats: gameStats.data.listGameStatss.items,
                            playerStats: playerStats.data.listPlayerStatss.items,
                            fields,
                            years,
                        }));
                    }
                } catch (error) {
                    throw new Error(`dataProvider: ${error}`);
                }
            }
        }

        componentWillUnmount() {
            this.mounted = false;
        }

        /**
         * Set query filters for graphql query or null to query for everything
         */
        setQueryFilters = (filterKeys, activeFilters) => {
            const queryFilters = filterKeys.reduce((filter, value) => {
                /* eslint-disable no-param-reassign */
                if (activeFilters[value]) {
                    filter[value] = {};
                    filter[value].eq = activeFilters[value];
                }
                return filter;
            }, {});
            return Object.values(queryFilters).length > 0 ? queryFilters : null;
        };

        setActiveFilters = (filterKeys, state) => {
            const activeFilters = filterKeys.reduce((filter, value) => {
                /* eslint-disable no-param-reassign */
                if (state.activeFilters[value]) {
                    filter[value] = {};
                    filter[value] = state.activeFilters[value];
                } else {
                    filter[value] = '';
                }
                return filter;
            }, {});
            return activeFilters;
        };

        /**
         * Game stats based on filter params
         * StatsTable
         * GameLog
         * BoxScore
         * @param filters
         */
        getGameStats = async (queryFilters) =>
            queryFilters
                ? API.graphql(graphqlOperation(listGameStatss, { filter: queryFilters }))
                : API.graphql(graphqlOperation(listGameStatss));

        /**
         * Player stats
         * PlayerCard
         * LeaderBoard
         * PlayerPreview
         * LeaderCards
         * PlayerInfo
         * PlayerGameLog
         */
        getPlayerStats = () => {};

        /**
         * FilterBar years menu
         */
        getFilterMenu = (gameStats = [], key) => {
            const storage = {};
            gameStats.forEach((game) => {
                if (!storage[game[key]]) {
                    storage[game[key]] = game[key];
                }
            });
            return Object.values(storage);
        };

        /**
         * LeaderBoard and LeaderCards
         */
        calculateLeaderStats = () => {};

        calculateAllPlayersStats = () => {};

        calculatePlayerStats = () => {};

        /**
         * Validate that we have gameStats before triggering
         * any user interactions like mouse enter or clicks
         */
        updateState = (value) => {
            if (this.state.gameStats.length > 0) {
                this.setState(() => value);
            }
        };

        /**
         * Update active filters from FilterBar selections
         */
        handleFilterChange = async ({ key }) => {
            const activeFilters = { ...this.state.activeFilters };

            if (key === 'all') {
                this.updateState({ activeFilters: defaultFilters });
            }

            activeFilters[this.state.currentFilter] = key;

            if (!isEqual(activeFilters, this.state.activeFilters)) {
                const filterKeys = Object.keys(activeFilters).filter(
                    (filter) => filter !== 'batting',
                );
                const queryFilters = this.setQueryFilters(filterKeys, activeFilters);
                const gameStats = await this.getGameStats(queryFilters);

                this.updateState({ activeFilters });
            }
        };

        /**
         * Detect the filter that will be selected
         * Use in handleFilterChange for optimizations
         */
        handleMouseEnter = (e) => {
            const currentFilter = e.target.id;

            if (currentFilter && currentFilter !== this.state.currentFilter) {
                this.updateState({ currentFilter });
            }
        };

        handleResetFilters = () => {
            const activeFilters = { ...defaultFilters, year: defaultFilter };
            this.updateState({ activeFilters });
        };

        renderFilterBar = () => {
            const { activeFilters, fields, filterTypes, playerStats, years } = this.state;

            return (
                <FilterBar
                    activeFilters={activeFilters}
                    allPlayers={playerStats}
                    fields={fields}
                    filterTypes={filterTypes}
                    years={years}
                    onResetFilters={this.handleResetFilters}
                    onFilterChange={this.handleFilterChange}
                    onMouseEnter={this.handleMouseEnter}
                />
            );
        };

        render() {
            const { activeFilters, gameStats, playerStats } = this.state;

            return (
                <Layout className={styles.pageLayout} filterBar={this.renderFilterBar()}>
                    <Page
                        allPlayers={playerStats}
                        filters={activeFilters}
                        gameData={gameStats}
                        location={this.props.location}
                    />
                </Layout>
            );
        }
    };
};

export default dataProvider;
