import React from 'react';
import PropTypes from 'prop-types';
import StatsTable from './StatsTable';
import {
    formatCellValue,
    getDefaultSortedColumn,
    mapByKey,
    sortHighToLow,
    sortByYear,
} from '../utils/helpers';
import { careerStatCatsByYear, careerStatCatsByField } from '../utils/constants';
import { calculateCareerStats } from '../utils/statsCalc';
import componentStyles from './components.module.css';

const CareerStats = ({ stats }) => {
    const statsByYear = calculateCareerStats(mapByKey(stats, 'year'), 'year');
    const statsByField = calculateCareerStats(mapByKey(stats, 'field'), 'field');

    return (
        <div className={componentStyles.playerPageSection}>
            <p className={componentStyles.playerPageSectionTitle}>Career stats</p>
            <StatsTable
                categories={careerStatCatsByYear}
                cellRenderer={renderCell}
                defaultSorted={getDefaultSortedColumn('year', false)}
                stats={statsByYear}
                sortMethod={sortByYear}
                striped=""
            />
            <StatsTable
                categories={careerStatCatsByField}
                cellRenderer={renderCell}
                defaultSorted={getDefaultSortedColumn('gp', false)}
                stats={statsByField}
                sortMethod={sortHighToLow}
                striped=""
            />
        </div>
    );
};

function renderCell(cellInfo) {
    if (cellInfo.column.Header === 'SEASON') {
        return '';
    }
    return formatCellValue(cellInfo.value) || '0';
}

CareerStats.propTypes = {
    stats: PropTypes.arrayOf(PropTypes.shape()),
};

CareerStats.defaultProps = {
    stats: [],
};

export default CareerStats;
