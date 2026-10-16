import Lottie from 'lottie-react';
import dataJson from "./loader.json";

export default function Loader() {
    return (
        // <div
        //     className="spinner-container"
        //     style={{
        //         display: "flex",
        //         justifyContent: "center",
        //         alignItems: "center",
        //         minHeight: "100vh",
        //         backdropFilter: "blur(12px)",
        //     }}
        // >
        //     <Spin size="large" />
        // </div>

        <div  className='lottieIcon'>
            <Lottie animationData={dataJson}  loop={true} />
        </div>
    )
}
