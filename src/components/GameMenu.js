import React from 'react';
import PropTypes from 'prop-types';
import { Menu } from 'antd';
import 'antd/dist/antd.css';
import componentStyles from './components.module.css';

const sideMenuStyle = {
    display: 'flex',
    border: '1px solid rgba(0, 0, 0, .1)',
};

const menuItemStyle = {
    display: 'flex',
    flexDirection: 'column',
    height: 'auto',
    width: 275,
    lineHeight: '25px',
    padding: '1rem',
    margin: 0,
    whiteSpace: 'normal',
};

const GameMenu = ({ games, onGameSelection, selectedGame }) => {
    if (selectedGame) {
        return (
            <Menu style={sideMenuStyle} defaultSelectedKeys={[selectedGame]} mode="horizontal">
                {games.map((game) => {
                    return (
                        <Menu.Item
                            key={game.meetupId}
                            style={menuItemStyle}
                            onClick={onGameSelection}
                        >
                            <p className={componentStyles.sideMenuName}>{game.name}</p>
                        </Menu.Item>
                    );
                })}
            </Menu>
        );
    }
    return null;
};

GameMenu.propTypes = {
    games: PropTypes.arrayOf(PropTypes.object),
    onGameSelection: PropTypes.func,
    selectedGame: PropTypes.string,
};

GameMenu.defaultProps = {
    games: [],
};

export default GameMenu;
