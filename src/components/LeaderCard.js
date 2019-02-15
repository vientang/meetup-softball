import React from 'react';
import PropTypes from 'prop-types';
import componentStyles from './components.module.css';
const propTypes = {
    players: PropTypes.array,
    stat: PropTypes.string,
};
const LeaderCard = (props) => {
    return (
        <ul className={componentStyles.leaderCard}>
            <li className={componentStyles.leaderStatTitle}>{props.stat}</li>
            {props.players.map((player, i) => {
                if (i === 0) {
                    return (
                        <li className={componentStyles.leaderCardItem}>
                            <img className={componentStyles.leaderAvatar} />
                            <span>{player.name}</span>
                            <span className={componentStyles.leaderCardStat}>{player.value}</span>
                        </li>
                    );
                }
                return (
                    <li className={componentStyles.leaderCardItem}>
                        <span>{player.name}</span>
                        <span className={componentStyles.leaderCardStat}>{player.value}</span>
                    </li>
                );
            })}
        </ul>
    );
};

LeaderCard.propTypes = propTypes;

export default LeaderCard;
