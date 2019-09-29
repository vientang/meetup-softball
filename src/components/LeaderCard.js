import React from 'react';
import PropTypes from 'prop-types';
import componentStyles from './components.module.css';
import TopPlayer from './TopPlayer';

const LeaderCard = ({ leaders, stat }) => (
    <ul className={componentStyles.leaderCard}>
        <li className={componentStyles.leaderStatTitle}>
            <span>{stat.toUpperCase()}</span>
        </li>
        {leaders.map((player, i) => (
            <li key={player.name} className={componentStyles.leaderCardItem}>
                {i === 0 ? (
                    <TopPlayer meetupId={player.id} stat={player[stat]} />
                ) : (
                    <div className={componentStyles.leaderCardItemPlayerInfo}>
                        <span>{player.name}</span>
                        <span className={componentStyles.leaderCardStat}>{player[stat]}</span>
                    </div>
                )}
            </li>
        ))}
    </ul>
);

LeaderCard.propTypes = {
    leaders: PropTypes.arrayOf(PropTypes.object),
    stat: PropTypes.string,
};

LeaderCard.defaultProps = {
    leaders: [],
};

export default LeaderCard;
