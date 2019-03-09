import React, { Component } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { listGameStatss } from '../graphql/queries';
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
                playerStats: [],
                tournaments: ['MLK'],
                years: ['2019', '2018', '2017', '2016', '2015', '2014'],
            };
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
            const { activeFilters, fields, filterTypes, tournaments, years } = this.state;

            return (
                <>
                    <Layout className={styles.adminPage}>
                        <FilterBar
                            activeFilters={activeFilters}
                            fields={fields}
                            filterTypes={filterTypes}
                            tournaments={tournaments}
                            years={years}
                            onResetFilters={this.handleResetFilters}
                            onFilterChange={this.handleFilterChange}
                            onMouseEnter={this.handleMouseEnter}
                        />
                        <Page />
                    </Layout>
                </>
            );
        }
    };
};

export default withFilterBar;
