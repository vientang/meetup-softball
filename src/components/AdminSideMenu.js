import React from 'react';
import PropTypes from 'prop-types';
import { Menu } from 'antd';
import 'antd/dist/antd.css';

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
};

class AdminSideMenu extends React.Component {

    handleGameSelection = (e) => {
        this.props.onGameSelection(e.key);
    }

	render() {
		const { games } = this.props;
        
		return (
			<Menu
				style={sideMenuStyle}
				defaultSelectedKeys={[this.props.selectedGame]}
				mode="inline"
			>
				{games.map((game, i) => {
					return (
						<Menu.Item 
							key={game.gameId}
							style={menuItemStyle}
							onClick={this.handleGameSelection}
						>
							<h4>{game.gameId}</h4>
							<span>{game.location}</span>
							<span>{game.date}</span>
                            <span>{game.time}</span>
						</Menu.Item>
					)
				})}
			</Menu>
		);
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
