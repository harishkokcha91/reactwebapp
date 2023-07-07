import React from "react"
import Home from "../home/homes/Home"
import Branding from "../home/Branding"
import About from "../home/about/About"
import Services from "../home/servicess/Services"
import Wrapper from "../home/Wrapper"
import Skill from "../home/Skill"
import WrapperOne from "../home/WrapperOne"
import Work from "../home/work/Work"
import Blog from "../home/blog/Blog"
import Login from "../home/login/Login"

const HomePages = () => {
  return (
    <div>
      <Home />
      <Branding />
      <About />
      <Services />
      <Wrapper />
      <Skill />
      <WrapperOne />
      <Work />
      <Blog />
      <Login />
    </div>
  )
}

export default HomePages
