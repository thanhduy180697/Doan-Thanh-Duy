import React, { Component } from "react";
class AddUser extends Component{
    constructor(){
        super();
        this.state = {
            user: []
        }
    }
    getAllUser = async () => {
        const axios = require('axios').default;
        let data= await axios.get('http://localhost/test_database/api/test-react-js.php')
        return data;
    }
    addUser = async () => {
        const axios = require('axios').default;
        window.event.preventDefault()
        let username=document.getElementById("username").value;
        let password=document.getElementById("password").value;
        let params = {
            username: username,
            password: password,
        }
        fetch('http://localhost:80/test_database/api/test-react-js.php', {
            method: "POST",
            headers: {
                "Accept": "Application/json",
               
            },
            body: JSON.stringify(params)
        })
        .then( res => {
            console.log(res)
        })
    }
    async componentDidMount(){
        let AllUser=await this.getAllUser();
        this.setState({user:AllUser.data});
    }
    check = () =>{
        let {user} = this.state;
        let username=document.getElementById("username").value;
        user.map(value=>{
            if(value.username===username)alert("Trùng");
        });
        //
    }
    render(){
        
        return(
            <table>
                <tr>
                    <td><p>Username</p></td>
                    <td><input type="text" id="username" onBlur={this.check}></input></td>
                </tr>
                <tr>
                    <td><p>Password</p></td>
                    <td><input type="text" id="password"></input></td>
                </tr>
                <tr>
                    <td><input type="submit" id="btn-submit" value="Submit" onClick={this.addUser}></input></td>
                </tr>
            </table>
        )
    }
}
export default AddUser;