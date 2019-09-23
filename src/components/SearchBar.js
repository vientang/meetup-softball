import React from 'react';
import PropTypes from 'prop-types';
import { Link, navigate } from 'gatsby';
import { Icon, Input, AutoComplete } from 'antd';
import { fetchAllPlayers, clearAllPlayers } from '../utils/apiService';
import componentStyles from './components.module.css';

const { Option } = AutoComplete;

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            players: [],
            searchList: [],
            value: '',
        };
    }

    componentDidMount = async () => {
        const { disabled } = this.props;
        this.mounted = true;

        if (!disabled) {
            const allPlayers = await fetchAllPlayers({ limit: 500 });
            
            if (allPlayers && allPlayers.length > 0 && this.mounted) {
                const playersAsOptions = renderOptions(allPlayers);
                this.setState(() => ({
                    players: playersAsOptions,
                    searchList: playersAsOptions,
                }));
            }
        }

        clearAllPlayers();
    };

    componentDidUpdate = async () => {
        const { disabled } = this.props;
        const { searchList, players, value } = this.state;
        this.mounted = true;
        if (!disabled && !searchList.length && !players.length) {
            const allPlayers = await fetchAllPlayers({ limit: 500 });
            
            if (allPlayers && allPlayers.length > 0 && this.mounted) {
                const playersAsOptions = renderOptions(allPlayers);                
                this.setState(() => ({
                    players: playersAsOptions,
                    searchList: playersAsOptions,
                }));
            }
        }

        clearAllPlayers();
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    handleSearch = (value) => {
        this.setState((prevState) => ({ searchList: filterOptions(prevState.players, value) }));
    };

    handleSelect = (value, instance) => {
        navigate(`/player?/id=${instance.key}`);
        this.setState(() => ({ value: instance.props.name }));
    };

    handleChange = (value) => {
        this.setState(() => ({ value }));
    };

    render() {
        const { disabled } = this.props;
        const { searchList, value } = this.state;

        const dropdownStyle = { width: 200, fontSize: 12 };
        const autoCompleteStyle = { width: 150, fontSize: 12 };

        return (
            <div className={componentStyles.searchBarContainer}>
                <AutoComplete
                    dataSource={searchList}
                    disabled={disabled}
                    dropdownMatchSelectWidth={false}
                    dropdownStyle={dropdownStyle}
                    onChange={this.handleChange}
                    onSelect={this.handleSelect}
                    onSearch={this.handleSearch}
                    optionLabelProp="name"
                    placeholder="Search for player"
                    size="small"
                    style={autoCompleteStyle}
                    value={value}
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

/**
 * Change the background of the page when in search mode
 * @param {Boolean} searchMode
 */
function changeListTheme(searchMode) {
    if (searchMode) {
        document.body.style.setProperty('--transfer-list-background', 'rgba(0, 0, 0, 0.5)');
    } else {
        document.body.style.setProperty('--transfer-list-background', '#ffffff');
    }
}

SearchBar.displayName = 'SearchBar';
/* eslint-disable react/no-unused-prop-types */
SearchBar.propTypes = {
    disabled: PropTypes.bool,
};

SearchBar.defaultProps = {
    disabled: false,
};

export default SearchBar;
