import React from 'react';
import PropTypes from 'prop-types';
import pick from 'lodash/pick';
import { Icon } from 'antd';
import AdminSection from './AdminSection';
import { PlayerAvatar } from '../Player';
import dashboardStyles from './dashboard.module.css';

const PlayerOfTheGame = ({ player }) => {
    const { photos: { photo_link } = {}, name } = player;

    const style = {
        minHeight: 250,
    };

    const iconStyle = {
        fontSize: '3rem',
        color: '#bebbbb',
        margin: 'auto 0',
    };

    const avatarStyle = {
        width: 120,
        height: 120,
        margin: 'var(--margin-3) auto',
    };

    const stats = pick(player, [
        'hr',
        'r',
        'rbi',
        'singles',
        'doubles',
        'triples',
        'sb',
        'bb',
        'o',
    ]);
    return (
        <AdminSection
            title="PLAYER OF THE GAME"
            iconType="user"
            iconColor="#1890ff"
            style={style}
            theme="outlined"
        >
            {photo_link ? (
                <div className={dashboardStyles.potgContainer}>
                    <span className={dashboardStyles.potgName}>{name}</span>
                    <PlayerAvatar src={photo_link} name={name} style={avatarStyle} />
                    <div className={dashboardStyles.potgStats}>
                        {Object.keys(stats).map((stat) => {
                            return (
                                <div key={stat} className={dashboardStyles.potgCol}>
                                    <span className={dashboardStyles.potgStatName}>
                                        {stat.toUpperCase()}
                                    </span>
                                    <span className={dashboardStyles.potgStat}>10</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <Icon type="user" style={iconStyle} />
            )}
        </AdminSection>
    );
};

PlayerOfTheGame.displayName = 'PlayerOfTheGame';
PlayerOfTheGame.propTypes = {
    player: PropTypes.shape({
        name: PropTypes.string,
        photos: PropTypes.shape(),
        bb: PropTypes.string,
        cs: PropTypes.string,
        doubles: PropTypes.string,
        hr: PropTypes.string,
        k: PropTypes.string,
        o: PropTypes.string,
        r: PropTypes.string,
        rbi: PropTypes.string,
        sac: PropTypes.string,
        sb: PropTypes.string,
        singles: PropTypes.string,
        triples: PropTypes.string,
    }),
};
export default PlayerOfTheGame;
