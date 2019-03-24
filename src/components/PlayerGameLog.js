import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import StatsTable from './StatsTable';
import { Utils } from '../utils';
import componentStyles from './components.module.css';

const renderCell = (cellInfo) => {
    if (!cellInfo.column.Header) {
        return <Link to="/game">{cellInfo.original.game}</Link>;
    }
    return cellInfo.value;
};

const PlayerGameLog = ({ stats }) => {
    return (
        <div className={componentStyles.playerPageSection}>
            <p className={componentStyles.playerPageSectionTitle}>Games</p>
            <StatsTable cellRenderer={renderCell} sortMethod={Utils.sortHighToLow} stats={stats} />
        </div>
    );
};

PlayerGameLog.propTypes = {
    stats: PropTypes.arrayOf(PropTypes.shape()),
};

export default PlayerGameLog;
