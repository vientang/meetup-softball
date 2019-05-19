import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import StatsTable from './StatsTable';
import { Utils } from '../utils';
import { gameLogCategories } from '../utils/constants';
import componentStyles from './components.module.css';

const PlayerGameLog = ({ stats, statsTableStyle }) => {
    return (
        <div className={componentStyles.playerPageSection}>
            <p className={componentStyles.playerPageSectionTitle}>Games</p>
            <StatsTable
                categories={gameLogCategories}
                style={statsTableStyle}
                cellRenderer={renderCell}
                sortMethod={Utils.sortHighToLow}
                stats={stats}
            />
        </div>
    );
};

function renderCell(cellInfo) {
    if (cellInfo.column.Header === 'GAME') {
        return <Link to="/game">{cellInfo.original.game}</Link>;
    }
    return cellInfo.value || '0';
}

PlayerGameLog.propTypes = {
    stats: PropTypes.arrayOf(PropTypes.shape()),
    statsTableStyle: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
};

export default PlayerGameLog;
