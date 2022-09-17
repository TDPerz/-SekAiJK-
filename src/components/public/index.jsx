import { Outlet, useNavigate } from "react-router-dom";
import 'antd'
import { Layout, Menu } from "antd";

function Index(props) {
    const navigate = useNavigate()
    return (
        <Layout>
            <Layout.Header style={{ position:'fixed', zIndex:1, width: '100%' }}>
                <Menu mode="horizontal" theme="dark">
                    <Menu.Item key={0}>
                        Home
                    </Menu.Item>
                    <Menu.Item key={1} onClick={()=>{
                        navigate('/test')
                    }}>
                        Test
                    </Menu.Item>
                </Menu>
            </Layout.Header>
            <Layout.Content style={{ backgroundColor:'#fff'}}>
                <Outlet/>
            </Layout.Content>
        </Layout>
    );
}

export default Index;