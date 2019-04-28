import React from 'react';
import PropTypes from 'prop-types';
import StatsTable from './StatsTable';
import { Utils } from '../utils';
import componentStyles from './components.module.css';

const categories = [
    'gp',
    'w',
    'h',
    'singles',
    'doubles',
    'triples',
    'r',
    'rbi',
    'hr',
    'avg',
    'sb',
    'cs',
    'bb',
    'sac',
    'k',
    'rc',
    'tb',
    'obp',
    'ops',
    'slg',
    'woba',
];

const statsTableStyle = {
    width: 1155,
};

const CareerStats = ({ stats }) => {
    return (
        <div className={componentStyles.playerPageSection}>
            <p className={componentStyles.playerPageSectionTitle}>Career stats</p>
            <StatsTable
                style={statsTableStyle}
                categories={categories}
                stats={stats}
                sortMethod={Utils.sortHighToLow}
                striped=""
            />
        </div>
    );
};

CareerStats.propTypes = {
    stats: PropTypes.arrayOf(PropTypes.shape()),
};

export default CareerStats;
