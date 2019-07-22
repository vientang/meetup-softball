import React from 'react';
import PropTypes from 'prop-types';
import StatsTable from './StatsTable';
import { sortHighToLow } from '../utils/helpers';
import { splitStatCategories } from '../utils/constants';
import componentStyles from './components.module.css';

const SplitStats = ({ stats, style }) => (
    <div className={componentStyles.playerPageSection}>
        <p className={componentStyles.playerPageSectionTitle}>Current Splits</p>
        <StatsTable
            style={style}
            categories={splitStatCategories}
            stats={[stats[0]]}
            sortMethod={sortHighToLow}
            striped=""
        />
    </div>
);

SplitStats.propTypes = {
    stats: PropTypes.arrayOf(PropTypes.shape()),
    style: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
};

export default SplitStats;
