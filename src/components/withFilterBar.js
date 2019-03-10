import React, { Component } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { listGameStatss, listPlayerStatss } from '../graphql/queries';
import Layout from './Layout';
import FilterBar from './FilterBar';
import styles from '../pages/pages.module.css';

const defaultFilter = '2019';

const withFilterBar = (Page) => {
    // Store data outside of component context to prevent
    // excessive network queries in the same app session
    const dataMap = new Map();
    return class PageWithFilters extends Component {
        constructor(props) {
            super(props);
            this.state = {
                activeFilters: {
                    year: defaultFilter,
                    month: '',
                    field: '',
                    tournament: '',
                    batting: '',
                },
                currentFilter: '',
                fields: [''],
                filterTypes: ['year', 'month', 'field', 'tournament', 'batting'],
                gameStats: [],
                gender: 'All',
                playerStats: [],
                tournaments: [''],
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
                        tournaments: dataMap.get('tournaments'),
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
                    }),
                );
                const playerStats = await API.graphql(graphqlOperation(listPlayerStatss));

                try {
                    const years = this.getFilterMenu(gameStats.data.listGameStatss.items, 'year');
                    const fields = this.getFilterMenu(gameStats.data.listGameStatss.items, 'field');
                    const tournaments = this.getFilterMenu(
                        gameStats.data.listGameStatss.items,
                        'tournamentName',
                    );
                    dataMap.set('gameData', gameStats);
                    dataMap.set('playerData', playerStats);
                    dataMap.set('years', years);
                    dataMap.set('fields', fields);
                    dataMap.set('tournaments', tournaments);

                    if (this.mounted) {
                        this.setState(() => ({
                            gameStats: gameStats.data.listGameStatss.items,
                            playerStats: playerStats.data.listPlayerStatss.items,
                            fields,
                            years,
                            tournaments,
                        }));
                    }
                } catch (error) {
                    throw new Error(`withFilterBar: ${error}`);
                }
            }
        }

        componentWillUnmount() {
            this.mounted = false;
        }

        /**
         * Game stats based on filter params
         * StatsTable
         * GameLog
         * BoxScore
         * @param filters
         */
        getGameStats = () => {};

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

        /**
         * PlayerCard and PlayerPreview
         */
        calculatePlayerCareerStats = () => {};

        calculatePlayerStats = () => {};

        handleFilterChange = ({ key }) => {
            this.setState((prevState) => {
                const currState = { ...prevState };
                currState.activeFilters[prevState.currentFilter] = key === 'all' ? '' : key;

                return {
                    activeFilters: currState.activeFilters,
                };
            });
        };

        /**
         * Validate that we have gameStats before triggering
         * any user interactions like mouse enter or clicks
         */
        updateState = (value) => {
            if (this.state.gameStats.length > 0) {
                this.setState(() => value);
            }
        };

        handleGenderSelection = (e) => {
            const gender = e.target.id;
            this.updateState({ gender });
        };

        handleMouseEnter = (e) => {
            const currentFilter = e.target.id;
            this.updateState({ currentFilter });
        };

        handleResetFilters = () => {
            const activeFilters = {
                year: defaultFilter,
                month: '',
                field: '',
                tournament: '',
                batting: '',
            };
            this.updateState({ activeFilters });
        };

        render() {
            const {
                activeFilters,
                fields,
                filterTypes,
                gameStats,
                gender,
                playerStats,
                tournaments,
                years,
            } = this.state;

            return (
                <>
                    <Layout className={styles.adminPage}>
                        <FilterBar
                            activeFilters={activeFilters}
                            fields={fields}
                            filterTypes={filterTypes}
                            gender={gender}
                            tournaments={tournaments}
                            years={years}
                            onResetFilters={this.handleResetFilters}
                            onFilterChange={this.handleFilterChange}
                            onGenderSelection={this.handleGenderSelection}
                            onMouseEnter={this.handleMouseEnter}
                        />
                        <Page gameData={gameStats} playerData={playerStats} />
                    </Layout>
                </>
            );
        }
    };
};

export default withFilterBar;
