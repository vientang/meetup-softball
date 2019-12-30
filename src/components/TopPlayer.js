import React from 'react';
import PropTypes from 'prop-types';
import { PlayerAvatar } from './Player';
import { usePlayerInfo } from '../utils/hooks';
import componentStyles from './components.module.css';

const TopPlayer = ({ meetupId, stat }) => {
    const playerInfo = usePlayerInfo(meetupId);

    if (!playerInfo) {
        return null;
    }

    const { name, photos } = playerInfo;

    return (
        <>
            <PlayerAvatar
                src={photos.highres_link}
                name={name}
                shape="square"
                style={{ width: '100%', height: 200 }}
            />
            <div className={componentStyles.leaderCardItemTopPlayerInfo}>
                <span>{name}</span>
                <span className={componentStyles.leaderCardStat}>{stat}</span>
            </div>
        </>
    );
};

TopPlayer.propTypes = {
    meetupId: PropTypes.string,
    stat: PropTypes.string,
};

export default TopPlayer;
