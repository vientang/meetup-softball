import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import StatsTable from './StatsTable';
import { getDefaultSortedColumn, sortHighToLow } from '../utils/helpers';
import { gameLogCategories } from '../utils/constants';
import componentStyles from './components.module.css';

const GameLog = ({ stats }) => (
    <div className={componentStyles.playerPageSection}>
        <p className={componentStyles.playerPageSectionTitle}>Games</p>
        <StatsTable
            categories={gameLogCategories}
            cellRenderer={renderCell}
            defaultSorted={getDefaultSortedColumn('date', false)}
            sortMethod={sortHighToLow}
            stats={stats}
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
