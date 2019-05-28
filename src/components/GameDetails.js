import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import AdminSection from './AdminSection';
import componentStyles from './components.module.css';

const GameDetails = ({ data }) => {
    if (isEmpty(data)) {
        return null;
    }
    let meridiem = null;
    if (data.time) {
        meridiem = Number(data.time.substring(0, 2)) < 12 ? 'am' : 'pm';
    }

    return (
        <AdminSection title="GAME DETAILS" iconType="schedule">
            <ul className={componentStyles.gameDetailsSection}>
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
        meetupId: PropTypes.string,
        field: PropTypes.string,
        date: PropTypes.string,
        time: PropTypes.string,
        players: PropTypes.array,
    }),
};

GameDetails.defaultProps = {
    data: {},
};

export default GameDetails;
