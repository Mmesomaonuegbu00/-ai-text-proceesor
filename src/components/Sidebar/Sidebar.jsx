import React, { useContext, useState } from 'react';
import './sidebar.css';
import menu from '../../assets/menu_icon.png';
import plus from '../../assets/plus_icon.png';
import { Context } from '../../Context/Context';

const Sidebar = () => {
    const { recents, setShowResult, setText } = useContext(Context);
    const [toggle, setToggle] = useState(false);

    const handleClearChat = () => {
        setShowResult(false);
        setText("");
        console.log("Chat Cleared");
    };

    console.log("Recents: ", recents);

    return (
        <div className='sidebar'>
            <div className="top">
                <img src={menu} alt="Menu" className='menu' onClick={() => setToggle(prev => !prev)} />
                <div className="new-summary" onClick={handleClearChat}>
                    <img src={plus} alt="New Chat" />
                    {toggle && <p>New chat</p>}
                </div>

                {toggle && (
                    <div className="recent">
                        <p className="recent-title">Recent</p>
                        <ul>
                            {recents.length === 0 ? (
                                <p>No recent messages</p>
                            ) : (
                                recents.map((message, index) => (
                                    <li key={index} onClick={() => setText(message)}>
                                        {message.slice(0, 28)}
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
