import { DeleteFilled, EditFilled, MenuFoldOutlined, PlusOutlined } from "@ant-design/icons";
import { Avatar, Button, Image, List, PageHeader } from "antd";
import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataWebContext } from "../../../context/Context";
import { DashboardContext } from "../Dashboard";
import './index.css'

const data = Array.from({
    length: 23,
}).map((_, i) => ({
    href: 'https://ant.design',
    title: `ant design part ${i}`,
    avatar: 'https://joeschmoe.io/api/v1/random',
    description:
        'Ant Design, a design language for background applications, is refined by Ant UED Team.',
    content:
        'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
}));

function Index(props) {

    const contextDash = useContext(DashboardContext)
    const context = useContext(DataWebContext)
    const navigate = useNavigate()

    return (
        <div className="index-post">
            <div className="header">
                <div className="header-title">
                    <Button className="menu-collapse" icon={<MenuFoldOutlined />} onClick={() => contextDash.setDrawer(true)} />
                    <h2>Publicaciones</h2>
                </div>
                {context.permisos.add && <Button type="primary" icon={<PlusOutlined />} onClick={()=> navigate('/dashboard/post/create')}/>}
            </div>
            <div className="list-post">
                <List
                    itemLayout="vertical"
                    size="large"
                    pagination={{
                        pageSize: 5,
                    }}
                    dataSource={data}
                    renderItem={(item) => (
                        <List.Item
                            key={item.title}
                            actions={[
                                context.permisos.edit && <Button type="text" icon={<EditFilled />}>
                                    Editar
                                </Button>,
                                context.permisos.delete && <Button type="text" icon={<DeleteFilled />}>
                                    Borrar
                                </Button>
                            ]}
                            extra={
                                <Image
                                    width={272}
                                    alt="logo"
                                    src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                                />
                            }
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={item.avatar} />}
                                title={<a href={item.href}>{item.title}</a>}
                                description={item.description}
                            />
                            {item.content}
                        </List.Item>
                    )}
                />
            </div>
        </div>
    );
}

export default Index;