import'./loaderStyle.css';

function Loader(props) {
    return (
        <div className="loader-bg">
            <div class="lds-ellipsis center"><div></div><div></div><div></div><div></div></div>
        </div>
    );
}

export default Loader;