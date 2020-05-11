import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import querySearch from 'stringquery';

import Logo from '../components/Logo';
import Button from '../components/elements/Button';
import Input from '../components/elements/Input';
import CustomLink from '../components/elements/Link';

const mapStateToProps = (state) => ({
	searchResults: state.SearchReducer.searchResults,
	searchTags: state.SearchReducer.searchTags,
	searchLocation: state.SearchReducer.searchLocation,
});

function ConnectedHeader({
	type,
	content,
	searchResults,
	searchTags,
	searchLocation,
}) {
	const [searchContent, setSearchContent] = useState('results');
	const [jobTitle, setJobTitle] = useState('');
	const [jobTitleError, setJobTitleError] = useState('');

	const [location, setLocation] = useState('');
	const [locationError, setLocationError] = useState('');

	const PUBLIC_URL = process.env.REACT_APP_PUBLIC_URL;

	const handleSubmit = (e) => {
		if (jobTitle === '' || location === '') e.preventDefault();
		setJobTitleError(jobTitle === '' ? 'You must add a job title' : '');
		setLocationError(location === '' ? 'You must add a location' : '');
	};

	return (
		<div className="Header">
			{type === 'search' && (
				<div className="Header__search">
					<Logo size="small" />
					{searchContent === 'results' && (
						<div className="Header__search--content resultsView">
							<p>
								{searchResults.length} Results for "{content.jobTitles}" in{' '}
								{content.city}
							</p>
							<div className="Header__serach--buttons">
								<Button
									text="Change Search"
									onClick={() => setSearchContent('search')}
								/>
							</div>
						</div>
					)}
					{searchContent === 'search' && (
						<div className="Header__search--content searchView">
							<div className="Header__search--form">
								<div className="formGroup">
									<p>I'm looking for: </p>
									<Input
										type="text"
										id="jobTitle"
										placeholder="Web developer, Graphic Designer"
										minWidth="350px"
										value={jobTitle}
										handleChange={setJobTitle}
										error={jobTitleError}
									/>
								</div>
								<div className="formGroup">
									<p>In: </p>
									<Input
										type="text"
										id="location"
										placeholder="London"
										value={location}
										handleChange={setLocation}
										error={locationError}
									/>
								</div>
							</div>
							<div className="Header__search--buttons">
								<CustomLink
									to="#"
									type="gray"
									text="Go Back"
									onClick={() => setSearchContent('results')}
								/>
								<Link to={`${PUBLIC_URL}/search`} onClick={handleSubmit}>
									<Button text="Search for candidates" />
								</Link>
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
}

ConnectedHeader.propTypes = {
	type: PropTypes.string.isRequired,
	content: PropTypes.object,
};

const Header = connect(mapStateToProps)(ConnectedHeader);
export default Header;
