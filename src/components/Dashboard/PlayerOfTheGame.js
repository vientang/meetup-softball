import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import AdminSection from './AdminSection';
import { PlayerAvatar } from '../Player';

const PlayerOfTheGame = ({ image, name }) => {
    const style = {
        height: 250,
    };

    const iconStyle = {
        fontSize: '3rem',
        color: '#bebbbb',
        margin: 'auto 0',
    };

    return (
        <AdminSection
            title="PLAYER OF THE GAME"
            iconType="user"
            iconColor="#1890ff"
            style={style}
            theme="outlined"
        >
            {image ? (
                <PlayerAvatar image={image} name={name} />
            ) : (
                <Icon type="user" style={iconStyle} />
            )}
        </AdminSection>
    );
};

PlayerOfTheGame.displayName = 'PlayerOfTheGame';
PlayerOfTheGame.propTypes = {
    image: PropTypes.string,
    name: PropTypes.string,
};
export default PlayerOfTheGame;
