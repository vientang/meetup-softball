import React from 'react';
import PropTypes from 'prop-types';
import StatsTable from './StatsTable';
import { sortHighToLow } from '../utils/helpers';
import { careerStatCatsByYear, careerStatCatsByField } from '../utils/constants';
import componentStyles from './components.module.css';

const CareerStats = ({ statsByField, statsByYear }) => (
    <div className={componentStyles.playerPageSection}>
        <p className={componentStyles.playerPageSectionTitle}>Career stats</p>
        <StatsTable
            cellRenderer={renderCell}
            categories={careerStatCatsByYear}
            stats={statsByYear}
            sortMethod={sortHighToLow}
            striped=""
        />
        <StatsTable
            categories={careerStatCatsByField}
            stats={statsByField}
            sortMethod={sortHighToLow}
            striped=""
        />
    </div>
);

function renderCell(cellInfo) {
    if (cellInfo.column.Header === 'SEASON') {
        return '';
    }
    return cellInfo.value || '0';
}

CareerStats.propTypes = {
    statsByField: PropTypes.arrayOf(PropTypes.shape()),
    statsByYear: PropTypes.arrayOf(PropTypes.shape()),
};

export default CareerStats;
