import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Header from './components/header'
import "./components/Header.css"
import "./components/index.css"
import Footer from "./components/Footer.js"
import "./components/Footer.css"
import Content from "./components/Content.js"
import "./components/Content.css"
import BabylonScene from './BabylonScene';
import TestUser from './TestUser';
import AddUser from './addUser';
// This site has 3 pages, all of which are rendered
// dynamically in the browser (not server rendered).
//
// Although the page does not ever refresh, notice how
// React Router keeps the URL up to date as you navigate
// through the site. This preserves the browser history,
// making sure things like the back button and bookmarks
// work properly.

export default function App() {
  return (
    <Router>
        {/*
          A <Switch> looks through all its children <Route>
          elements and renders the first one whose path
          matches the current URL. Use a <Switch> any time
          you have multiple routes, but you want only one
          of them to render at a time
        */}
        <Header />
        <Switch>
          <Content>
            <Route exact path="/" component={BabylonScene}></Route>
            <Route exact path="/user" component={TestUser}></Route>
            <Route exact path="/signup" component={AddUser}></Route>
          </Content>
        </Switch>
        <Footer />    
    </Router>
  );
}

// You can think of these components as "pages"
// in your app.

