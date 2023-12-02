import styled from 'styled-components';
import Contact from '../components/contacts/Contact';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllContacts, getUser } from '../api/internal';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import ChatContainer from '../components/chat/ChatContainer';
import Temp from './Temp';

function Home() {
    const socket = useRef();
    const navigate = useNavigate();
    const [contacts, setContacts] = useState([]);
    const [currentUser, setCurrentUser] = useState(undefined);
    const [currentChat, setCurrentChat] = useState(undefined);

    const getContacts = async () => {
        const data = await getAllContacts(currentUser._id);
        setContacts(data.data);
    };

    const handleChatChange = (chat) => {
        setCurrentChat(chat);
    };

    const getUserLogin = async () => {
        const res = await getUser();
        console.log(res);
        if (res.data !== '') {
            setCurrentUser(res.data);
            return;
        }
        if (localStorage.getItem('chat-app-user')) {
            setCurrentUser(JSON.parse(localStorage.getItem('chat-app-user')));
            return;
        }
        navigate('/login');
    };

    useEffect(() => {
        getUserLogin();
    }, []);

    useEffect(() => {
        if (currentUser) {
            getContacts();
        }
    }, [currentUser]);

    useEffect(() => {
        if (currentUser) {
            socket.current = io('http://localhost:2411');
            socket.current.emit('add-user', currentUser._id);
        }
    }, [currentUser]);

    return (
        <Container>
            <div className="container">
                <div className="contacts-frame">
                    <Contact contacts={contacts} currentUser={currentUser} changeChat={handleChatChange} />
                </div>
                <div className="chat-frame">
                    {currentChat === undefined ? (
                        <Temp
                            title={currentUser?.username}
                            subTitle={'Welcome, '}
                            content={'Please choose a friend to start chatting...'}
                        />
                    ) : (
                        <ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket} />
                    )}
                </div>
            </div>
        </Container>
    );
}
const Container = styled.div`
    background-color: #131324;
    .container {
        display: flex;
    }
    .contacts-frame {
        width: 25%;
    }
    .chat-frame {
        flex: 1;
    }
    @media screen and (min-width: 540px) and (max-width: 960px) {
        .contacts-frame {
            width: 40%;
        }
    }
`;
export default Home;
