import React from 'react';
import PropTypes from 'prop-types';
import StatsTable from './StatsTable';
import { sortHighToLow } from '../utils/helpers';
import { splitStatCategories } from '../utils/constants';
import componentStyles from './components.module.css';

const PlayerSplitStats = ({ filteredStats, statsTableStyle }) => {
    return (
        <div className={componentStyles.playerPageSection}>
            <p className={componentStyles.playerPageSectionTitle}>Current Splits</p>
            <StatsTable
                style={statsTableStyle}
                categories={splitStatCategories}
                stats={[filteredStats[0]]}
                sortMethod={sortHighToLow}
                striped=""
            />
        </div>
    );
};

PlayerSplitStats.propTypes = {
    filteredStats: PropTypes.arrayOf(PropTypes.shape()),
    statsTableStyle: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
};

export default PlayerSplitStats;
