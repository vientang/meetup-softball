import React from 'react';
import componentStyles from './components.module.css';

// TODO: use hooks to fetch next game data from meetup
const JoinUs = () => {
    return (
        <div className={componentStyles.joinUs}>
            <h3 className={componentStyles.joinUsTitle}>
                <a
                    href="https://www.meetup.com/San-Francisco-Softball-Players/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Join us for the next game!
                </a>
            </h3>
        </div>
    );
};

export default JoinUs;
