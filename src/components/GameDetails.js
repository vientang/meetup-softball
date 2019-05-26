import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import isEmpty from 'lodash/isEmpty';
import componentStyles from './components.module.css';

const iconStyle = {
    fontSize: 16,
    marginRight: '0.5rem',
};

const GameDetails = ({ data }) => {
    return (
        <div className={componentStyles.adminSection}>
            <p className={componentStyles.adminSectionTitle}>
                <Icon type="schedule" theme="twoTone" style={iconStyle} />
                GAME DETAILS
            </p>
            <Details data={data} />
        </div>
    );
};

/* eslint-disable-next-line react/prop-types */
function Details({ data }) {
    if (isEmpty(data)) {
        return null;
    }
    let meridiem = null;
    if (data.time) {
        meridiem = Number(data.time.substring(0, 2)) < 12 ? 'am' : 'pm';
    }
    return (
        <>
            <p className={componentStyles.adminSectionTitle}>{data.field}</p>
            <p className={componentStyles.adminSectionTitle}>{`@${data.time}${meridiem}`}</p>
            <p className={componentStyles.adminSectionTitle}>
                {`Attended: ${data.players.length}`}
            </p>
            <p className={componentStyles.adminSectionTitle}>{`RSVP's: ${data.rsvps}`}</p>
        </>
    );
}

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
