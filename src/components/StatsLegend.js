import React from 'react';
import componentStyles from './components.module.css';
import { definitions } from '../utils/constants';

const legendCategories = ['rc', 'obp', 'ops', 'tb', 'woba'];
const StatsLegend = () => {
    return (
        <ul className={componentStyles.statsLegend}>
            {legendCategories.map((category) => {
                return (
                    <li key={category} className={componentStyles.statsLegendDefinition}>
                        <p className={componentStyles.statsLegendBasic}>
                            {`${definitions[category].basic} (${category.toUpperCase()}): `}
                        </p>
                        <span className={componentStyles.statsLegendDetail}>
                            {definitions[category].detail}
                        </span>
                        <span className={componentStyles.statsLegendFormula}>
                            {`Formula: ${definitions[category].formula}`}
                        </span>
                    </li>
                );
            })}
        </ul>
    );
};

StatsLegend.displayName = 'StatsLegend';
export default StatsLegend;
