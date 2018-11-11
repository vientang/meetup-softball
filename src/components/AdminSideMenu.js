import React from 'react';
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
	lineHeight: '25px' 
};

class AdminSideMenu extends React.Component {

	render() {
		const { games, onGameSelection } = this.props;

		return (
			<Menu
				style={sideMenuStyle}
				defaultSelectedKeys={[this.props.selectedGame]}
				defaultOpenKeys={['sub1']}
				mode="inline"
			>
				{games.map((game, i) => {
					return (
						<Menu.Item 
							key={i}
							style={menuItemStyle}
							onClick={onGameSelection}
						>
							<h4>{game.gameNumber}</h4>
							<span>{game.location}</span>
							<span>{game.date}</span>
						</Menu.Item>
					)
				})}
			</Menu>
		);
	}
}

export default AdminSideMenu;
