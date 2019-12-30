import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import upperFirst from 'lodash/upperFirst';
import AdminSection from './AdminSection';
import { getMeridiem } from '../../utils/helpers';
import styles from './dashboard.module.css';

const GameDetails = ({ data }) => {
    if (isEmpty(data)) {
        return null;
    }
    const meridiem = getMeridiem(data.time);
    const fieldName = data.field
        .split(' ')
        .map((name) => upperFirst(name))
        .join(' ');
    return (
        <AdminSection title="GAME DETAILS" iconType="schedule">
            <ul className={styles.gameDetailsSection}>
                <li className={styles.gameDetailsDate}>{data.date}</li>
                <li className={styles.gameDetailsInfo}>
                    {`${fieldName} @${data.time}${meridiem}`}
                </li>
                <li className={styles.gameDetailsAttended}>{`Attended: ${data.players.length}`}</li>
                <li className={styles.gameDetailsRsvps}>{`RSVP's: ${data.rsvps}`}</li>
            </ul>
        </AdminSection>
    );
};

GameDetails.propTypes = {
    data: PropTypes.shape({
        date: PropTypes.string,
        field: PropTypes.string,
        time: PropTypes.string,
        players: PropTypes.array,
        rsvps: PropTypes.number,
    }),
};

GameDetails.defaultProps = {
    data: {},
};

export default GameDetails;
