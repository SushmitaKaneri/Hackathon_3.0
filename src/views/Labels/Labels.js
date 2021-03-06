import React, { Component } from 'react';
import { Alert, Card, CardBody, Button, CardFooter, FormGroup, CardHeader, Col, Row, Label, Input, FormText, Collapse, Fade, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import axios from 'axios';
import { SwatchesPicker } from 'react-color';

import 'react-datepicker/dist/react-datepicker.css';
import 'font-awesome/css/font-awesome.min.css'; 
//import 'react-images-uploader/styles.css';
//import 'react-images-uploader/font.css';

import {Link} from 'react-router-dom';
import server_url from '../../constant';



class Labels extends Component {
  constructor(props) {
    super(props);
    this.pin = this.pin.bind(this)
    this.bin = this.bin.bind(this)
    this.archive = this.archive.bind(this)
    this.color_picker = this.color_picker.bind(this);
    this.show_color = this.show_color.bind(this);
    this.handle_change = this.handle_change.bind(this);
    this.state = {
      result: null,
      show_picker: '',
      _id: '',
      labels:[]
    };
  }
  
  handle_change(e){
    console.log(e.target.value)
    axios.post(server_url+'/api/upload/fetch',{email:this.state.user,label:e.target.value})
    .then((result)=>{
      let result1 = result.data;
      this.setState({result:result1},async ()=>{
      });
    })
    .catch(err=>console.log(err));
  }

  archive(e){  
    if(e.target.id!=null){ 
      let gid = e.target.id.substring(0,e.target.id.length-1)
      if(document.getElementById(e.target.id).style.color==='' || document.getElementById(e.target.id).style.color==='black') {
        document.getElementById(e.target.id).style.color='#178515'  
        axios.post(server_url+"/api/upload/status",{_id:gid,status:'Archive'})
        .then(()=>{
         
        })
        .catch(err=>console.log(err));
        alert("You can view the note in Archive section as well as in All Notes!");
        return window.location.reload(false);
      }
      else {
        document.getElementById(e.target.id).style.color='black';
        axios.post(server_url+"/api/upload/status",{_id:gid,status:'Normal'})
        .then(()=>{
        })
        .catch(err=>console.log(err));
        alert("You can view the note in All Notes!");
        return window.location.reload(false);
      }
  }
}

bin(e){  
  if(e.target.id!=null){   
    let gid = e.target.id.substring(0,e.target.id.length-1)
    if(document.getElementById(e.target.id).style.color==='' || document.getElementById(e.target.id).style.color==='black') {
      document.getElementById(e.target.id).style.color='#178515'
      axios.post(server_url+"/api/upload/status",{_id:gid,status:'Bin'})
      .then(()=>{
      })
      .catch(err=>console.log(err));
      alert("You can view the note in Bin section as well as in All Notes!");
        return window.location.reload(false);
    }
    else{
      document.getElementById(e.target.id).style.color='black';
      axios.post(server_url+"/api/upload/status",{_id:gid,status:'Normal'})
      .then(()=>{
      })
      .catch(err=>console.log(err));
      alert("You can view the note in All Notes!");
        return window.location.reload(false);
    }
}
}

show_color(e){
  this.setState({_id:e.target.id.toString()})
  this.setState({show_picker:e.target.id})  
}
color_picker(color, event) {
  document.getElementById(this.state._id+'card').style.background = color.hex;
  this.setState({show_picker:''},console.log(this.state.show_picker))
  axios.post(server_url+"/api/upload/note_color",{_id:this.state._id,note_color:color.hex})
    .then(()=>{      
      
    })
    .catch(err=>console.log(err));
}

pin(e){    
    if(e.target.id!=null){
    let gid = e.target.id.substring(0,e.target.id.length-1)
    if(document.getElementById(e.target.id).style.color==='' || document.getElementById(e.target.id).style.color==='black') {
      document.getElementById(e.target.id).style.color='#178515'
      axios.post(server_url+"/api/upload/pin_color",{_id:gid,pin_color:'#178515'})
    .then(()=>{
    })
    .catch(err=>console.log(err));
    alert("You can view the note in Pinned section as well as in All Notes!");
        return window.location.reload(false);
    }
    else {
      document.getElementById(e.target.id).style.color='black'
      axios.post(server_url+"/api/upload/unpin_color",{_id:e.target.id})
    .then(()=>{
    })
    .catch(err=>console.log(err));
    alert("You can view the note in All Notes!");
        return window.location.reload(false);
    }  
  }
}

  loadNotes(){
    axios.post(server_url+'/api/upload/section', {email:this.state.user})
      .then((result) => {
        if(result.data == "No fetch") return this.props.history.push('./Login')
        result = result.data;
        this.setState({result},console.log(this.state.result));
      })
      .catch(err => alert(err));

      axios.post(server_url+'/api/upload/fetchLabels', {email:this.state.user})
      .then((result) => {
        if(result.data == "No fetch") return this.props.history.push('./Login')
        for(let i=0;i<result.data.length;i++){
          console.log("in")
          if(!this.state.labels.includes(result.data[i]))
          this.setState(prevState => ({
            labels: [...prevState.labels, result.data[i]]
          }))
        }
       console.log(this.state.labels);
      })
      .catch(err => alert(err));
  }

  Section(){
    if(this.state.result!=null){
    console.log(this.state.result)
    const element = this.state.result.map((e) => 
    <Col xs="12" sm="6" md="3">
      <Card className="border-info">
        <CardHeader>
        <b>{this.state.result==null?"":e.title}</b> 
      </CardHeader>
        <CardBody id={e._id+'card'} style={{background:e.note_color}}>
          <Alert>{e.description}</Alert>
    <center>{e.image!=''?<img src={e.image} width="130" height="130"/>:''}</center>
          <center><Row>        
            <Col sm="3" md="3" lg="3"><i className="icon-pin font-2xl d-block mt-4" style={{ cursor: 'pointer', color: e.pin_color }} id={e._id+'p'} onClick={this.pin} title="Pin"></i></Col>            
    <Col sm="3" md="3" lg="3">{e.status=='Archive'?<i className="fa fa-archive font-2xl d-block mt-4" style={{ cursor: 'pointer',color:'#178515' }} onClick={this.archive} id={e._id+'a'} title="Archive"></i>:<i className="fa fa-archive font-2xl d-block mt-4" style={{ cursor: 'pointer'}} onClick={this.archive} id={e._id+'a'} title="Archive"></i>}</Col>
    <Col sm="3" md="3" lg="3">{e.status=='Bin'?<i className="fa fa-trash font-2xl d-block mt-4" style={{ cursor: 'pointer', color:'#178515' }} onClick={this.bin} id={e._id+'b'} title="Bin"></i>:<i className="fa fa-trash font-2xl d-block mt-4" style={{ cursor: 'pointer' }} onClick={this.bin} id={e._id+'b'} title="Bin"></i>}</Col>
            <Col sm="3" md="3" lg="3"><i className="fa fa-eyedropper font-2xl d-block mt-4" style={{ cursor: 'pointer' }} onClick={this.show_color} id={e._id} title="Color Picker"></i></Col>
            {this.state.show_picker===e._id?<SwatchesPicker onChangeComplete={this.color_picker}/>:""}
          </Row></center>
        </CardBody>
    <CardFooter><center>{e.label!=''?<i className="icon-tag d-block mt-2">   {this.state.result==null?"":e.label}</i>:''}{e.reminder!=""? <i className="icon-clock d-block mt-2">{e.reminder.substring(0,e.reminder.length-8)}</i>:''}</center></CardFooter>
      </Card>
    </Col>
       
    );

    return(element);   
    }
  }

  Options(){
    if(this.state.labels!=null){
      console.log("Hereeeeeeee",this.state.labels)
    const element = this.state.labels.map((e) =>
    <option>{e}</option>   
    );
    return(element);}}
  render() {
    return (
      <div className="animated fadeIn">  
        <Row> <Col lg="6"><Input type="select" onChange={this.handle_change} name="labels" required>
                              <option>Select Labels</option>
                              {this.Options()}
                            </Input></Col>
        <Col lg="6"></Col></Row>
        <br /><br />
        <Row>
        {this.Section()}
        </Row>
      </div>
    );
  }
  componentDidMount(){
     axios.defaults.withCredentials = true;
  axios.get(server_url+'/api/user/authenticate',{ withCredentials: true})
    .then(res=>{
      let user=res.data
      this.setState({user})
      {this.loadNotes()}
    })
    .catch(err=>{
      //console.log(err);
      return this.props.history.push('./login');
    })
  }

  
}




export default Labels;
