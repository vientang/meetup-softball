import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Tooltip } from 'antd';
import componentStyles from './components.module.css';

const LeaderCard = ({ players, title, rate }) => {
    const cardTitle = rate ? (
        <Tooltip title="prompt text">
            <li className={componentStyles.leaderStatTitle}>
                <span>{title}</span>
                <Icon type="question-circle" />
            </li>
        </Tooltip>
    ) : (
        <li className={componentStyles.leaderStatTitle}>
            <span>{title}</span>
        </li>
    );
    return (
        <ul className={componentStyles.leaderCard}>
            {cardTitle}
            {players.map((player, i) => {
                if (i === 0) {
                    return (
                        <li className={componentStyles.leaderCardItem}>
                            <Icon type="trophy" />
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
    rate: PropTypes.bool,
};

LeaderCard.defaultProps = {
    players: [],
    rate: false,
};

export default LeaderCard;
