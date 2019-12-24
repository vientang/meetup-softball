import React from 'react';
import PropTypes from 'prop-types';
import { Avatar } from 'antd';

const PlayerAvatar = ({ src, name, shape, style }) => {
    const avatarStyle = {
        objectFit: 'cover',
        objectPosition: '100% 0',
        ...style,
    };
    return <Avatar src={src} style={avatarStyle} icon="user" shape={shape} alt={name} />;
};

PlayerAvatar.displayName = 'PlayerAvatar';
PlayerAvatar.propTypes = {
    name: PropTypes.string,
    shape: PropTypes.string,
    src: PropTypes.string,
    style: PropTypes.shape(),
};
export default PlayerAvatar;
