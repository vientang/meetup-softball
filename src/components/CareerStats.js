import React from 'react';
import PropTypes from 'prop-types';
import StatsTable from './StatsTable';
import { sortHighToLow } from '../utils/helpers';
import { careerStatCatsByYear, careerStatCatsByField } from '../utils/constants';
import componentStyles from './components.module.css';

const CareerStats = ({ careerStatsByField, careerStatsByYear, statsTableStyle }) => {
    return (
        <div className={componentStyles.playerPageSection}>
            <p className={componentStyles.playerPageSectionTitle}>Career stats</p>
            <StatsTable
                style={statsTableStyle}
                categories={careerStatCatsByYear}
                stats={careerStatsByYear}
                sortMethod={sortHighToLow}
                striped=""
            />
            <StatsTable
                style={statsTableStyle}
                categories={careerStatCatsByField}
                stats={careerStatsByField}
                sortMethod={sortHighToLow}
                striped=""
            />
        </div>
    );
};

CareerStats.propTypes = {
    careerStatsByField: PropTypes.arrayOf(PropTypes.shape()),
    careerStatsByYear: PropTypes.arrayOf(PropTypes.shape()),
    statsTableStyle: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
};

export default CareerStats;
