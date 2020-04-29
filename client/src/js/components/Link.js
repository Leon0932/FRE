import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Icons from '@fortawesome/free-solid-svg-icons';

// Use all icons instead of one at the time
const iconList = Object.keys(Icons)
	.filter((key) => key !== 'fas' && key !== 'prefix')
	.map((icon) => Icons[icon]);
library.add(...iconList);

function CustomLink({ to, text, type, border, icon }) {
	return (
		<Link
			className={`link 
				${type === 'gray' && 'gray-link'} 
				${type === 'blue' && 'blue-link'} 
				${type === 'red' && 'red-link'}
				${!type && 'link-primary'}
				${!border && 'no-border'}
			`}
			to={to}
		>
			{text} {icon && <FontAwesomeIcon icon={icon} className="link-icon" />}
		</Link>
	);
}

CustomLink.propTypes = {
	text: PropTypes.string.isRequired,
};

export default CustomLink;
