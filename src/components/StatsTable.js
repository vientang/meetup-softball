import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import ErrorBoundary from './ErrorBoundary';
import StatsLegend from './StatsLegend';
import { defaultStatCategories } from '../utils/constants';
import componentStyles from './components.module.css';
import 'react-table/react-table.css';

const StatsTable = (props) => {
    const { stats, showLegend, showPagination, striped, style } = props;

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
                    showPaginationBottom={showPagination}
                    style={statsTableStyle}
                />
                {showLegend && <StatsLegend style={statsLegendStyle} />}
            </ErrorBoundary>
        </div>
    );
};

function renderColumns(params) {
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

function formatColumnWidth(params) {
    const { category, lastColumn } = params;
    const scrollBarOffset = 16;
    const rateCategories = ['avg', 'rc', 'obp', 'ops', 'slg', 'woba'];
    if (rateCategories.includes(category)) {
        return lastColumn ? 60 + scrollBarOffset : 50;
    }
    switch (category) {
        case 'player':
            return 200;
        case 'game':
            return 190;
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

function formatHeaderStyle(params) {
    const { category, lastColumn } = params;
    const headerStyle = {
        padding: '0.5rem',
    };
    if (['player', 'game', 'gp'].includes(category)) {
        headerStyle.textAlign = 'left';
    }
    if (lastColumn) {
        headerStyle.textAlign = 'center';
        headerStyle.paddingRight = 25;
    }
    return headerStyle;
}

function formatCellStyle(params) {
    const { category, lastColumn } = params;

    const cellStyle = {
        textAlign: ['player', 'game', 'gp'].includes(category) ? 'left' : 'right',
        color: category === 'gp' ? '#bebbbb' : '#555555',
        borderRight: category === 'player' ? '1px solid #f5f5f5' : 0,
        padding: '0.5rem',
    };
    if (lastColumn) {
        cellStyle.paddingRight = 25;
    }
    return cellStyle;
}

StatsTable.propTypes = {
    categories: PropTypes.arrayOf(PropTypes.string),
    cellRenderer: PropTypes.func,
    showLegend: PropTypes.bool,
    showPagination: PropTypes.bool,
    sortMethod: PropTypes.func,
    stats: PropTypes.arrayOf(PropTypes.object),
    striped: PropTypes.string,
    style: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
};

StatsTable.defaultProps = {
    categories: defaultStatCategories,
    showLegend: false,
    showPagination: false,
    stats: [],
    striped: 'striped',
    style: {},
};

export default StatsTable;
