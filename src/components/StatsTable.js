import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import ErrorBoundary from './ErrorBoundary';
import componentStyles from './components.module.css';
import 'react-table/react-table.css';

const defaultCategories = [
    'player',
    'o',
    'singles',
    'doubles',
    'triples',
    'hr',
    'bb',
    'sb',
    'cs',
    'k',
    'rbi',
    'r',
    'sac',
];

const convertCategories = (category) => {
    switch (category) {
        case 'singles':
            return '1b';
        case 'doubles':
            return '2b';
        case 'triples':
            return '3b';
        default:
            return category.toUpperCase();
    }
};

class StatsTable extends React.Component {
    constructor() {
        super();
        this.tBodyComponent = null;
    }

    renderColumns = () => {
        const { categories, cellRenderer, sortMethod } = this.props;

        const columns = categories.map((category) => {
            const isBattingOrder = category === 'battingOrder';
            const isPlayerCat = category === 'player';
            let header = convertCategories(category);
            let width = 50;

            if (isPlayerCat) {
                header = 'Player';
                width = 150;
            }

            if (isBattingOrder) {
                header = '';
                width = 40;
            }

            return {
                Header: header,
                Cell: cellRenderer,
                accessor: category === 'player' ? 'name' : category,
                resizable: false,
                sortMethod,
                width,
            };
        });
        return columns;
    };

    render() {
        const { players, showPagination, style } = this.props;

        if (!players || players.length < 1) {
            return null;
        }

        return (
            <div className={componentStyles.statsTable}>
                <ErrorBoundary>
                    <ReactTable
                        data={players}
                        className="-striped -highlight"
                        columns={this.renderColumns()}
                        defaultPageSize={players.length}
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
    players: PropTypes.arrayOf(PropTypes.object),
    showPagination: PropTypes.bool,
    sortMethod: PropTypes.func,
    style: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
};

StatsTable.defaultProps = {
    categories: defaultCategories,
    players: [],
    showPagination: false,
};

export default StatsTable;
