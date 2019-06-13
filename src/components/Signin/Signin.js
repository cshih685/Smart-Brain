import React from 'react';



class Signin extends React.Component{
	//initial the states
	constructor(){
		super();
		this.state ={
			signInEmail: '',
			signInPassword: ''
		}
	}
	//when email input box changed
	onEmailChange = (event) => {
		this.setState({signInEmail: event.target.value})
	}
	//when password input box changed
	onPasswordChange = (event) => {
		this.setState({signInPassword: event.target.value})
	}
	//when subit button is clicked
	onSubmitSignIn = () =>{
		fetch('https://frozen-shore-79981.herokuapp.com/signin', {
			method:'post',
			headers: {'Content-Type': 'application/json'},
			//here is input
			body: JSON.stringify({
				email: this.state.signInEmail,
				password: this.state.signInPassword
			})	
		})
		// this response might include wrong information when we can't get matched email or password(hash)
		.then(response => response.json())
		.then(user => {
			// console.log(user);
			// if matched, return the response which contains information of input user
			if(user.id){ 
				this.props.updateUser(user);
				this.props.onRouteChange('home');
			}
		})
	}

	render(){
		const { onRouteChange } = this.props;
		return (
		<article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">	
			<main className="pa4 black-80">
				<div className="measure">
					<fieldset id="sign_up" className="ba b--transparent ph0 mh0">
						<legend className="f1 fw6 ph0 mh0">Sign In</legend>
						<div className="mt3">
							<label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
							<input 
							onChange={this.onEmailChange} //when change use onEmailChange()
							className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
							type="email" 
							name="email-address"  
							id="email-address" />
						</div>
						<div className="mv3">
							<label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
							<input 
							onChange={this.onPasswordChange}
							className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
							type="password" 
							name="password" 
							id="password" />
						</div>
					</fieldset>
					<div className="">
						<input className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
						onClick={this.onSubmitSignIn} //using arrow as we won't let it excute automatically
						type="submit" 
						value="Sign in" />
					</div>
					<div className="lh-copy mt3">
						<p onClick={() => onRouteChange('register')} className="f6 link dim black db pointer" >Register</p>
					</div>
				</div>
			</main>
		</article>
		);
	}
}

export default Signin;