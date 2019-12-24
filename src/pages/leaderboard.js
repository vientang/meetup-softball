import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import isEqual from 'lodash/isEqual';
import { message } from 'antd';
import { Layout, LeaderCard } from '../components';
import { fetchSummarizedStats } from '../utils/apiService';
import { buildFilterMenu, getIdFromFilterParams } from '../utils/helpers';
import pageStyles from './pages.module.css';

const defaultFilters = {
    year: '2019',
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

            if (!stats) {
                message.error(`Try again. No games were played at ${field} in ${month}/${year}`);
            } else {
                dispatch({ type: 'FILTERS', payload: updatedFilters });
                dispatch({ type: 'LEADERS', payload: stats });
            }
        }
    };

    const handleResetFilters = async () => {
        const { field, month, year } = defaultFilters;
        const id = getIdFromFilterParams({ field, month, year });
        const stats = await fetchSummarizedStats(`_leaderboard${id}`);

        dispatch({ type: 'FILTERS', payload: defaultFilters });
        dispatch({ type: 'LEADERS', payload: stats });
    };

    const filterBarOptions = {
        onFilterChange: handleFilterChange,
        onMouseEnter: handleFilterMouseEnter,
        onResetFilters: handleResetFilters,
        menu: buildFilterMenu(filters, metadata),
        filters,
    };

    return (
        <Layout
            filterBarOptions={filterBarOptions}
            loading={!leaders}
            players={JSON.parse(metadata.activePlayers)}
            inactivePlayers={JSON.parse(metadata.inactivePlayers)}
        >
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
            summarized: getSummarizedStats(id: "_leaderboard_2018") {
                id
                stats
            }
            metadata: getMetaData(id: "_metadata") {
                id
                activePlayers
                allYears
                inactivePlayers
                perYear
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
