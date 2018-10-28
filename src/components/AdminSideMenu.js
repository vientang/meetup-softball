import React from 'react';
import { Menu } from 'antd';
import 'antd/dist/antd.css';

const sideMenuStyle = {
  width: 250,
  height: 400,
  border: '1px solid rgba(0, 0, 0, .1)',
};

class AdminSideMenu extends React.Component {
	handleClick = (e) => {
		console.log('click ', e);
	};

	render() {
		return (
			<Menu
				onClick={this.handleClick}
				style={sideMenuStyle}
				defaultSelectedKeys={['1']}
				defaultOpenKeys={['sub1']}
				mode="inline"
			>
				<Menu.Item key="1">Game #153 Westlake September 15th, 2018</Menu.Item>
				<Menu.Item key="2">Game #154 Westlake September 22th, 2018</Menu.Item>
			</Menu>
		);
	}
}

export default AdminSideMenu;
