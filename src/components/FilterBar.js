import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Dropdown, Menu, Icon } from 'antd';
import componentStyles from './components.module.css';

const menu = (
    <Menu>
        <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
                January
            </a>
        </Menu.Item>
        <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
                February
            </a>
        </Menu.Item>
        <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
                All months
            </a>
        </Menu.Item>
    </Menu>
);

class FilterBar extends Component {
    render() {
        return (
            <Row gutter={16}>
                <Col span={3}>
                    <Dropdown overlay={menu}>
                        <span className={componentStyles.filterBarLabel}>
                            Year <Icon type="down" />
                        </span>
                    </Dropdown>
                </Col>
                <Col span={3}>
                    <Dropdown overlay={menu}>
                        <span className={componentStyles.filterBarLabel}>
                            Month <Icon type="down" />
                        </span>
                    </Dropdown>
                </Col>
                <Col span={3}>
                    <Dropdown overlay={menu}>
                        <span className={componentStyles.filterBarLabel}>
                            Field <Icon type="down" />
                        </span>
                    </Dropdown>
                </Col>
                <Col span={3}>
                    <Dropdown overlay={menu}>
                        <span className={componentStyles.filterBarLabel}>
                            Tournament <Icon type="down" />
                        </span>
                    </Dropdown>
                </Col>
                <Col span={3}>
                    <Dropdown overlay={menu}>
                        <span className={componentStyles.filterBarLabelReset}>
                            <Icon type="filter" /> reset filters
                        </span>
                    </Dropdown>
                </Col>
            </Row>
        );
    }
}

// FilterBar.propTypes = {

// };
// FilterBar.defaultProps = {

// }
export default FilterBar;
