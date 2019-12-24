import React from 'react';
import PropTypes from 'prop-types';
import { Avatar } from 'antd';
import { usePlayerInfo } from '../utils/hooks';
import componentStyles from './components.module.css';

const PlayerInfo = ({ meetupId }) => {
    const playerInfo = usePlayerInfo(meetupId);

    if (!playerInfo) {
        return <div className={componentStyles.playerInfoCard} />;
    }

    const { photos, profile } = playerInfo;
    const { answers = [], title } = profile;
    const { highres_link, photo_link, thumb_link } = photos;
    const playerImg = highres_link || photo_link || thumb_link;

    return (
        <div className={componentStyles.playerInfoCard}>
            <div className={componentStyles.playerInfoCardGroup}>
                <Avatar src={playerImg} size={212} icon="user" shape="circle" />
                <div className={componentStyles.playerInfoCardBio}>
                    <p className={componentStyles.playerInfoName}>{playerInfo.name}</p>
                    <p className={componentStyles.playerInfoTitle}>{title}</p>
                </div>
            </div>
            <div className={componentStyles.playerInfoCardQuestionsGroup}>
                <ul className={componentStyles.playerInfoCardQuestionsList}>
                    {answers.map((qa, idx) => {
                        return (
                            // eslint-disable-next-line react/no-array-index-key
                            <li key={idx} className={componentStyles.playerInfoCardQuestionGroup}>
                                <p className={componentStyles.playerInfoCardQuestion}>
                                    {qa.question}
                                </p>
                                <p className={componentStyles.playerInfoCardAnswer}>{qa.answer}</p>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

PlayerInfo.propTypes = {
    meetupId: PropTypes.string,
};

export default PlayerInfo;
