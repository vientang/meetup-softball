import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { Link, navigate } from 'gatsby';
import { Icon, Input, AutoComplete } from 'antd';
import componentStyles from './components.module.css';

const { Option } = AutoComplete;

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playerData: props.playerData,
        };
    }

    componentDidMount = () => {
        if (this.props.playerData.length === 0) {
            this.setState(() => ({
                playerData: this.renderOptions(this.props.playerData),
            }));
        }
    };

    createSlug = (name) =>
        name
            .split(' ')
            .join('_')
            .toLowerCase();

    renderPlayerLink = (player) => {
        const games = JSON.parse(player.games);
        const slug = this.createSlug(player.name);

        return (
            <Link
                to={`/player?name=${slug}`}
                state={{
                    playerId: player.meetupId,
                    playerName: player.name,
                    playerStats: games,
                    player,
                }}
            >
                {player.name}
            </Link>
        );
    };

    renderOptions = (playerData) => {
        return playerData.map((player) => (
            <Option key={player.meetupId} value={player.name}>
                {this.renderPlayerLink(player)}
            </Option>
        ));
    };

    filterOptions = (playerData, value) =>
        playerData
            .filter((player) => {
                return player.name.toLowerCase().includes(value.toLowerCase());
            })
            .map((player) => (
                <Option key={player.meetupId} value={player.name}>
                    {this.renderPlayerLink(player)}
                </Option>
            ));

    handleSearch = (value) => {
        const filteredOptions = this.filterOptions(this.props.playerData, value);
        this.setState(() => ({ playerData: filteredOptions }));
    };

    handleSelect = (value, instance) => {
        const slug = this.createSlug(value);
        const state = get(instance, 'props.children.props.state', {});
        navigate(`/player?name=${slug}`, {
            state: { ...state },
        });
    };

    render() {
        const dropdownStyle = { width: 200, fontSize: 12 };
        const autoCompleteStyle = { width: 150, fontSize: 12 };
        return (
            <div className={componentStyles.searchBarContainer}>
                <AutoComplete
                    dataSource={this.state.playerData}
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

SearchBar.propTypes = {
    playerData: PropTypes.arrayOf(PropTypes.shape),
};

SearchBar.defaultProps = {
    playerData: [],
};

export default SearchBar;
