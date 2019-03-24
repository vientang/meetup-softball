import React from 'react';
import PropTypes from 'prop-types';
import { Avatar } from 'antd';
import componentStyles from './components.module.css';

const PlayerInfo = (props) => {
    return (
        <div className={componentStyles.playerInfoCard}>
            <Avatar size={64} icon="user" />
            <div className={componentStyles.playerInfoCardSection}>
                <p className={componentStyles.playerInfoName}>{props.playerInfo.name}</p>
                <ul className={componentStyles.playerInfoList}>
                    <li className={componentStyles.playerInfoList}>Hometown: NYC</li>
                    <li className={componentStyles.playerInfoList}>Throws: Right</li>
                    <li className={componentStyles.playerInfoList}>Bats: Right</li>
                    <li className={componentStyles.playerInfoList}>Favorite position: OF</li>
                    <li className={componentStyles.playerInfoList}>Bats: Right</li>
                </ul>
            </div>
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
