import React from "react"
import "./App.css"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Footer from "./components/home/Footer"
import Header from "./components/home/header/Header"
import HomePages from "./components/pages/HomePages"
import Pages from "./components/pageContent/Pages"
import Login from "./components/Login/Login"

const App = () => {
  return (
    <div>
     <Router>
        <Header />
        <Switch>
          <Route path='/' exact component={HomePages} />
          <Route path='/pages' exact component={Pages} />
          <Route path='/login' exact component={Login} />

        </Switch>
        <Footer />
      </Router>
    </div>
    )
}

export default App
