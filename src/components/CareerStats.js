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
    'slg',
    'obp',
    'ops',
    'woba',
];

const CareerStats = ({ stats }) => {
    return (
        <div className={componentStyles.playerPageSection}>
            <p className={componentStyles.playerPageSectionTitle}>Career stats</p>
            <StatsTable categories={categories} stats={stats} sortMethod={Utils.sortHighToLow} />
        </div>
    );
};

CareerStats.propTypes = {
    stats: PropTypes.arrayOf(PropTypes.shape()),
};

export default CareerStats;
