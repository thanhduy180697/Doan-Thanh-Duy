import React, { Component } from "react";
class TestUser extends Component{
    constructor(){
        super();
        this.state = {
            user: []
        }
    } 
    getAllUser = async () => {
        const axios = require('axios').default;
        let data= await axios.get('http://localhost/test_database/api/test-react-js.php')
        console.log(data);
        // .then(function (response) {
        //     // handle success
        //     return (response);
        // })
        // .catch(function (error) {
        //     // handle error
        //     console.log(error);
        // })
        // .finally(function () {
        //     // always executed
        // });
    }
    componentDidMount(){
        this.getAllUser();
    }
    render(){
        let {user} = this.state;
        return(
            <table>
                <tr>
                    <td>Username</td>
                    <td>Password</td>
                </tr>
                {
                    user.map( (u, i) => {
                        return  <tr key={i}> 
                            <td>{u.username}</td>
                            <td>{u.password}</td>
                        </tr>
                    })
                }
            </table>
        )
    }
}
export default TestUser;