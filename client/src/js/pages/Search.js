import React, { useEffect } from 'react';
import querySearch from 'stringquery';
import axios from 'axios';
import { connect } from 'react-redux';

import SearchResult from '../components/SearchResult';
import InfoBar from '../components/InfoBar';

import {
	updateSearchResults,
	addSearchTag,
	updateSearchLocation,
} from '../redux/actions/SearchActions';

import { updateHeaderView } from '../redux/actions/HeaderActions';

const mapStateToProps = (state) => ({
	loggedUser: state.AuthReducer.loggedUser,
	searchResults: state.SearchReducer.searchResults,
	searchTags: state.SearchReducer.searchTags,
	searchLocation: state.SearchReducer.searchLocation,
});

const mapDispatchToProps = (dispatch) => ({
	updateSearchResults: (results) =>
		dispatch(updateSearchResults(results)),
	addSearchTag: (tag) => dispatch(addSearchTag(tag)),
	updateSearchLocation: (location) =>
		dispatch(updateSearchLocation(location)),
	updateHeaderView: (view) => dispatch(updateHeaderView(view)),
});
function ConnectedSearch(props) {
	useEffect(() => {
		props.updateHeaderView('results');
		const API_URL = process.env.REACT_APP_API_URL;
		const query = querySearch(props.location.search);
		// Generate results without client search
		if (props.searchTags.length === 0) {
			if (query.job1) {
				if (query.job1.includes('%20')) {
					const job1 = query.job1.split('%20').join(' ');
					props.addSearchTag(job1);
				} else {
					props.addSearchTag(query.job1);
				}
			}
			if (query.job2) {
				if (query.job2.includes('%20')) {
					const job2 = query.job2.split('%20').join(' ');
					props.addSearchTag(job2);
				} else {
					props.addSearchTag(query.job2);
				}
			}
			if (query.job3) {
				if (query.job3.includes('%20')) {
					const job3 = query.job3.split('%20').join(' ');
					props.addSearchTag(job3);
				} else {
					props.addSearchTag(query.job3);
				}
			}
		}
		if (props.searchLocation === '') {
			if (query.location.includes('%20')) {
				const location = query.location.split('%20').join(' ');
				props.updateSearchLocation(location);
			} else {
				props.updateSearchLocation(query.location);
			}
		}

		const generateLink = () => {
			let link = `${API_URL}/api/users/job`;
			if (query.job1 && query.job2 && query.job3) {
				link += `/${query.job1}/${query.job2}/${query.job3}/location/${query.location}`;
			} else if (query.job1 && query.job2 && !query.job3) {
				link += `/${query.job1}/${query.job2}/location/${query.location}`;
			} else if (query.job1 && !query.job2 && !query.job3) {
				link += `/${query.job1}/location/${query.location}`;
			} else {
				link += '';
			}
			return link;
		};

		axios
			.get(generateLink(), { withCredentials: true })
			.then((res) => props.updateSearchResults(res.data.users));
	}, [props.location.search]);

	return (
		<div className="Search__content">
			<InfoBar />
			{props.searchResults.map((profile) => (
				<SearchResult profile={profile} key={profile._id} />
			))}
		</div>
	);
}
const Search = connect(
	mapStateToProps,
	mapDispatchToProps
)(ConnectedSearch);
export default Search;
