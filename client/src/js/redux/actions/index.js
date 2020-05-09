import {
	ADD_ARTICLE,
	DATA_LOADED,
	ADD_LOGGED_USER,
	ADD_SEARCH_TAG,
} from '../constants/action-types';

export function addArticle(payload) {
	return { type: ADD_ARTICLE, payload };
}

export function getData() {
	return function (dispatch) {
		return fetch('https://jsonplaceholder.typicode.com/posts')
			.then((response) => response.json())
			.then((payload) => {
				dispatch({ type: DATA_LOADED, payload });
			});
	};
}

export function addLoggedUser(payload) {
	return { type: ADD_LOGGED_USER, payload };
}

export function addSearchTag(payload) {
	return { type: ADD_SEARCH_TAG, payload };
}
