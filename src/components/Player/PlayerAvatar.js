import React from 'react';
import PropTypes from 'prop-types';
import { Avatar } from 'antd';

const avatarStyle = {
    objectFit: 'cover',
    objectPosition: '100% 0',
};

const PlayerAvatar = ({ image, name, shape, style }) => {
    const avatarProps = {
        style: { ...avatarStyle, ...style },
        alt: name,
        src: image,
        icon: 'user',
    };
    return <Avatar {...avatarProps} shape={shape} />;
};

PlayerAvatar.displayName = 'PlayerAvatar';
PlayerAvatar.propTypes = {
    image: PropTypes.string,
    name: PropTypes.string,
    shape: PropTypes.string,
    style: PropTypes.shape(),
};
export default PlayerAvatar;
