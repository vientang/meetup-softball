import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import { getMeridiem } from '../../utils/helpers';
import styles from './dashboard.module.css';

const iconStyle = {
    fontSize: 16,
    marginRight: '0.5rem',
};

const GameMenu = (props) => (
    <div className={styles.adminSection}>
        <p className={styles.adminSectionTitle}>
            <Icon type="profile" theme="twoTone" style={iconStyle} />
            GAMES MENU
        </p>
        <ul className={styles.gameMenu}>
            <MenuItems {...props} />
        </ul>
    </div>
);

function MenuItems(props) {
    const { games } = props;
    const datesPlayed = getDatesPlayed(games);

    return datesPlayed.map((date) => {
        return (
            <li key={date} className={styles.gameMenuItem}>
                <p className={styles.gameMenuTitle}>{date.toUpperCase()}</p>
                {getGamesByDate(games, date, props).map((game) => game)}
            </li>
        );
    });
}

function getDatesPlayed(games) {
    const gameDates = [];
    let currentDate = '';
    games.forEach((game) => {
        if (currentDate !== game.date) {
            gameDates.push(game.date);
            currentDate = game.date;
        }
    });
    return gameDates;
}

function getGamesByDate(games, date, props) {
    const gamesByDate = [];
    games.forEach((game) => {
        if (game.date === date) {
            const { onGameCancel, onGameSelection, selectedGame } = props;
            const menuItemStyle = getMenuItemStyles(game.id, selectedGame);
            const meridiem = getMeridiem(game.time);

            gamesByDate.push(
                <div key={game.id} className={styles.gameMenuTimeSection} style={menuItemStyle}>
                    <span id={game.id} className={styles.gameMenuTime} onClick={onGameSelection}>
                        {game.time}
                        {meridiem}
                    </span>
                    <span id={game.id} className={styles.gameMenuCloseIcon} onClick={onGameCancel}>
                        x
                    </span>
                </div>,
            );
        }
    });

    return gamesByDate;
}

function getMenuItemStyles(id, selectedGame) {
    const menuItemStyle = {};

    if (id === selectedGame) {
        menuItemStyle.backgroundColor = '#FFDEE9';
    }

    return menuItemStyle;
}

GameMenu.propTypes = {
    games: PropTypes.arrayOf(PropTypes.object),
    onGameCancel: PropTypes.func,
    onGameSelection: PropTypes.func,
    selectedGame: PropTypes.string,
};

GameMenu.defaultProps = {
    games: [],
};

export default GameMenu;
