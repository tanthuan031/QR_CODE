import React from 'react';
import PropTypes from 'prop-types';
import { Button, Dropdown, Form, InputGroup } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { IoMdArrowDropdown } from 'react-icons/io';

const SearchOptions = (props) => {
  const { setSearch, setFilter, currentFilter } = props;
  const [label, setLabel] = React.useState('Search');
  const [searchValue, setSearchValue] = React.useState('');
  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchValue);
  };
  return (
    <Form className="ms-3" onSubmit={(e) => handleSearch(e)}>
      <InputGroup>
        <Dropdown className="ml-4">
          <Dropdown.Toggle
            id="user-type-filter-btn"
            className="btn-danger filter-button d-flex align-items-center justity-content-center mr-2"
          >
            <p className="flex-grow-1 font-weight-bold">{label}</p>
            <div className="fb-icon">
              <IoMdArrowDropdown />
            </div>
          </Dropdown.Toggle>
          <Dropdown.Menu id="user-type-filter-menu">
            <Dropdown.Item onClick={() => setFilter('provider')}>
              <Form.Check
                type="radio"
                id="checkbox-all"
                className="mx-4 my-2 font-weight-bold"
                label="Provider"
                checked={currentFilter === 'provider'}
                onChange={() => {
                  setFilter('provider');
                  setLabel('provider');
                }}
              />
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setFilter('product')}>
              <Form.Check
                type="radio"
                id="checkbox-admin"
                className="mx-4 my-2 font-weight-bold"
                label="Product"
                checked={currentFilter === 'product'}
                onChange={() => {
                  setFilter('product');
                  setLabel('product');
                }}
              />
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Form.Control
          id="search-user"
          placeholder="Code Product or Provider"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <Button id="search-user" variant="danger" type="submit">
          <FaSearch />
        </Button>
      </InputGroup>
    </Form>
  );
};

SearchOptions.propTypes = {
  currentFilter: PropTypes.string,
  setFilter: PropTypes.func,
  setSearch: PropTypes.func,
};

export default SearchOptions;
