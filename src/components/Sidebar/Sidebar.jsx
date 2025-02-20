import React, { useContext, useState } from 'react'
import './sidebar.css'
import menu from '../../assets/menu_icon.png'
import plus from '../../assets/plus_icon.png'
import { Context } from '../../Context/Context'

const Sidebar = () => {
    // const { prevPrompt, text } = useContext(Context)

    // const loadPrompt = (text) => {
    //     setRecentPrompt(prompt)
    //     onSent(prompt)
    //   }

    const [toggle, setToggle] = useState(false)

    return (
        <div className='sidebar'>
            <div className="top">
                <img src={menu} alt="" className='menu' onClick={() => setToggle(prev => !prev)} />
                <div className="new-summary">
                    <img src={plus} alt="" />
                    {toggle ? <p>New Summary</p> : null}

                </div>

                {toggle ?
                    <div className="recent">
                        <p className="recent-title">Recent</p>

                        <div className="recent-entry">
                        {/* <p>{(text || prevPrompt).slice(0, 18) + "....."}</p> */}


                        </div>




                    </div> : null
                }
            </div>
        </div>
    )
}

export default Sidebar
