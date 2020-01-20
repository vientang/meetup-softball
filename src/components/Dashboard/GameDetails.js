import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import upperFirst from 'lodash/upperFirst';
import { Icon } from 'antd';
import AdminSection from './AdminSection';
import { getMeridiem } from '../../utils/helpers';
import styles from './dashboard.module.css';

const closeIconStyle = { position: 'absolute', right: 0, fontWeight: 'bold', fontSize: 12 };

const GameDetails = ({ data, onGameCancel }) => {
    if (isEmpty(data)) {
        return null;
    }
    const handleCancelGame = (e) => {
        onGameCancel(e, data.id);
    };

    const meridiem = getMeridiem(data.time);
    const fieldName = data.field
        .split(' ')
        .map((name) => upperFirst(name))
        .join(' ');
    return (
        <AdminSection title="GAME DETAILS" iconType="schedule">
            <ul className={styles.gameDetailsSection}>
                <Icon
                    type="close-circle"
                    theme="filled"
                    style={closeIconStyle}
                    onClick={handleCancelGame}
                />
                <li className={styles.gameDetailsDate}>{data.date}</li>
                <li className={styles.gameDetailsInfo}>
                    {`${fieldName} @${data.time}${meridiem}`}
                </li>
                <li className={styles.gameDetailsAttended}>
                    <div>{`Attended: ${data.players.length}`}</div>
                    <div>{`RSVP's: ${data.rsvps}`}</div>
                </li>
            </ul>
        </AdminSection>
    );
};

GameDetails.propTypes = {
    data: PropTypes.shape({
        date: PropTypes.string,
        field: PropTypes.string,
        id: PropTypes.string,
        name: PropTypes.string,
        players: PropTypes.array,
        rsvps: PropTypes.number,
        time: PropTypes.string,
    }),
    onGameCancel: PropTypes.func,
};

GameDetails.defaultProps = {
    data: {},
};

export default GameDetails;
