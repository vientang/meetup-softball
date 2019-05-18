import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import ErrorBoundary from './ErrorBoundary';
import StatsLegend from './StatsLegend';
import { defaultStatCategories } from '../utils/constants';
import componentStyles from './components.module.css';
import 'react-table/react-table.css';

const StatsTable = (props) => {
    const { onSortedChange, stats, showLegend, showPagination, striped, style } = props;

    const statsTableStyle = {
        fontSize: 12,
        boxShadow: '0px 0px 20px -15px #243b55',
        ...style,
    };
    const statsLegendStyle = {
        width: style.width,
    };

    if (!stats || stats.length < 1) {
        return null;
    }

    return (
        <div className={componentStyles.statsTable}>
            <ErrorBoundary>
                <ReactTable
                    data={stats}
                    className={`-${striped} -highlight`}
                    columns={renderColumns(props)}
                    defaultPageSize={stats.length}
                    onSortedChange={onSortedChange}
                    showPaginationBottom={showPagination}
                    style={statsTableStyle}
                />
                {showLegend && <StatsLegend style={statsLegendStyle} />}
            </ErrorBoundary>
        </div>
    );
};

function renderColumns(props) {
    const { categories, cellRenderer, sortMethod } = props;

    const columns = categories.map((category, i) => {
        const lastColumn = categories.length - 1 === i;
        const header = formatHeaderLabel(category);
        const width = formatColumnWidth({ category, lastColumn });
        const headerStyle = formatHeaderStyle({ category, lastColumn });
        const cellStyle = formatCellStyle({ ...props, category, lastColumn });

        return {
            Header: header,
            Cell: cellRenderer,
            accessor: category === 'player' ? 'name' : category,
            resizable: false,
            headerClassName: componentStyles.statHeaderCell,
            className: componentStyles.statCell,
            style: cellStyle,
            headerStyle,
            sortMethod,
            width,
        };
    });
    return columns;
}

function formatHeaderLabel(category) {
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
}

function formatColumnWidth(props) {
    const { category, lastColumn } = props;
    const scrollBarOffset = 16;
    const rateCategories = ['avg', 'rc', 'obp', 'ops', 'slg', 'woba'];
    if (rateCategories.includes(category)) {
        return lastColumn ? 60 + scrollBarOffset : 50;
    }
    switch (category) {
        case 'player':
            return 150;
        case 'game':
            return 175;
        case 'battingOrder':
            return 35;
        case 'w':
            return 75;
        case 'gp':
            return 35;
        case '':
            return 150;
        default:
            return 45;
    }
}

function formatHeaderStyle(props) {
    const { category, lastColumn } = props;

    const headerStyle = {
        padding: '0.5rem',
    };

    if (lastColumn || ['player', 'game', 'gp', 'battingOrder'].includes(category)) {
        headerStyle.textAlign = 'left';
    }

    return headerStyle;
}

function formatCellStyle(props) {
    const { adminPage, category, lastColumn, sortedColumn } = props;

    const cellStyle = {
        borderRight: 0,
        padding: '0.5rem',
    };

    if (sortedColumn === category) {
        cellStyle.fontWeight = 'bold';
    }

    if (category === 'gp' || category === 'battingOrder') {
        cellStyle.color = '#bebbbb';
    }

    if (adminPage || category === 'player' || category === 'gp') {
        cellStyle.borderRight = '1px solid #f5f5f5';
    }

    if (adminPage || lastColumn || ['player', 'game', 'gp', 'battingOrder'].includes(category)) {
        cellStyle.textAlign = 'left';
    }

    return cellStyle;
}

StatsTable.propTypes = {
    adminPage: PropTypes.bool,
    categories: PropTypes.arrayOf(PropTypes.string),
    cellRenderer: PropTypes.func,
    onSortedChange: PropTypes.func,
    showLegend: PropTypes.bool,
    showPagination: PropTypes.bool,
    sortedColumn: PropTypes.string,
    sortMethod: PropTypes.func,
    stats: PropTypes.arrayOf(PropTypes.object),
    striped: PropTypes.string,
    style: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
};

StatsTable.defaultProps = {
    adminPage: false,
    categories: defaultStatCategories,
    showLegend: false,
    showPagination: false,
    stats: [],
    striped: 'striped',
    style: {},
};

export default StatsTable;
