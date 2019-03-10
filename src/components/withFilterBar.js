import React, { Component } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { listGameStatss, listPlayerStatss } from '../graphql/queries';
import Layout from './Layout';
import FilterBar from './FilterBar';
import styles from '../pages/pages.module.css';

const defaultFilter = '2019';

const withFilterBar = (Page) => {
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
                fields: ['West Sunset', 'Parkside', 'Westlake'],
                filterTypes: ['year', 'month', 'field', 'tournament', 'batting'],
                gameStats: [],
                gender: 'All',
                playerStats: [],
                tournaments: ['MLK'],
                years: ['2019', '2018', '2017', '2016', '2015', '2014'],
            };
        }

        async componentDidMount() {
            this.mounted = true;
            const gameStats = await API.graphql(
                graphqlOperation(listGameStatss, {
                    filter: {
                        year: {
                            eq: defaultFilter,
                        },
                    },
                }),
            );
            // const playerStats = await API.graphql(graphqlOperation(listPlayerStatss));

            try {
                if (this.mounted) {
                    this.setState(() => ({
                        gameStats: gameStats.data.listGameStatss.items,
                    }));
                }
            } catch (error) {
                throw new Error(`withFilterBar: ${error}`);
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
         * FilterBar fields menu
         */
        getAllFields = () => {};

        /**
         * FilterBar years menu
         */
        getAllYears = () => {};

        /**
         * FilterBar tournaments menu
         */
        getAllTournaments = () => {};

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

        handleGenderSelection = (e) => {
            const gender = e.target.id;
            this.setState(() => ({ gender }));
        };

        handleMouseEnter = (e) => {
            const currentFilter = e.target.id;
            this.setState(() => ({ currentFilter }));
        };

        handleResetFilters = () => {
            this.setState(() => {
                return {
                    activeFilters: {
                        year: defaultFilter,
                        month: '',
                        field: '',
                        tournament: '',
                        batting: '',
                    },
                };
            });
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
