import React from 'react';
import PropTypes from 'prop-types';
import Winners from '../Winners';
import Losers from '../Losers';
import styles from './transfer.module.css';

const muBlue1 = '#1890ff';
const muBlue2 = '#2d72d9';
const muRed1 = '#c43045';
const muRed2 = '#962737';
const white = '#ffffff';

const TransferHeader = ({ listType, playerCount }) => {
    const winnerLogoStyle = { transform: 'translate(-80px, -20px)' };
    const loserLogoStyle = { transform: 'translate(-140px, -20px)', fill: white };
    const headerStyle = {
        background:
            listType === 'WINNERS'
                ? `linear-gradient(172deg, ${muBlue2}, ${muBlue1})`
                : `linear-gradient(172deg, ${muRed2}, ${muRed1})`,
    };
    return (
        <div className={styles.teamTransferHeader} style={headerStyle}>
            <span className={styles.teamTransferTitle}>
                {listType === 'WINNERS' ? (
                    <Winners gStyle={winnerLogoStyle} size={20} />
                ) : (
                    <Losers gStyle={loserLogoStyle} size={20} />
                )}
                {listType}
            </span>
            <span className={styles.teamTransferBoxCount}>{playerCount}</span>
        </div>
    );
};

TransferHeader.displayName = 'TransferHeader';
TransferHeader.propTypes = {
    listType: PropTypes.string,
    playerCount: PropTypes.number,
};
export default TransferHeader;
