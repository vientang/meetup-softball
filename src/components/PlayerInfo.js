import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Avatar } from 'antd';
import componentStyles from './components.module.css';
import { fetchPlayerInfo } from '../utils/apiService';
import { parsePhotosAndProfile } from '../utils/helpers';

const PlayerInfo = ({ meetupId }) => {
    const [playerInfo, setPlayerInfo] = useState(null);
    useEffect(() => {
        async function fetchPlayer() {
            if (meetupId) {
                const playerInfo = await fetchPlayerInfo(meetupId);
                setPlayerInfo(playerInfo);
            }
        }
        fetchPlayer();
    }, [meetupId]);

    if (!playerInfo) {
        return <div className={componentStyles.playerInfoCard} />;
    }

    const { photos, profile } = parsePhotosAndProfile(playerInfo);
    const { answers = [], title } = profile;
    const { highres_link, photo_link, thumb_link } = photos;
    const playerImg = highres_link || photo_link || thumb_link;
    
    const image = playerImg ? (
        <img src={playerImg} className={componentStyles.playerInfoPhoto} alt={playerInfo.name} />
    ) : (
        <Avatar src={playerImg} size={212} shape="square" icon="user" />
    );

    return (
        <div className={componentStyles.playerInfoCard}>
            <div className={componentStyles.playerInfoCardGroup}>
                {image}
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
