import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import MeetupIcon from './MeetupIcon';
import componentStyles from './components.module.css';

const IconGroup = ({ types, uri }) => {
    const fontSize = 14;
    const meetupIcon = () => <MeetupIcon size={fontSize} />;
    const iconStyle = {
        verticalAlign: -1,
        color: '#c43045',
        fontSize,
    };
    return (
        <div className={componentStyles.iconGroup}>
            {types.map((icon, i) => {
                const iconLinkStyle = {
                    right: i === 0 ? 100 : 70,
                };
                const socialIcon =
                    icon.type === 'meetup' ? (
                        <Icon component={meetupIcon} style={iconStyle} />
                    ) : (
                        <Icon type={icon.type} style={iconStyle} />
                    );
                return (
                    <a
                        key={icon.type}
                        href={icon.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={iconLinkStyle}
                        className={componentStyles.iconLink}
                    >
                        {socialIcon}
                    </a>
                );
            })}
        </div>
    );
};

IconGroup.displayName = 'IconGroup';
IconGroup.propTypes = {
    types: PropTypes.arrayOf(PropTypes.shape),
    uri: PropTypes.string,
};
IconGroup.defaultProps = {
    types: [],
};

export default IconGroup;
