import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import { PlayerAvatar } from './Player';
import { usePlayerInfo } from '../utils/hooks';
import componentStyles from './components.module.css';

const TopPlayer = ({ id, stat }) => {
    const playerInfo = usePlayerInfo(id);

    if (!playerInfo) {
        return null;
    }

    const { name, photos } = playerInfo;

    return (
        <>
            <PlayerAvatar
                src={photos.photo_link}
                name={name}
                style={{ width: 75, height: 75, margin: '1rem' }}
            />
            <div className={componentStyles.leaderCardItemTopPlayerInfo}>
                <Link to={`/player?id=${id}`}>{name}</Link>
                <span className={componentStyles.leaderCardStat}>{stat}</span>
            </div>
        </>
    );
};

TopPlayer.propTypes = {
    id: PropTypes.string,
    stat: PropTypes.string,
};

export default TopPlayer;
