import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import ErrorBoundary from './ErrorBoundary';
import { defaultStatCategories } from '../utils/constants';
import componentStyles from './components.module.css';
import 'react-table/react-table.css';

const headerStyle = { background: '#345160', color: 'white' };

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

const formatColumnWidth = (category) => {
    const rateCategories = ['avg', 'rc', 'obp', 'ops', 'slg', 'woba'];
    if (rateCategories.includes(category)) {
        return 60;
    }
    switch (category) {
        case 'player':
            return 150;
        case 'w':
            return 75;
        case '':
            return 150;
        default:
            return 35;
    }
};

const formatCellStyle = (params) => {
    const { category } = params;
    const cellStyle = {
        textAlign: category === 'player' ? 'left' : 'right',
        color: '#555555',
    };
    return cellStyle;
};

class StatsTable extends React.Component {
    constructor() {
        super();
        this.tBodyComponent = null;
    }

    renderColumns = () => {
        const { categories, cellRenderer, sortMethod } = this.props;

        const columns = categories.map((category) => {
            const header = formatHeaderLabel(category);
            const width = formatColumnWidth(category);
            const cellStyle = formatCellStyle({ category });
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

    render() {
        const { stats, showPagination, style } = this.props;

        if (!stats || stats.length < 1) {
            return null;
        }

        return (
            <div className={componentStyles.statsTable}>
                <ErrorBoundary>
                    <ReactTable
                        data={stats}
                        className="-striped -highlight"
                        columns={this.renderColumns()}
                        defaultPageSize={stats.length}
                        showPaginationBottom={showPagination}
                        style={style}
                    />
                </ErrorBoundary>
            </div>
        );
    }
}

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
