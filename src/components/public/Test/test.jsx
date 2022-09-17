import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useState } from "react";
import './test.css'

function Test(props) {

    const [count, setCount] = useState(0);

    const sumar = () => {
        setCount(count+1)
    }

    return ( 
        <div className="test">
            <h1>Contador es: {count}</h1>
            <Button type="primary" icon={<PlusOutlined/>} onClick={sumar}>
                Sumar
            </Button>
        </div>
     );
}

export default Test;