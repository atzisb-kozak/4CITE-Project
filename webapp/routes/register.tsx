export default function RegisterPage() {
	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('');

	function handleEmailChange(event) {
		setEmail(event.target.value);
	}

	function handleUsernameChange(event) {
		setUsername(event.target.value);
	}

	function handlePasswordChange(event) {
		setPassword(event.target.value);
	}

	function handleSubmit(event) {
		event.preventDefault();
		// Call login API with username and password
		console.log(`Submitting username ${username} with password ${password}`);
	}

	return (
		<form onSubmit={handleSubmit}>
			<label>
				Email:
				<input type="text" value={email} onChange={handleEmailChange} />
			</label>
			<label>
				Email:
				<input type="text" value={email} onChange={handleEmailChange} />
			</label>
			<label>
				Password:
				<input type="password" value={password} onChange={handlePasswordChange} />
			</label>
			<button type="submit">Register</button>
		</form>
	);
}