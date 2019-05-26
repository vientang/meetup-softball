import React from 'react';
import PropTypes from 'prop-types';
import componentStyles from './components.module.css';

const GameMenu = (props) => (
    <div className={componentStyles.adminSection}>
        <p className={componentStyles.adminSectionTitle}>GAMES MENU</p>
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
            const menuItemStyle = getMenuItemStyles(game.meetupId, selectedGame);
            gamesByDate.push(
                <div
                    key={game.meetupId}
                    className={componentStyles.gameMenuTimeSection}
                    style={menuItemStyle}
                >
                    <span
                        id={game.meetupId}
                        className={componentStyles.gameMenuTime}
                        onClick={onGameSelection}
                    >
                        {game.time}
                    </span>
                    <span
                        id={game.meetupId}
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

function getMenuItemStyles(meetupId, selectedGame) {
    const menuItemStyle = {};

    if (meetupId === selectedGame) {
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
