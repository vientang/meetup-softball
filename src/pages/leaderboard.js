import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import isEqual from 'lodash/isEqual';
import { Layout, LeaderCard } from '../components';
import { fetchSummarizedStats } from '../utils/apiService';
import { getIdFromFilterParams, getAllYears } from '../utils/helpers';
import pageStyles from './pages.module.css';

const defaultFilters = {
    year: '2018',
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'CURRENT_FILTER':
            return { ...state, currentFilter: action.payload };
        case 'FILTERS':
            return { ...state, filters: action.payload };
        case 'LEADERS':
            return { ...state, leaders: action.payload };
        default:
            return state;
    }
};

const LeaderBoard = (props) => {
    const {
        data: {
            softballstats: {
                metadata,
                players: { items },
                summarized: { stats },
            },
        },
    } = props;
    const [{ currentFilter, filters, leaders }, dispatch] = useReducer(reducer, {
        currentFilter: 'year',
        filters: defaultFilters,
        leaders: JSON.parse(stats),
    });

    const handleFilterMouseEnter = (e) => {
        const filter = e.target.id;
        dispatch({ type: 'CURRENT_FILTER', payload: filter || currentFilter });
    };

    const handleFilterChange = async (params) => {
        const updatedFilters = {
            ...filters,
            [currentFilter]: params.key === 'all' ? '' : params.key,
        };

        if (!isEqual(filters, updatedFilters)) {
            const { field, month, year } = updatedFilters;
            const id = getIdFromFilterParams({ field, month, year });
            const stats = await fetchSummarizedStats(`_leaderboard${id}`);

            if (updatedFilters) {
                dispatch({ type: 'FILTERS', payload: updatedFilters });
                dispatch({ type: 'LEADERS', payload: stats });
            }
        }
    };

    const handleResetFilters = async () => {
        const filters = { ...defaultFilters };
        const { field, month, year } = filters;
        const summarizedId = getIdFromFilterParams({ field, month, year });
        const stats = await fetchSummarizedStats(summarizedId);
        dispatch({ type: 'FILTERS', payload: filters });
        dispatch({ type: 'LEADERS', payload: stats });
    };

    const filterBarOptions = {
        onFilterChange: handleFilterChange,
        onMouseEnter: handleFilterMouseEnter,
        onResetFilters: handleResetFilters,
        menu: {
            years: getAllYears(metadata),
        },
        filters,
    };

    return (
        <Layout filterBarOptions={filterBarOptions} loading={!leaders} players={items}>
            <div className={pageStyles.leaderBoardPage}>
                {leaders[0] &&
                    Object.keys(leaders[0]).map((stat) => (
                        <LeaderCard key={stat} leaders={leaders[0][stat]} stat={stat} />
                    ))}
            </div>
        </Layout>
    );
};

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
            summarized: getSummarizedStats(id: "_leaderboard_2018") {
                id
                stats
            }
            metadata: getMetaData(id: "_metadata") {
                id
                allYears
            }
        }
    }
`;

LeaderBoard.propTypes = {
    data: PropTypes.shape(),
};

LeaderBoard.defaultProps = {
    data: {},
};

export default LeaderBoard;
