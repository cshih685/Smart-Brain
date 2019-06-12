import React from 'react';



class Register extends React.Component{
	constructor(){
		super();
		this.state ={
			regName: '',
			regEmail: '',
			regPassword: ''
		}
	}
	//when name input box changed
	onNameChange = (event) => {
		this.setState({regName: event.target.value})
	}
	//when email input box changed
	onEmailChange = (event) => {
		this.setState({regEmail: event.target.value})
	}
	//when password input box changed
	onPasswordChange = (event) => {
		this.setState({regPassword: event.target.value})
	}
	//when subit button is clicked
	onSubmitRegist = () =>{
		fetch('http://localhost:3000/register', {
			method:'post',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				name: this.state.regName,
				email: this.state.regEmail,
				password: this.state.regPassword
			})	
		})
		//here, we get some data (name, email, password) from request by user input and post
		.then(response => response.json())  //instead of using json(), sometimes we may need to use text()
		.then(user => {
			if(user.id){
				//if we get the user data, we need to update our database to add those new information
				//so we need an updateUser function in front end (in App.js as props)
				this.props.updateUser(user);
				this.props.onRouteChange('home');
			}
		})
	}

	render(){
		// const {onRouteChange} = this.props;
		return (
		<article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">	
			<main className="pa4 black-80">
				<div className="measure">
					<fieldset id="sign_up" className="ba b--transparent ph0 mh0">
						<legend className="f1 fw6 ph0 mh0">Register</legend>
						<div className="mt3">
							<label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
							<input 
							className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
							type="text" 
							name="name"  
							id="name" 
							onChange = {this.onNameChange}
							/>
						</div>
						<div className="mt3">
							<label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
							<input className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
							type="email" 
							name="email-address"  
							id="email-address" 
							onChange = {this.onEmailChange}
							/>
						</div>
						<div className="mv3">
							<label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
							<input className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
							type="password" 
							name="password"  
							id="password" 
							onChange = {this.onPasswordChange}
							/>
						</div>
					</fieldset>
					<div className="">
						<input className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
						onClick={this.onSubmitRegist} //using arrow as we won't let it excute automatically
						type="submit" 
						value="Register" />
					</div>
					<div className="lh-copy mt3">
					</div>
				</div>
			</main>
		</article>
		);
	}
}

export default Register;