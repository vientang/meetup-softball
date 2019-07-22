import React from 'react';
import PropTypes from 'prop-types';
import { Avatar } from 'antd';
import componentStyles from './components.module.css';

const PlayerInfo = ({ data }) => {
    const profile = data.profile ? JSON.parse(data.profile) : {};
    const { answers = [], title } = profile;

    const photos = data.photos ? JSON.parse(data.photos) : {};
    const { highres_link, photo_link, thumb_link } = photos;

    const playerImg = highres_link || photo_link || thumb_link;

    const image = playerImg ? (
        <img src={playerImg} className={componentStyles.playerInfoPhoto} alt={data.name} />
    ) : (
        <Avatar src={playerImg} size={212} shape="square" icon="user" />
    );

    return (
        <div className={componentStyles.playerInfoCard}>
            <div className={componentStyles.playerInfoCardGroup}>
                {image}
                <div className={componentStyles.playerInfoCardBio}>
                    <p className={componentStyles.playerInfoName}>{data.name}</p>
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
    data: PropTypes.shape(),
};

PlayerInfo.defaultProps = {
    data: {},
};

export default PlayerInfo;
