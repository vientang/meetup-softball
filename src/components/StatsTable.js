import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import ErrorBoundary from './ErrorBoundary';
import componentStyles from './components.module.css';
import 'react-table/react-table.css';

const defaultCategories = [
    'player',
    'o',
    '1b',
    '2b',
    '3b',
    'hr',
    'bb',
    'sb',
    'cs',
    'k',
    'rbi',
    'r',
    'sac',
];
class StatsTable extends React.Component {
    renderColumns = () => {
        const { categories, cellRenderer, sortMethod } = this.props;

        const columns = categories.map((category) => {
            const isBattingOrder = category === 'battingOrder';
            const isPlayerCat = category === 'player';
            let header = category.toUpperCase();
            let width = 60;
            let maxWidth = 60;

            if (isPlayerCat) {
                header = 'Player';
                width = 180;
                maxWidth = 180;
            }

            if (isBattingOrder) {
                header = '';
                width = 40;
                maxWidth = 40;
            }

            return {
                Header: header,
                Cell: cellRenderer,
                accessor: category === 'player' ? 'name' : category,
                resizable: false,
                sortMethod,
                maxWidth,
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
