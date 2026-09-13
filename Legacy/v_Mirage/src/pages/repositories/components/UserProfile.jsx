import React from "react";
import { RiGitRepositoryFill, RiUserFollowLine } from "react-icons/ri";

const UserProfile = ({ user }) => {
	if (!user) return null;

	return (
		<div className="user">
			<div className="avatar">
				<img src="https://github.com/huebyte.png" alt="huebyte" />
			</div>
			<div className="user-info">
				<div className="name">🍧 {user.login} 🍧</div>
				<div className="bio">{user.bio}</div>
				<div className="field">
					<div className="key">
						<RiGitRepositoryFill />
						Repositories:~ ${" "}
					</div>
					<div className="value">{user.public_repos}</div>
				</div>
				<div className="field">
					<div className="key">
						<RiUserFollowLine />
						Followers:~ ${" "}
					</div>
					<div className="value">{user.followers}</div>
				</div>
			</div>
		</div>
	);
};

export default UserProfile;