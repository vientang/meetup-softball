import React from 'react';
import PropTypes from 'prop-types';
import { Menu } from 'antd';
import 'antd/dist/antd.css';
import componentStyles from './components.module.css';

const sideMenuStyle = {
    width: 250,
    height: 400,
    border: '1px solid rgba(0, 0, 0, .1)',
};

const menuItemStyle = {
    display: 'flex',
    flexDirection: 'column',
    height: 'auto',
    lineHeight: '25px',
    padding: '1rem',
    margin: 0,
    whiteSpace: 'normal',
};

class AdminSideMenu extends React.Component {
    handleGameSelection = (e) => {
        this.props.onGameSelection(e.key);
    };

    render() {
        const { games, selectedGame } = this.props;

        if (selectedGame) {
            return (
                <Menu style={sideMenuStyle} defaultSelectedKeys={[selectedGame]} mode="inline">
                    {games.map((game, i) => {
                        return (
                            <Menu.Item
                                key={game.gameId}
                                style={menuItemStyle}
                                onClick={this.handleGameSelection}
                            >
                                <h4 className={componentStyles.sideMenuName}>{game.name}</h4>
                                <span className={componentStyles.sideMenuText}>{game.field}</span>
                                <span className={componentStyles.sideMenuText}>
                                    {game.date} @ {game.time}
                                </span>
                            </Menu.Item>
                        );
                    })}
                </Menu>
            );
        }
        return null;
    }
}

AdminSideMenu.propTypes = {
    games: PropTypes.array,
    onGameSelection: PropTypes.func,
    selectedGame: PropTypes.string,
};

AdminSideMenu.defaultProps = {
    games: [],
};

export default AdminSideMenu;
