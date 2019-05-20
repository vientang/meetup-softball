import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { Link, navigate } from 'gatsby';
import { Icon, Input, AutoComplete } from 'antd';
import { createSlug } from '../utils/helpers';
import componentStyles from './components.module.css';

const { Option } = AutoComplete;

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allPlayerData: props.allPlayers,
        };
    }

    componentDidMount = () => {
        if (this.props.allPlayers.length === 0) {
            this.setState(() => ({
                allPlayerData: renderOptions(this.props.allPlayers),
            }));
        }
    };

    handleSearch = (value) => {
        const filteredOptions = filterOptions(this.props.allPlayers, value);
        this.setState(() => ({ allPlayerData: filteredOptions }));
    };

    handleSelect = (value, instance) => {
        const slug = createSlug(value);
        const childState = get(instance, 'props.children.props.state', {});

        navigate(`/player?name=${slug}`, {
            state: { player: childState.player },
        });
    };

    render() {
        const dropdownStyle = { width: 200, fontSize: 12 };
        const autoCompleteStyle = { width: 150, fontSize: 12 };
        return (
            <div className={componentStyles.searchBarContainer}>
                <AutoComplete
                    dataSource={this.state.allPlayerData}
                    dropdownMatchSelectWidth={false}
                    dropdownStyle={dropdownStyle}
                    onSelect={this.handleSelect}
                    onSearch={this.handleSearch}
                    optionLabelProp="value"
                    placeholder="Search for player"
                    size="small"
                    style={autoCompleteStyle}
                >
                    <Input suffix={<Icon type="search" />} />
                </AutoComplete>
            </div>
        );
    }
}

function filterOptions(playerData, value) {
    return playerData
        .filter((player) => {
            return player.name.toLowerCase().includes(value.toLowerCase());
        })
        .map((player) => (
            <Option key={player.meetupId} value={player.name}>
                {renderPlayerLink(player)}
            </Option>
        ));
}

function renderOptions(allPlayers) {
    return allPlayers.map((player) => (
        <Option key={player.meetupId} value={player.name}>
            {this.renderPlayerLink(player)}
        </Option>
    ));
}

function renderPlayerLink(player) {
    const slug = createSlug(player.name);

    return (
        <Link to={`/player?name=${slug}`} state={{ player }}>
            {player.name}
        </Link>
    );
}

SearchBar.propTypes = {
    allPlayers: PropTypes.arrayOf(PropTypes.shape),
};

SearchBar.defaultProps = {
    allPlayers: [],
};

export default SearchBar;
