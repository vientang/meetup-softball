import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { fetchPlayerInfo } from '../utils/apiService';
import PlayerAvatar from './PlayerAvatar';
import componentStyles from './components.module.css';

const TopPlayer = ({ meetupId, stat }) => {
    const [playerInfo, setPlayerInfo] = useState(null);
    useEffect(() => {
        async function fetchPlayer() {
            if (meetupId) {
                const playerInfo = await fetchPlayerInfo(meetupId);
                setPlayerInfo(playerInfo);
            }
        }
        fetchPlayer();
    }, [meetupId]);

    if (!playerInfo) {
        return null;
    }

    const { name, photos } = playerInfo;

    return (
        <>
            <PlayerAvatar
                image={photos.highres_link}
                name={name}
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
