import React from 'react';
import PropTypes from 'prop-types';
import componentStyles from './components.module.css';
import { definitions } from '../utils/constants';

const legendCategories = ['rc', 'obp', 'ops', 'tb', 'woba'];
const StatsLegend = ({ style }) => {
    return (
        <ul className={componentStyles.statsLegendList} style={style}>
            {legendCategories.map((category) => {
                return (
                    <li key={category} className={componentStyles.statsLegendListItem}>
                        <div>
                            <p className={componentStyles.statsLegendBasic}>
                                {`${definitions[category].basic} (${category.toUpperCase()}): `}
                            </p>
                            <span className={componentStyles.statsLegendDetail}>
                                {definitions[category].detail}
                            </span>
                        </div>
                        <span className={componentStyles.statsLegendFormula}>
                            {`${definitions[category].formula}`}
                        </span>
                    </li>
                );
            })}
        </ul>
    );
};

StatsLegend.displayName = 'StatsLegend';
StatsLegend.propTypes = {
    style: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
};
export default StatsLegend;
