import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

const app = new Clarifai.App({
 apiKey: '715143c80efb47db8d8da45818a1948b'
});


const particleOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

//set initial state here in order to reuse it whenever user logout
const initialState = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false, //for navigation options
      //add user in front end for testing, and initial value are empty
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
class App extends Component {
  constructor(){
    super();
    this.state = initialState;
  }

  updateUser = (data) => {
    this.setState({user:{
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

// this is for fetching the server data
  // componentDidMount(){
  //   fetch('http://localhost:3001/')
  //   .then(response => response.json())
  //   .then(console.log)
  // }

  calculateFaceLocation = (data)=>{
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(clarifaiFace); 
    console.log(width, height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box)=>{
    console.log(box);
    this.setState({box:box});
  }

  onInputChange = (event)=>{
    this.setState({input: event.target.value}); //when input change, get the value as input value
  }

  onPictureSubmit = ()=>{
    this.setState({imageUrl: this.state.input}) //when users click submit, send input as image url.
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL, 
      this.state.input)
    //calculate and send data value into displayFaceBox()
    .then(response => {
      //if we get response, we want to fetch the backend (increasing entries)
      if(response){
        fetch('http://localhost:3000/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id //id is for the request inside the server put('/image')
          })
        })
        .then(response => response.json()) // we get the response from /image, which is the entries
        .then(count => {  
          //so here we only update entries
          this.setState(Object.assign(this.state.user, {entries: count}))
        })
      }
      this.displayFaceBox(this.calculateFaceLocation(response))})
    .catch(err => console.log(err));
  }

  onRouteChange =(route)=>{
    if(route === 'signout'){
      this.setState(initialState)
    }else if(route === 'home'){
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }
  render() {
    return (
      <div className="App">
      <Particles className="particles" 
        params={particleOptions} 
        />
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
        { this.state.route === 'home'
        ?<div>
        <Logo />
        <Rank name={this.state.user.name} entries={this.state.user.entries} />
        <ImageLinkForm 
          onInputChange={this.onInputChange} 
          onPictureSubmit={this.onPictureSubmit} 
        />
        <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
        </div>        
        : (
            this.state.route === 'signin'
            ?<Signin updateUser = {this.updateUser} onRouteChange={this.onRouteChange}/>
            :<Register updateUser = {this.updateUser} onRouteChange={this.onRouteChange}/>

          )
        }
      </div>
    );
  }
}

export default App;
