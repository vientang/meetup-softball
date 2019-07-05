import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import { getMeridiem } from '../utils/helpers';
import componentStyles from './components.module.css';

const iconStyle = {
    fontSize: 16,
    marginRight: '0.5rem',
};

const GameMenu = (props) => (
    <div className={componentStyles.adminSection}>
        <p className={componentStyles.adminSectionTitle}>
            <Icon type="profile" theme="twoTone" style={iconStyle} />
            GAMES MENU
        </p>
        <ul className={componentStyles.gameMenu}>
            <MenuItems {...props} />
        </ul>
    </div>
);

function MenuItems(props) {
    const { games } = props;
    const datesPlayed = getDatesPlayed(games);

    return datesPlayed.map((date) => {
        return (
            <li key={date} className={componentStyles.gameMenuItem}>
                <p className={componentStyles.gameMenuTitle}>{date.toUpperCase()}</p>
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
                <div
                    key={game.id}
                    className={componentStyles.gameMenuTimeSection}
                    style={menuItemStyle}
                >
                    <span
                        id={game.id}
                        className={componentStyles.gameMenuTime}
                        onClick={onGameSelection}
                    >
                        {game.time}
                        {meridiem}
                    </span>
                    <span
                        id={game.id}
                        className={componentStyles.gameMenuCloseIcon}
                        onClick={onGameCancel}
                    >
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
