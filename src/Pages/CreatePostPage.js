import React, { Component } from "react";
import { Redirect } from 'react-router';
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import "react-datepicker/dist/react-datepicker.css";
import Navbar from "../Components/Navbar.js";
import Footer from "../Components/Footer.js";
import {storage} from '../firebase';

class FormX extends Component {
  
  constructor(props) {
    super(props);

    console.log(this.props.location.state.classId);
    console.log(this.props.location.state.userId);

    this.state = {
      summited: false,
      selectedFile: null,
      title: '',
      notes: '',
      flagged: false,
      image: null,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleUpload = this.handleUpload.bind(this);

  }
    change = (e) => {
      this.setState({
        [e.target.name]: e.target.value,
      });
    };

    handleChange = e => {
      if (e.target.files[0]) {
          const image = e.target.files[0];
          this.setState(() => ({image}));
        }
    }

    handleUpload = (e ) => {
      e.preventDefault();
      const {image} = this.state;
      const uploadTask = storage.ref(`images/${image.name}`).put(image);
      uploadTask.on('state_changed', 
      (snapshot) => {
       
      }, 
      (error) => {
           // error function ....
        console.log(error);
      }, 
    () => {
        // complete function ....
        storage.ref('images').child(image.name).getDownloadURL().then(notes => {
            console.log(notes);
            this.setState({notes});
        })
    });
  }



    onSubmit = (e) => {
      e.preventDefault();
      console.log(this.state);

      const fd = new FormData();
      fd.append('title', this.state.title);
      fd.append('courseID', this.props.location.state.classId);
      fd.append('note', this.state.notes);
      fd.append('userID', this.props.location.state.userId+1); //remove +1 after backend fix their api
      fd.append('flagged', this.state.flagged);

      const searchParams = new URLSearchParams();
      for (const pair of fd) {
        searchParams.append(pair[0], pair[1]);
      }

      fetch("http://localhost:8080/seniorproject/addPost", {
        body: searchParams,
        method: "post"
      })
      .then(response => {
        if (response.status === 200) {
          alert("post created");
          this.setState({ summited:true });
        } else {
          alert("error");
        }
      })
    }

  render() {
    const toClassPage = {
                          pathname: "/classpage/" + this.props.location.state.classId,
                          state: {
                            classTitle: this.props.location.state.classTitle,
                            classDescription: this.props.location.state.classDescription 
                          }
                        }
    if(this.state.summited) {
      return <Redirect push to={toClassPage} />;
    } 
    return (
      <div>
        <Navbar isLoggedIn={this.props.isLoggedIn} resetAllState={this.props.resetAllState}/>
        <h2>Post Note</h2>
        <hr></hr>
        <Container>
           <Form>
               <Form.Row>
                    <Form.Group as={Col}>
                      <Form.Control 
                        name="title"
                        type="title"
                        placeholder="Enter title"
                        value={this.state.title}
                        onChange={e => this.change(e)}  
                      />
                    </Form.Group>
                </Form.Row>
            </Form> 
            <Form>
              <Form.Row>
                <h3 className="text-left">Upload media</h3>
                  <div className="uploaded">

                  <input type="file" onChange={this.handleChange}/>
                  <button onClick={this.handleUpload}>Upload</button>

                  </div>
              </Form.Row>
              <hr></hr>
            </Form>
            <Button 
                onClick ={e => this.onSubmit(e)} 
                variant="primary" 
                type="submit">
                Submit
              </Button>
        </Container>   
        <Footer isLoggedIn={this.props.isLoggedIn}/>
      </div>
    );
  }
}
export default FormX;




