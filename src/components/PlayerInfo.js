import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { Avatar } from 'antd';
import componentStyles from './components.module.css';

const PlayerInfo = (props) => {
    const { playerInfo } = props;
    const { name } = playerInfo;

    const playerImg = get(
        playerInfo,
        'photos.highres_link',
        get(playerInfo, 'photos.photo_link', get(playerInfo, 'thumb_link', '')),
    );
    const questions = get(playerInfo, 'profile.answers', []);
    const title = get(playerInfo, 'profile.title', '');
    const image = playerImg ? (
        <img src={playerImg} className={componentStyles.playerInfoPhoto} alt={name} />
    ) : (
        <Avatar src={playerImg} size={212} shape="square" icon="user" />
    );

    return (
        <div className={componentStyles.playerInfoCard}>
            <div className={componentStyles.playerInfoCardGroup}>
                {image}
                <div className={componentStyles.playerInfoCardBio}>
                    <p className={componentStyles.playerInfoName}>{name}</p>
                    <p className={componentStyles.playerInfoTitle}>{title}</p>
                </div>
            </div>
            <div className={componentStyles.playerInfoCardQuestionsGroup}>
                <ul className={componentStyles.playerInfoCardQuestionsList}>
                    {questions.map((q) => {
                        return (
                            <li
                                key={q.answer}
                                className={componentStyles.playerInfoCardQuestionGroup}
                            >
                                <p className={componentStyles.playerInfoCardQuestion}>
                                    {q.question}
                                </p>
                                <p className={componentStyles.playerInfoCardAnswer}>{q.answer}</p>
                            </li>
                        );
                    })}
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
