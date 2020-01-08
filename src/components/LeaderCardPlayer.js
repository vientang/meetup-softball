import React from 'react';
import PropTypes from 'prop-types';
import { PlayerAvatar } from './Player';
import { usePlayerInfo } from '../utils/hooks';
import componentStyles from './components.module.css';

const LeaderCardPlayer = ({ id, stat }) => {
    const playerInfo = usePlayerInfo(id);

    if (!playerInfo) {
        return null;
    }

    const { name, photos } = playerInfo;
    const avatarStyle = {
        width: 30,
        height: 30,
        margin: '1rem 1rem 0.5rem',
    };
    return (
        <div className={componentStyles.leaderCardPlayer}>
            <PlayerAvatar src={photos.thumb_link} name={name} style={avatarStyle} />
            <div className={componentStyles.leaderCardItemPlayerInfo}>
                <span>{name}</span>
                <span className={componentStyles.leaderCardStat}>{stat}</span>
            </div>
        </div>
    );
};

LeaderCardPlayer.propTypes = {
    id: PropTypes.string,
    stat: PropTypes.string,
};

export default LeaderCardPlayer;
