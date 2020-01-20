// eslint-disable react/no-unused-prop-types
import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import { Icon } from 'antd';
import ErrorBoundary from './ErrorBoundary';
import StatsLegend from './StatsLegend';
import { defaultStatCategories } from '../utils/constants';
import componentStyles from './components.module.css';

const StatsTable = (props) => {
    const {
        adminPage,
        defaultPageSize,
        defaultSorted,
        onSortedChange,
        PaginationComponent,
        stats,
        showLegend,
        showPaginationTop,
        showPaginationBottom,
        striped,
        style,
    } = props;

    const statsTableStyle = {
        fontSize: 12,
        width: '100%',
        minWidth: adminPage ? null : 1170,
        maxWidth: 1250,
        ...style,
    };
    const statsLegendStyle = {
        width: '100%',
        minWidth: 1170,
        maxWidth: 1250,
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
                    defaultPageSize={defaultPageSize || stats.length}
                    defaultSorted={defaultSorted}
                    minRows={0}
                    onSortedChange={onSortedChange}
                    PaginationComponent={PaginationComponent}
                    showPaginationTop={showPaginationTop}
                    showPaginationBottom={showPaginationBottom}
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
        const nonSortableColumns = ['potg', 'battingOrder', 'player'];
        const isSortable = !nonSortableColumns.includes(category);
        return {
            Header: header,
            Cell: cellRenderer,
            accessor: category === 'player' ? 'name' : category,
            resizable: false,
            headerClassName: componentStyles.statHeaderCell,
            className: componentStyles.statCell,
            style: cellStyle,
            headerStyle,
            sortMethod: isSortable ? sortMethod : null,
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
        case 'field':
            return 'FIELD';
        case 'w':
            return 'WIN %';
        case 'battingOrder':
            return 'BATTING';
        case 'potg':
            return (
                <Icon type="star" theme="filled" style={{ color: 'gold', fontSize: '0.8rem' }} />
            );
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
        return lastColumn ? 50 + scrollBarOffset : 55;
    }
    switch (category) {
        case 'player':
            return 200;
        case 'date':
            return 100;
        case 'game':
            return 250;
        case 'battingOrder':
            return 80;
        case 'year':
            return 65;
        case 'field':
            return 150;
        case 'w':
            return 65;
        case 'gp':
            return 45;
        case 'potg':
            return 35;
        case '':
            return 150;
        default:
            return 45;
    }
}

const nonStatHeaders = ['date', 'year', 'player', 'game', 'gp', 'battingOrder', 'season', 'field'];

function formatHeaderStyle(props) {
    const { category, lastColumn } = props;

    const headerStyle = {
        padding: '0.4rem 0.5rem',
    };

    if (lastColumn || nonStatHeaders.includes(category)) {
        headerStyle.textAlign = 'left';
    }

    return headerStyle;
}

function formatCellStyle(props) {
    const { adminPage, category, lastColumn, sortedColumn } = props;
    const cellsWithBorders = [
        'player',
        'gp',
        'season',
        'field',
        'date',
        'game',
        'battingOrder',
        'year',
        'w',
    ];

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

    if (adminPage || cellsWithBorders.includes(category)) {
        cellStyle.borderRight = '1px solid #f5f5f5';
    }

    if (adminPage || lastColumn || nonStatHeaders.includes(category)) {
        cellStyle.textAlign = 'left';
    }

    return cellStyle;
}

StatsTable.propTypes = {
    adminPage: PropTypes.bool,
    categories: PropTypes.arrayOf(PropTypes.string),
    cellRenderer: PropTypes.func,
    defaultPageSize: PropTypes.number,
    defaultSorted: PropTypes.arrayOf(PropTypes.shape),
    onSortedChange: PropTypes.func,
    PaginationComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    showLegend: PropTypes.bool,
    showPaginationTop: PropTypes.bool,
    showPaginationBottom: PropTypes.bool,
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
    showPaginationTop: false,
    showPaginationBottom: false,
    stats: [],
    striped: 'striped',
    style: {},
};

export default StatsTable;
