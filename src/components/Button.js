import React from 'react';
import PropTypes from 'prop-types';
import { Button as AntDButton, Tooltip } from 'antd';

const tooltipStyle = { fontSize: '0.6rem' };

const btnStyle = {
    display: 'flex',
    width: 'max-content',
    marginLeft: 'auto',
    fontSize: 'calc(0.4rem + 0.4vmin)',
};

const Button = (props) => {
    const { children, disabled, onClick, size, tooltipMsg, tooltipPlacement, type } = props;

    if (disabled) {
        return (
            <Tooltip title={tooltipMsg} placement={tooltipPlacement} overlayStyle={tooltipStyle}>
                <AntDButton
                    disabled={disabled}
                    onClick={onClick}
                    type={type}
                    style={btnStyle}
                    size={size}
                >
                    {children}
                </AntDButton>
            </Tooltip>
        );
    }
    return (
        <AntDButton disabled={disabled} onClick={onClick} type={type} style={btnStyle} size={size}>
            {children}
        </AntDButton>
    );
};

Button.displayName = 'Button';
Button.propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    size: PropTypes.string,
    tooltipMsg: PropTypes.string,
    tooltipPlacement: PropTypes.string,
    type: PropTypes.string,
};

Button.defaultProps = {
    disabled: false,
    size: 'small',
    tooltipPlacement: 'right',
    type: 'primary',
};

export default Button;
