import React from 'react';
import PropTypes from 'prop-types';
import StatsTable from './StatsTable';
import { sortHighToLow } from '../utils/helpers';
import { careerStatCategories } from '../utils/constants';
import componentStyles from './components.module.css';

const CareerStats = ({ stats, statsTableStyle }) => {
    return (
        <div className={componentStyles.playerPageSection}>
            <p className={componentStyles.playerPageSectionTitle}>Career stats</p>
            <StatsTable
                style={statsTableStyle}
                categories={careerStatCategories}
                stats={stats}
                sortMethod={sortHighToLow}
                striped=""
            />
        </div>
    );
};

CareerStats.propTypes = {
    stats: PropTypes.arrayOf(PropTypes.shape()),
    statsTableStyle: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
};

export default CareerStats;
