import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Tooltip } from 'antd';
import componentStyles from './components.module.css';
import { qualifiers } from '../utils/constants';

const LeaderCard = ({ players, title, rate }) => {
    const cardTitle = rate ? (
        <Tooltip title={qualifiers.avg}>
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
                        <li key={player.playerName} className={componentStyles.leaderCardItem}>
                            <Icon type="trophy" />
                            <span>{player.playerName}</span>
                            <span className={componentStyles.leaderCardStat}>{player.total}</span>
                        </li>
                    );
                }
                return (
                    <li key={player.playerName} className={componentStyles.leaderCardItem}>
                        <span>{player.playerName}</span>
                        <span className={componentStyles.leaderCardStat}>{player.total}</span>
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
