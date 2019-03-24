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

const menuItemStyle = {
    display: 'flex',
    flexDirection: 'column',
    height: 'auto',
    width: 275,
    lineHeight: 'normal',
    padding: '1rem',
    margin: '0 0.5rem',
    whiteSpace: 'normal',
};

const GameMenu = ({ games, onGameCancel, onGameSelection, selectedGame }) => {
    return (
        <Menu style={sideMenuStyle} defaultSelectedKeys={[selectedGame]} mode="horizontal">
            {games.map((game) => {
                return (
                    <Menu.Item key={game.meetupId} style={menuItemStyle} onClick={onGameSelection}>
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
