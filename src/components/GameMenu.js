import React from 'react';
import PropTypes from 'prop-types';
import { Menu } from 'antd';
import 'antd/dist/antd.css';
import componentStyles from './components.module.css';

const sideMenuStyle = {
    display: 'flex',
    border: '1px solid rgba(0, 0, 0, .1)',
    height: 100,
};

const getMenuItemStyles = (meetupId, selectedGame) => {
    const menuItemStyle = {
        display: 'flex',
        flexDirection: 'column',
        top: 0,
        height: 'auto',
        width: 275,
        padding: '1rem',
        margin: '0 0.5rem 0 0',
        lineHeight: 'normal',
        whiteSpace: 'normal',
    };

    if (meetupId === selectedGame) {
        menuItemStyle.backgroundColor = '#FFDEE9';
        menuItemStyle.backgroundImage = 'linear-gradient(0deg, #FFDEE9 0%, #B5FFFC 100%)';
        menuItemStyle.borderBottom = 2;
    }

    return menuItemStyle;
};

const GameMenu = ({ games, onGameCancel, onGameSelection, selectedGame }) => {
    return (
        <Menu style={sideMenuStyle} defaultSelectedKeys={[selectedGame]} mode="horizontal">
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
    );
};

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
