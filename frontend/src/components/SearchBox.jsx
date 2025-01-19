import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './SearchBox.css';

const SearchBox = ({ placeholder, onSearch }) => {
    const [query, setQuery] = useState('');

    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            onSearch(query);
        }
    };

    const handleButtonClick = () => {
        onSearch(query);
    };

    return (
        <div className="search-box">
            <input
                type="text"
                className="search-box__input"
                placeholder={placeholder}
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
            />
            <button
                className="search-box__button"
                onClick={handleButtonClick}
            >
                Search
            </button>
        </div>
    );
};

SearchBox.propTypes = {
    placeholder: PropTypes.string,
    onSearch: PropTypes.func.isRequired,
};

SearchBox.defaultProps = {
    placeholder: 'Search...',
};

export default SearchBox;
