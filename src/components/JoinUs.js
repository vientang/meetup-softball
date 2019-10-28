import React from 'react';
import { useFetchNextMeetupGames } from '../utils/hooks';
import componentStyles from './components.module.css';

const JoinUs = () => {
    const nextGames = useFetchNextMeetupGames();

    if (!nextGames.length) {
        return null;
    }

    const nextGame = nextGames[0];
    const field = nextGame.venue.name;
    const openSpots = nextGame.rsvp_limit - nextGame.yes_rsvp_count;
    return (
        <div className={componentStyles.joinUs}>
            <a
                href={nextGame.link}
                target="_blank"
                rel="noopener noreferrer"
                className={componentStyles.joinUsTitle}
            >
                <small>{`Next game at ${field}!`}</small>
                <strong className={componentStyles.joinUsRemainingCount}>
                    {`${openSpots} spots left`}
                </strong>
            </a>
        </div>
    );
};

export default JoinUs;
