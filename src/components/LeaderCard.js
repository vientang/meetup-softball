import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import componentStyles from './components.module.css';

const LeaderCard = ({ players, title }) => {
    return (
        <ul className={componentStyles.leaderCard}>
            <li className={componentStyles.leaderStatTitle}>{title}</li>
            {players.map((player, i) => {
                if (i === 0) {
                    return (
                        <li className={componentStyles.leaderCardItem}>
                            <Icon type="crown" />
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

LeaderCard.propTypes = {
    players: PropTypes.arrayOf(PropTypes.object),
    title: PropTypes.string,
};

LeaderCard.defaultProps = {
    players: [],
};

export default LeaderCard;
