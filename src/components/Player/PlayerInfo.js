import React from 'react';
import PropTypes from 'prop-types';
import { Avatar } from 'antd';
import { usePlayerInfo } from '../../utils/hooks';
import playerStyles from './player.module.css';

const PlayerInfo = ({ id }) => {
    const playerInfo = usePlayerInfo(id);

    if (!playerInfo) {
        return <div className={playerStyles.playerInfoCard} />;
    }

    const { photos, profile } = playerInfo;
    const { answers = [], title } = profile;
    const { highres_link, photo_link, thumb_link } = photos;
    const playerImg = highres_link || photo_link || thumb_link;

    return (
        <div className={playerStyles.playerInfoCard}>
            <div className={playerStyles.playerInfoCardGroup}>
                <Avatar src={playerImg} size={212} icon="user" shape="circle" />
                <div className={playerStyles.playerInfoCardBio}>
                    <p className={playerStyles.playerInfoName}>{playerInfo.name}</p>
                    <p className={playerStyles.playerInfoTitle}>{title}</p>
                </div>
            </div>
            <div className={playerStyles.playerInfoCardQuestionsGroup}>
                <ul className={playerStyles.playerInfoCardQuestionsList}>
                    {answers.map((qa) => (
                        <li key={qa.question} className={playerStyles.playerInfoCardQuestionGroup}>
                            <p className={playerStyles.playerInfoCardQuestion}>{qa.question}</p>
                            <p className={playerStyles.playerInfoCardAnswer}>{qa.answer}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

PlayerInfo.propTypes = {
    id: PropTypes.string,
};

export default PlayerInfo;
