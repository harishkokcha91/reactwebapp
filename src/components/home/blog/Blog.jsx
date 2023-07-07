import React from "react"
import Blogdata from "./Blogdata"
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight"

const Blog = () => {
  return (
    <div>
      <section className='blog Services'>
        <div className='container topMarign'>
          <div className='heading'>
            <h2>LATEST BLOG</h2>
            <h1>Read Inspirational Story Every Week</h1>
          </div>

          <div className='contain grid topMarign'>
            {Blogdata.map((val) => {
              return (
                <div className='box' key={val.id}>
                  <div className='img'>
                    <img src={val.cover} alt='' />
                  </div>
                  <div className='text'>
                    <span>{val.date}</span>
                    <h2>{val.title}</h2>
                    <p>{val.desc}</p>
                    <a href='/'>
                      Read More
                      <KeyboardDoubleArrowRightIcon className='icon' />
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Blog
