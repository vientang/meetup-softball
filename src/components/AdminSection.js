import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import componentStyles from './components.module.css';

const AdminSection = ({ children, iconColor, iconType, title }) => {
    const iconStyle = {
        fontSize: 16,
        marginRight: '0.5rem',
    };
    let twoToneProps = {
        theme: 'twoTone',
        // twoToneColor: 'green',
    };
    if (iconColor) {
        iconStyle.color = iconColor;
        twoToneProps = null;
    }

    return (
        <div className={componentStyles.adminSection}>
            <p className={componentStyles.adminSectionTitle}>
                <Icon type={iconType} style={iconStyle} {...twoToneProps} />
                {title}
            </p>
            {children}
        </div>
    );
};

AdminSection.displayName = 'AdminSection';
AdminSection.propTypes = {
    children: PropTypes.element,
    iconColor: PropTypes.string,
    iconType: PropTypes.string,
    title: PropTypes.string,
};

export default AdminSection;
