import React from 'react';
import PropTypes from 'prop-types';
import { Avatar } from 'antd';
import componentStyles from './components.module.css';

const PlayerInfo = (props) => {
    return (
        <div className={componentStyles.playerInfoCard}>
            <Avatar size={64} icon="user" />
            <p className={componentStyles.playerInfoName}>{props.playerInfo.name}</p>
        </div>
    );
};

PlayerInfo.propTypes = {
    playerInfo: PropTypes.shape(),
};

PlayerInfo.defaultProps = {
    playerInfo: {},
};

export default PlayerInfo;
