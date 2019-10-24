import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import './Header.css';
class Header extends Component {

    constructor() {
        super();

        this.state = {
            toggleMenu: false,
            toggleSearch: false,
            toggleProducts: false,
            toggleUser: false,
            uid: null,
            photo: ""
        }

        // this.handleToggleMenu = this.handleToggleMenu.bind(this);
    }

    componentDidMount () {
        
    }

    handleToggleMenu = () => {
        // let toggleButton = document.querySelector("a.left-sidebar-toggle");
        // let leftSide = document.querySelector(".left-sidebar");
        
        // let { toggleMenu } = this.state;

        // if(!toggleMenu) {
        //     toggleButton.classList.add("topbar-icon-on");
        //     leftSide.classList.add("topbar-icon-on");
        //     // this.setState( {toggleMenu: true} );
        // } else {
            
        //     toggleButton.classList.remove("topbar-icon-on");
        //     leftSide.classList.remove("topbar-icon-on");
        //     // this.setState( {toggleMenu: false} );
        // }
        // this.setState( function (prevState, props) {
        //     return {toggleMenu: !prevState.toggleMenu}
        // });
    }

    handleToggleSearch = () => {
        // let { toggleSearch } = this.state;
        // if(!toggleSearch) {
        //     document.querySelector(".s-input").style.display = "block";
        // } else {
        //     document.querySelector(".s-input").style.display = "none";
        // }

        // this.setState( function(prevState, props) {
        //     return { toggleSearch: !prevState.toggleSearch }
        // })
    }

    handleToggleProducts = () => {
        let { toggleProducts } = this.state;

        if(!toggleProducts) {
            document.querySelector("#products-popover").style.display = "block";
            
        } else {
            document.querySelector("#products-popover").style.display = "none";
            
        }

        this.setState( function(prevState, props) {
            return { toggleProducts: !prevState.toggleProducts }
        })
    }

    handleToggleUser = () => {
        
    }

    handleSignout = () => {
        
    }

    render() {
        // const { uid, photo } = this.state;
        return (
            <header id="header" className="ps-fixed w-100">
                <div className="container d-flex align-items-center">
                    <div className="brand-logo d-flex align-items-center">
                        <Link to="/">
                            {/* <img src={brandLogo} alt="brand-logo"/> */}
                        </Link>
                    </div>
                    <a  className="left-sidebar-toggle d-flex align-items-center justify-content-center"
                        href="#tg"
                        onClick={this.handleToggleMenu}
                    >
                        <span className="ps-absolute"></span>
                    </a>
                    <ul className="menu-horizontal w-100 d-flex align-items-center">
                        <li className="item-top item-top--radius ps-relative">
                            <a
                                href="#product"
                                onClick={this.handleToggleProducts}
                            >
                                Products
                            </a>
                            <div id="products-popover" className="s-popover ps-absolute">
                                <div className="s-popover--arrow"></div>
                                <ul className="list-rest s-anchors">
                                    <li>
                                        <Link to="/admin">
                                            <span className="fs-body1 d-block">Liars ask</span>
                                            <span className="fs-caption d-block">Public questions and answers</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <a href="/teams">
                                            <span className="fs-body1 d-block">Teams</span>
                                            <span className="fs-caption d-block">Private questions and answers for your team</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/teams">
                                            <span className="fs-body1 d-block">Enterprise</span>
                                            <span className="fs-caption d-block">Private self-hosted questions and answers for your enterprise</span>
                                        </a>
                                    </li>
                                    <hr className="oc7"/>
                                    <li>
                                        <a href="/teams">
                                            <span className="fs-body1 d-block">Talent</span>
                                            <span className="fs-caption d-block">Hire technical talent</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/teams">
                                            <span className="fs-body1 d-block">Advertising</span>
                                            <span className="fs-caption d-block">Reach developers worldwide</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li className="w-100">
                            <form action="#search">
                                <div className="ps-relative">
                                    <input type="text" name="q" placeholder="Search..." maxLength="240" className="s-input s-input__search js-search-field w-100" />
                                    <svg style={{position:"absolute",top:"7px",left:"10px"}}  aria-hidden="true" className="svg-icon s-input-icon s-input-icon__search iconSearch" width="18" height="18" viewBox="0 0 18 18"><path d="M18 16.5l-5.14-5.18h-.35a7 7 0 1 0-1.19 1.19v.35L16.5 18l1.5-1.5zM12 7A5 5 0 1 1 2 7a5 5 0 0 1 10 0z"></path></svg>
                                    <svg
                                        aria-hidden="false" className="svg-icon s-input-icon s-input-icon__search iconSearch d-none" width="18" height="18" viewBox="0 0 18 18"                               
                                        onClick={this.handleToggleSearch}
                                    >
                                            <path d="M18 16.5l-5.14-5.18h-.35a7 7 0 1 0-1.19 1.19v.35L16.5 18l1.5-1.5zM12 7A5 5 0 1 1 2 7a5 5 0 0 1 10 0z"></path>
                                    </svg>
                                </div>
                            </form>
                        </li>
                        <li className="item-top item-top--radius ps-relative">
                            <div
                                className="d-flex align-items-center bd50 cs-pointer"
                                onClick={this.handleToggleUser}
                            >    
                                {/* <img className="bd50" width="40" height="40" src={photo || Default} alt="avatar"/> */}
                            </div>
                            <div id="user-popover" className="s-popover ps-absolute">
                                <div className="s-popover--arrow"></div>
                                <ul className="list-rest s-anchors">
                                    <li>
                                        <Link to={`/users/`}>
                                            <span className="fs-body1 d-block">Your profile</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/questions">
                                            <span className="fs-body1 d-block">Your questions</span>
                                        </Link>
                                    </li>
                                    <hr className="oc7"/>
                                    <li>
                                        <button
                                            className="s-btn s-btn__hovero w-100 text-left d-flex align-items-center"
                                            onClick={this.handleSignout}
                                        >
                                            {/* <img width="18" src={signoutIcon} alt="signout"/> */}
                                            <span className="fs-body1 d-block">&nbsp;&nbsp;Signout this account</span>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li className="item-top">
                            <a href="#help">
                                <svg aria-hidden="true" className="svg-icon iconHelp" width="18" height="18" viewBox="0 0 18 18"><path d="M9 1a8 8 0 1 0 0 16A8 8 0 0 0 9 1zm.81 12.13c-.02.71-.55 1.15-1.24 1.13-.66-.02-1.17-.49-1.15-1.2.02-.72.56-1.18 1.22-1.16.7.03 1.2.51 1.17 1.23zM11.77 8c-.3.34-.65.65-1.02.91l-.53.37c-.26.2-.42.43-.5.69a4 4 0 0 0-.09.75c0 .05-.03.16-.18.16H7.88c-.16 0-.18-.1-.18-.15.03-.66.12-1.21.4-1.66.4-.49.88-.9 1.43-1.22.16-.12.28-.25.38-.39a1.34 1.34 0 0 0 .02-1.71c-.24-.31-.51-.46-1.03-.46-.51 0-.8.26-1.02.6-.21.33-.18.73-.18 1.1H5.75c0-1.38.35-2.25 1.1-2.76.52-.35 1.17-.5 1.93-.5 1 0 1.79.18 2.49.71.64.5.98 1.18.98 2.12 0 .57-.2 1.05-.48 1.44z"></path></svg>
                            </a>
                        </li>
                    </ul>
                </div>
            </header>
        )
    }
}

export default (Header);