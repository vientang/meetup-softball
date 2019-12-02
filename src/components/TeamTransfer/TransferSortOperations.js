import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import styles from './transfer.module.css';

const TransferSortOperations = ({ listType, onMoveDown, onMoveUp }) => (
    <div className={styles.teamTransferSortOperations}>
        {['caret-up', 'caret-down'].map((icon) => (
            <Button
                key={icon}
                id={listType}
                icon={icon}
                type="primary"
                onClick={icon === 'caret-up' ? onMoveUp : onMoveDown}
                size="small"
                shape="circle"
                title={icon === 'caret-up' ? 'Move up' : 'Move down'}
            />
        ))}
    </div>
);

TransferSortOperations.displayName = 'TransferSortOperations';
TransferSortOperations.propTypes = {
    listType: PropTypes.string,
    onMoveDown: PropTypes.func,
    onMoveUp: PropTypes.func,
};
export default TransferSortOperations;
