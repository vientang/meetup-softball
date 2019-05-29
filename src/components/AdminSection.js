import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import componentStyles from './components.module.css';

const AdminSection = ({ children, iconColor, iconType, title }) => {
    const iconStyle = {
        fontSize: 16,
        marginRight: '0.5rem',
    };

    let theme = 'twoTone';

    if (iconColor) {
        iconStyle.color = iconColor;
        theme = null;
    }

    return (
        <div className={componentStyles.adminSection}>
            <p className={componentStyles.adminSectionTitle}>
                <Icon type={iconType} style={iconStyle} theme={theme} />
                {title}
            </p>
            {children}
        </div>
    );
};

AdminSection.displayName = 'AdminSection';
AdminSection.propTypes = {
    children: PropTypes.node,
    iconColor: PropTypes.string,
    iconType: PropTypes.string,
    title: PropTypes.string,
};

export default AdminSection;
