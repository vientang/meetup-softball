import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import AdminSection from './AdminSection';
import { getMeridiem } from '../../utils/helpers';
import styles from './dashboard.module.css';

const GameDetails = ({ data }) => {
    if (isEmpty(data)) {
        return null;
    }
    const meridiem = getMeridiem(data.time);

    return (
        <AdminSection title="GAME DETAILS" iconType="schedule">
            <ul className={styles.gameDetailsSection}>
                <li>{data.date}</li>
                <li>{data.field}</li>
                <li>{`@${data.time}${meridiem}`}</li>
                <li>{`Attended: ${data.players.length}`}</li>
                <li>{`RSVP's: ${data.rsvps}`}</li>
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
