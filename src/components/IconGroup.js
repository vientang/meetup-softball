import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import MeetupIcon from './MeetupIcon';
import componentStyles from './components.module.css';

const iconStyle = {
    fontSize: 16,
    color: '#c43045',
};

const IconGroup = ({ types }) => {
    return (
        <div className={componentStyles.iconGroup}>
            {types.map((icon, i) => {
                const iconLinkStyle = {
                    right: i === 0 ? 100 : 70,
                };
                const socialIcon =
                    icon.type === 'meetup' ? (
                        <Icon component={MeetupIcon} />
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
};
IconGroup.defaultProps = {
    types: [],
};

export default IconGroup;
