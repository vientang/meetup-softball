import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import styles from './dashboard.module.css';

const AdminSection = ({ children, iconColor, iconType, style, title, titleStyle, theme }) => {
    const iconStyle = {
        fontSize: 16,
        marginRight: '0.5rem',
    };

    let iconTheme = theme;

    if (iconColor) {
        iconStyle.color = iconColor;
        iconTheme = null;
    }

    return (
        <div className={styles.adminSection} style={style}>
            <p className={styles.adminSectionTitle} style={titleStyle}>
                {iconType && <Icon type={iconType} style={iconStyle} theme={iconTheme} />}
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
    style: PropTypes.shape(),
    title: PropTypes.string,
    titleStyle: PropTypes.shape(),
    theme: PropTypes.string,
};
AdminSection.defaultProps = {
    theme: 'twoTone',
};
export default AdminSection;
