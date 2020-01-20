import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import StatsTable from '../StatsTable';
import Pagination from '../Pagination';
import { getDefaultSortedColumn, sortHighToLow } from '../../utils/helpers';
import { gameLogCategories } from '../../utils/constants';
import playerStyles from './player.module.css';

const GameLog = ({ stats }) => (
    <div className={playerStyles.playerPageSection}>
        <p className={playerStyles.playerPageSectionTitle}>Games</p>
        <StatsTable
            categories={gameLogCategories}
            cellRenderer={renderCell}
            defaultPageSize={10}
            defaultSorted={getDefaultSortedColumn('date', false)}
            PaginationComponent={Pagination}
            sortMethod={sortHighToLow}
            stats={stats}
            showLegend
            showPaginationTop
        />
    </div>
);

function renderCell(cellInfo) {
    if (cellInfo.column.Header === 'GAME') {
        return <Link to="/game">{cellInfo.original.game}</Link>;
    }
    return cellInfo.value || '0';
}

GameLog.propTypes = {
    stats: PropTypes.arrayOf(PropTypes.shape()),
};

export default GameLog;
