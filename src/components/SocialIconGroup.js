import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import MeetupIcon from './MeetupIcon';
import componentStyles from './components.module.css';

const SocialIconGroup = ({ types }) => {
    const fontSize = 18;
    const meetupIcon = () => <MeetupIcon size={fontSize} />;
    const iconStyle = {
        verticalAlign: -1,
        padding: '0.1rem',
        color: '#c43045',
        fontSize,
    };
    return (
        <div className={componentStyles.iconGroup}>
            {types.map((icon) => {
                const socialIcon =
                    icon.type === 'meetup' ? (
                        <Icon component={meetupIcon} />
                    ) : (
                        <Icon type={icon.type} style={iconStyle} />
                    );
                return (
                    <a
                        key={icon.type}
                        className={componentStyles.iconLink}
                        href={icon.url}
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        {socialIcon}
                    </a>
                );
            })}
        </div>
    );
};

SocialIconGroup.displayName = 'SocialIconGroup';
SocialIconGroup.propTypes = {
    types: PropTypes.arrayOf(PropTypes.shape),
};
SocialIconGroup.defaultProps = {
    types: [],
};

export default SocialIconGroup;
