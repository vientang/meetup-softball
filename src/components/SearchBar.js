import React from 'react';
import get from 'lodash/get';
import { Link, navigate } from 'gatsby';
import { Icon, Input, AutoComplete } from 'antd';
import { fetchAllPlayers } from '../utils/helpers';
import componentStyles from './components.module.css';

const { Option } = AutoComplete;

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            players: [],
        };
    }

    componentDidMount = async () => {
        this.mounted = true;
        const players = await fetchAllPlayers();
        if (players && players.length > 0 && this.mounted) {
            this.setState(() => ({
                players: renderOptions(players),
            }));
        }
    };

    componentWillUnmount() {
        this.mounted = false;
    }

    handleSearch = (value) => {
        this.setState((prevState) => ({ players: filterOptions(prevState.players, value) }));
    };

    handleSelect = (value, instance) => {
        const childState = get(instance, 'props.children.props.state', {});

        navigate(`/player?/id=${childState.playerId}`);
    };

    render() {
        const dropdownStyle = { width: 200, fontSize: 12 };
        const autoCompleteStyle = { width: 150, fontSize: 12 };
        return (
            <div className={componentStyles.searchBarContainer}>
                <AutoComplete
                    dataSource={this.state.players}
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

function filterOptions(players, value) {
    return players
        .filter((player) => player.name.toLowerCase().includes(value.toLowerCase()))
        .map((player) => (
            <Option key={player.id} value={player.name}>
                <Link to={`/player?id=${player.id}`}>{player.name}</Link>
            </Option>
        ));
}

function renderOptions(players) {
    return players.map((player) => (
        <Option key={player.id} value={player.name}>
            <Link to={`/player?id=${player.id}`}>{player.name}</Link>
        </Option>
    ));
}

export default SearchBar;
