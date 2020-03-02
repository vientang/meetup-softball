import React from 'react';
import PropTypes from 'prop-types';
import TopPlayer from './TopPlayer';
import LeaderCardPlayer from './LeaderCardPlayer';
import { formatCellValue } from '../utils/helpers';
import componentStyles from './components.module.css';

const LeaderCard = ({ leaders, stat }) => {
    return (
        <ul className={componentStyles.leaderCard}>
            <li className={componentStyles.leaderStatTitle}>
                <span>{stat.toUpperCase()}</span>
            </li>
            {leaders.map((player, i) => {
                const playerStat = formatCellValue(player[stat]);
                return (
                    <li key={player.id} className={componentStyles.leaderCardItem}>
                        {i === 0 ? (
                            <TopPlayer id={player.id} stat={playerStat} />
                        ) : (
                            <LeaderCardPlayer id={player.id} stat={playerStat} />
                        )}
                    </li>
                );
            })}
        </ul>
    );
};

LeaderCard.propTypes = {
    leaders: PropTypes.arrayOf(PropTypes.object),
    stat: PropTypes.string,
};

LeaderCard.defaultProps = {
    leaders: [],
};

export default LeaderCard;
