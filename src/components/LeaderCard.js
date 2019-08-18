import React from 'react';
import PropTypes from 'prop-types';
import PlayerAvatar from './PlayerAvatar';
import componentStyles from './components.module.css';

const LeaderCard = ({ leaders, stat }) => (
    <ul className={componentStyles.leaderCard}>
        <li className={componentStyles.leaderStatTitle}>
            <span>{stat.toUpperCase()}</span>
        </li>
        {leaders.map((player, i) => (
            <li key={player.name} className={componentStyles.leaderCardItem}>
                {i === 0 ? (
                    <TopPlayer player={player} stat={stat} />
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

/* eslint-disable react/prop-types */
const TopPlayer = ({ player, stat }) => {
    return (
        <>
            <PlayerAvatar
                image={player.photo.highres_link}
                name={player.name}
                style={{ width: '100%', height: 300 }}
            />
            <div className={componentStyles.leaderCardItemTopPlayerInfo}>
                <span>{player.name}</span>
                <span className={componentStyles.leaderCardStat}>{player[stat]}</span>
            </div>
        </>
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
