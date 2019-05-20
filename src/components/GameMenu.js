import React from 'react';
import PropTypes from 'prop-types';
import { Menu } from 'antd';
import componentStyles from './components.module.css';
import 'antd/dist/antd.css';

const sideMenuStyle = {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '100%',
    boxShadow: '0px 0px 20px -15px #243b55',
};

const GameMenu = ({ games, onGameCancel, onGameSelection, selectedGame }) => {
    return (
        <div className={componentStyles.adminSection}>
            <p className={componentStyles.adminSectionTitle}>GAMES MENU</p>
            <Menu style={sideMenuStyle} defaultSelectedKeys={[selectedGame]}>
                {games.map((game) => {
                    const menuItemStyle = getMenuItemStyles(game.meetupId, selectedGame);
                    return (
                        <Menu.Item
                            key={game.meetupId}
                            className={componentStyles.gameMenuItem}
                            style={menuItemStyle}
                            onClick={onGameSelection}
                        >
                            <div className={componentStyles.gameMenuTitleSection}>
                                <p className={componentStyles.gameMenuTitle}>{game.name}</p>
                                <span
                                    id={game.meetupId}
                                    className={componentStyles.gameMenuCloseIcon}
                                    onClick={onGameCancel}
                                >
                                    x
                                </span>
                            </div>
                            <span className={componentStyles.gameMenuDate}>{game.date}</span>
                        </Menu.Item>
                    );
                })}
            </Menu>
        </div>
    );
};

function getMenuItemStyles(meetupId, selectedGame) {
    const menuItemStyle = {
        display: 'flex',
        flexDirection: 'column',
        top: 0,
        height: 'auto',
        padding: '1rem',
        margin: 0,
        lineHeight: 'normal',
        whiteSpace: 'normal',
    };

    if (meetupId === selectedGame) {
        menuItemStyle.backgroundColor = '#FFDEE9';
        menuItemStyle.borderBottom = 2;
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
