import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

import Badges from '../components/Badges';
import Button from '../components/elements/Button';
import CustomLink from '../components/elements/Link';
import ConfirmationModal from '../components/ConfirmationModal';
import Alert from '../layout/Alert';

import { updateProfile } from '../redux/actions/ProfileActions';
import { updateHeaderView } from '../redux/actions/HeaderActions';
import { addLoggedUser } from '../redux/actions/AuthActions';

const mapStateToProps = (state) => ({
	loggedUser: state.AuthReducer.loggedUser,
	profile: state.ProfileReducer.profile,
});

const mapDispatchToProps = (dispatch) => ({
	updateProfile: (profile) => dispatch(updateProfile(profile)),
	updateHeaderView: (view) => dispatch(updateHeaderView(view)),
	addLoggedUser: (user) => dispatch(addLoggedUser(user)),
});

const ConnectedProfile = (props) => {
	const {
		profile,
		loggedUser,
		updateProfile,
		updateHeaderView,
		addLoggedUser,
	} = props;

	const history = useHistory();
	const API_URL = process.env.REACT_APP_API_URL;
	const PUBLIC_URL = process.env.REACT_APP_PUBLIC_URL;

	useEffect(() => {
		const uid = props.match.params.id;
		axios
			.get(`${API_URL}/api/users/${uid}`)
			.then((res) => updateProfile(res.data.user))
			.catch((err) => err && history.push(PUBLIC_URL));
		updateHeaderView('profile');
	}, [
		props.match.params.id,
		API_URL,
		PUBLIC_URL,
		history,
		updateHeaderView,
		updateProfile,
	]);

	// Modal
	const [openModal, setOpenModal] = useState(false);

	// Alert
	const [alert, setAlert] = useState({
		type: '',
		text: '',
	});

	// Formating
	const fullName =
		profile.full_name &&
		profile.full_name.first_name + ' ' + profile.full_name.last_name;
	const firstName = profile.full_name && profile.full_name.first_name;

	// Handle User Removal
	const handleDeleteUser = () => {
		// Log user out
		axios
			.get(`${API_URL}/api/logout`, { withCredentials: true })
			.then(() => {
				addLoggedUser({});
			})
			.catch(() => {
				setAlert({
					type: 'error',
					text: 'Something went wrong',
				});
			});
		// Delete user account
		axios
			.delete(`${API_URL}/api/users/${loggedUser._id}`, {
				withCredentials: true,
			})
			.then(() => {
				setAlert({
					type: 'success',
					text:
						'Your account and all the data has been deleted from our system',
				});
				setTimeout(() => (window.location.href = '/'), 1700);
			})
			.catch(() => {
				setAlert({
					type: 'error',
					text: 'Something went wrong',
				});
			});
	};

	return (
		<div className="Profile">
			<Alert type={alert.type} text={alert.text} />
			<ConfirmationModal
				text="Are you sure you want to delete your profile? This action can't be reversed."
				openModal={openModal}
				setOpenModal={setOpenModal}
			>
				<Button
					btnType="button"
					type="delete"
					text="Delete profile"
					onClick={() => handleDeleteUser()}
				/>
			</ConfirmationModal>

			<div className="Profile__header">
				<div className="Profile__header--left">
					{/* Full Name */}
					{profile.full_name && (
						<h1 className="Profile__fullName">{fullName}</h1>
					)}
					{/* Status */}
					{profile.status && (
						<p className="Profile__status">{profile.status}</p>
					)}
					{/* Badges */}
					<div className="Profile__badges">
						<Badges profile={profile} />
					</div>
				</div>
				<div className="Profile__header--right">
					<div
						className="Profile__avatar"
						style={{ backgroundImage: `url(${profile.avatar})` }}
					></div>
				</div>
			</div>

			<div className="Profile__splitView">
				{/* Left side */}
				<div className="Profile__splitView--left">
					{/* Description */}
					{profile.description && (
						<div className="Profile__description">
							<h3 className="Profile__sectionTitle">Description: </h3>

							<p>{profile.description}</p>
						</div>
					)}
					{/* Key abilities */}
					{profile.key_abilities && (
						<div className="Profile__keyAbilities">
							<h3 className="Profile__sectionTitle">
								Key abilities:{' '}
							</h3>
							<ul>
								{profile.key_abilities.map((ability, index) => (
									<li key={index}>{ability}</li>
								))}
							</ul>
						</div>
					)}
					{/* Experience */}
					{profile.experience && (
						<div className="Profile__experience">
							<h3 className="Profile__sectionTitle">Experience: </h3>

							{profile.experience.map((exp) => (
								<div
									div
									className="Profile__experience--single"
									key={exp._id}
								>
									<p className="Profile__experience--jobTitle">
										{exp.job_title}
									</p>
									<p className="Profile__experience--companyName">
										{exp.company_name}
									</p>
									<div className="Profile__experience--date">
										<p className="Profile__experience--startingDate">
											{moment(exp.starting_date).format('MMM') +
												' ' +
												moment(exp.starting_date).format('YYYY') +
												' -'}
										</p>
										<p className="Profile__experience--endingDate">
											{moment(exp.ending_date).format('MMM') +
												' ' +
												moment(exp.ending_date).format('YYYY')}
										</p>
									</div>
									<p className="Profile__experinece--longDesc">
										{exp.long_description}
									</p>
								</div>
							))}
						</div>
					)}
				</div>
				{/* Right side */}
				<div className="Profile__splitView--right">
					{/* Projects */}
					{profile.projects && (
						<div className="Profile__projects">
							<h3 className="Profile__sectionTitle">
								Projects / Achivements / Activities:{' '}
							</h3>

							{profile.projects.map((prj) => (
								<div
									div
									className="Profile__projects--single"
									key={prj._id}
								>
									<p className="Profile__projects--projectTitle">
										{prj.title}
									</p>
									{prj.description && (
										<>
											<p className="Profile__projects--subsectionTitle">
												Description
											</p>
											<p className="Profile__projects--projectDescription">
												{prj.description}
											</p>
										</>
									)}
									{prj.accomplishments && (
										<>
											<p className="Profile__projects--subsectionTitle">
												Accomplishments
											</p>
											<p className="Profile__projects--projectDescription">
												{prj.accomplishments}
											</p>
										</>
									)}
									{prj.link && (
										<div className="Profile__projects--link">
											<span className="Profile__projects--subsectionTitle">
												Link:
											</span>
											<CustomLink
												to={prj.link}
												text={prj.link}
												border={true}
											/>
										</div>
									)}
								</div>
							))}
						</div>
					)}

					{/* Useful links */}
					<div className="Profile__links">
						<h3 className="Profile__sectionTitle">Useful Links:</h3>
						{/* Email */}
						<div className="Profile__links--link">
							<span>Email -</span>
							<CustomLink
								to={profile.email}
								text={profile.email}
								border={true}
							/>
						</div>
						{profile.social_media && (
							<>
								{/* Facebook */}
								{profile.social_media.facebook && (
									<div className="Profile__links--link">
										<span>Facebook -</span>
										<CustomLink
											to={profile.social_media.facebook}
											text={profile.social_media.facebook}
											border={true}
										/>
									</div>
								)}
								{/* Twitter */}
								{profile.social_media.twitter && (
									<div className="Profile__links--link">
										<span>Twitter -</span>
										<CustomLink
											to={profile.social_media.twitter}
											text={profile.social_media.twitter}
											border={true}
										/>
									</div>
								)}
								{/* Instagram */}
								{profile.social_media.instagram && (
									<div className="Profile__links--link">
										<span>Instagram -</span>
										<CustomLink
											to={profile.social_media.instagram}
											text={profile.social_media.instagram}
											border={true}
										/>
									</div>
								)}
								{/* LinkedIn */}
								{profile.social_media.linkedin && (
									<div className="Profile__links--link">
										<span>LinkedIn -</span>
										<CustomLink
											to={profile.social_media.linkedin}
											text={profile.social_media.linkedin}
											border={true}
										/>
									</div>
								)}
								{/* GitHub */}
								{profile.social_media.github && (
									<div className="Profile__links--link">
										<span>GitHub -</span>
										<CustomLink
											to={profile.social_media.github}
											text={profile.social_media.github}
											border={true}
										/>
									</div>
								)}
							</>
						)}
					</div>
					{/* Get in touch */}
					<div className="Profile__getInTouch">
						<h3 className="Profile__sectionTitle">Get in touch:</h3>
						<Link to="#">
							<Button
								text={`Message ${firstName}`}
								type="secondary"
								btnType="button"
							/>
						</Link>
					</div>
				</div>
			</div>
			{profile._id === loggedUser._id && (
				<div className="Profile__buttons">
					<Button text="Edit profile" btnType="button" />
					<Button
						text="Delete profile"
						btnType="button"
						type="delete"
						onClick={() => setOpenModal(true)}
					/>
				</div>
			)}
		</div>
	);
};

const Profile = connect(
	mapStateToProps,
	mapDispatchToProps
)(ConnectedProfile);
export default Profile;
