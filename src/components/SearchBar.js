import React from 'react';
import { Link, navigate } from 'gatsby';
import { Icon, Input, AutoComplete } from 'antd';
import { fetchAllPlayers } from '../utils/apiService';
import componentStyles from './components.module.css';

const { Option } = AutoComplete;

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            players: [],
            searchList: [],
        };
    }

    componentDidMount = async () => {
        this.mounted = true;
        const players = await fetchAllPlayers({ limit: 1000 });

        if (players && players.length > 0 && this.mounted) {
            const allPlayers = renderOptions(players);
            this.setState(() => ({
                players: allPlayers,
                searchList: allPlayers,
            }));
        }
    };

    componentWillUnmount() {
        this.mounted = false;
    }

    handleSearch = (value) => {
        this.setState((prevState) => ({ searchList: filterOptions(prevState.players, value) }));
    };

    handleSelect = (value, instance) => {
        navigate(`/player?/id=${instance.key}`);
    };

    render() {
        const { searchList } = this.state;
        const dropdownStyle = { width: 200, fontSize: 12 };
        const autoCompleteStyle = { width: 150, fontSize: 12 };
        return (
            <div className={componentStyles.searchBarContainer}>
                <AutoComplete
                    dataSource={searchList}
                    dropdownMatchSelectWidth={false}
                    dropdownStyle={dropdownStyle}
                    onSelect={this.handleSelect}
                    onSearch={this.handleSearch}
                    optionLabelProp="name"
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
        .filter((player) => {
            return player.props.name
                ? player.props.name.toLowerCase().includes(value.toLowerCase())
                : false;
        })
        .map((player) => {
            const { id, name } = player.props;
            return (
                <Option key={id} value={`${name}-${id}`} name={name} id={id}>
                    <Link to={`/player?id=${id}`}>{name}</Link>
                </Option>
            );
        });
}

function renderOptions(players) {
    return players.map((player) => {
        const { id, name } = player;
        return (
            <Option key={id} value={`${name}-${id}`} name={name} id={id}>
                <Link to={`/player?id=${id}`}>{name}</Link>
            </Option>
        );
    });
}

export default SearchBar;
