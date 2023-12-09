import styled from "styled-components";
import Setting from "../components/settings/Setting";
import SideBar from "../components/sidebar/SideBar";


function MainLayout({children}) {
    return ( 
    <Container>
        <div className="sidebar"><SideBar/></div>
        <div className="content">{children}</div>
        <Setting />
    </Container> 
    );
}

const Container = styled.div`
    display: flex;
    width: 100vw;
    height: 100vh;
    .sidebar{
        width: 6%;
    }
    .content{
        width: 94%;
    }
`;

export default MainLayout;