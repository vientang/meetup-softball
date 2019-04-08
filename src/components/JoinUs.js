import React from 'react';
import componentStyles from './components.module.css';

// TODO: use hooks to fetch next game data from meetup
const JoinUs = () => {
    return (
        <div className={componentStyles.joinUs}>
            <h3 className={componentStyles.joinUsTitle}>Join us for the next game!</h3>
        </div>
    );
};

export default JoinUs;
