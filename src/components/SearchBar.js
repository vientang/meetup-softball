import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, navigate } from 'gatsby';
import { Icon, Input, AutoComplete } from 'antd';
import DataContext from '../context/DataContext';
import componentStyles from './components.module.css';
import { usePlayerInfo } from '../utils/hooks';

const { Option } = AutoComplete;

const SearchBar = ({ disabled }) => {
    const [value, setValue] = useState('');
    const [filteredSearchList, setFilteredSearchList] = useState(null);
    const { players } = usePlayerInfo(disabled);

    const handleSearch = (value) => {
        setFilteredSearchList(filterOptions(players, value));
    };

    const handleSelect = (value, instance) => {
        navigate(`/player?/id=${instance.key}`);
        setValue(instance.props.name);
    };

    const handleChange = (value) => {
        setValue(value);
    };

    const dropdownStyle = { width: 200, fontSize: 12 };
    const autoCompleteStyle = { width: 150, fontSize: 12 };

    const searchList = filteredSearchList || renderOptions(players);

    return (
        <DataContext.Consumer>
            {(context) => {
                return (
                    <div className={componentStyles.searchBarContainer}>
                        <AutoComplete
                            dataSource={searchList}
                            disabled={disabled}
                            dropdownMatchSelectWidth={false}
                            dropdownStyle={dropdownStyle}
                            onChange={handleChange}
                            onSelect={handleSelect}
                            onSearch={handleSearch}
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
            }}
        </DataContext.Consumer>
    );
};

function filterOptions(players, value) {
    return players
        .filter((player) => {
            return player.name ? player.name.toLowerCase().includes(value.toLowerCase()) : false;
        })
        .map((player) => {
            const { id, name } = player;
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
