import React from 'react'

const Content = (prop) =>{
    return (
        <div id="content">
            {prop.children}
        </div>
    )
}

export default Content;