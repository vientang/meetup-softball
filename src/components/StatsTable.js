import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import ErrorBoundary from './ErrorBoundary';
import StatsLegend from './StatsLegend';
import { defaultStatCategories } from '../utils/constants';
import componentStyles from './components.module.css';
import 'react-table/react-table.css';

const formatHeaderLabel = (category) => {
    switch (category) {
        case 'singles':
            return '1B';
        case 'doubles':
            return '2B';
        case 'triples':
            return '3B';
        case 'player':
            return 'PLAYER';
        case 'w':
            return 'WIN %';
        case 'battingOrder':
            return '';
        case '':
            return '';
        default:
            return category.toUpperCase();
    }
};

const formatColumnWidth = (params) => {
    const { category, lastColumn } = params;
    const scrollBarOffset = 15;
    const rateCategories = ['avg', 'rc', 'obp', 'ops', 'slg', 'woba'];
    if (rateCategories.includes(category)) {
        return lastColumn ? 58 + scrollBarOffset : 50;
    }
    switch (category) {
        case 'player':
            return 150;
        case 'w':
            return 75;
        case '':
            return 150;
        default:
            return 45;
    }
};

const formatHeaderStyle = (params) => {
    const { category, lastColumn } = params;
    const headerStyle = {
        background: '#243B55',
        color: 'white',
        padding: '0.5rem',
        textAlign: 'right',
        letterSpacing: '1px',
    };
    if (category === 'player') {
        headerStyle.textAlign = 'left';
    }
    if (lastColumn) {
        headerStyle.textAlign = 'center';
        headerStyle.paddingRight = 25;
    }
    return headerStyle;
};

const formatCellStyle = (params) => {
    const { category, lastColumn } = params;
    const cellStyle = {
        textAlign: category === 'player' ? 'left' : 'right',
        color: '#555555',
        padding: '0.5rem',
        borderRight: 0,
    };
    if (lastColumn) {
        cellStyle.paddingRight = 25;
    }
    return cellStyle;
};

const renderColumns = (params) => {
    const { categories, cellRenderer, sortMethod } = params;

    const columns = categories.map((category, i) => {
        const lastColumn = categories.length - 1 === i;
        const header = formatHeaderLabel(category);
        const width = formatColumnWidth({ category, lastColumn });
        const headerStyle = formatHeaderStyle({ category, lastColumn });
        const cellStyle = formatCellStyle({ category, lastColumn });
        return {
            Header: header,
            Cell: cellRenderer,
            accessor: category === 'player' ? 'name' : category,
            resizable: false,
            style: cellStyle,
            headerStyle,
            sortMethod,
            width,
        };
    });
    return columns;
};

const StatsTable = (props) => {
    const { stats, showPagination, style } = props;
    if (!stats || stats.length < 1) {
        return null;
    }

    return (
        <div className={componentStyles.statsTable}>
            <ErrorBoundary>
                <ReactTable
                    data={stats}
                    className="-striped -highlight"
                    columns={renderColumns(props)}
                    defaultPageSize={stats.length}
                    showPaginationBottom={showPagination}
                    style={style}
                />
                <StatsLegend />

            </ErrorBoundary>
        </div>
    );
};

StatsTable.propTypes = {
    categories: PropTypes.arrayOf(PropTypes.string),
    cellRenderer: PropTypes.func,
    stats: PropTypes.arrayOf(PropTypes.object),
    showPagination: PropTypes.bool,
    sortMethod: PropTypes.func,
    style: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
};

StatsTable.defaultProps = {
    categories: defaultStatCategories,
    stats: [],
    showPagination: false,
};

export default StatsTable;
