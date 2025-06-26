import React from 'react';
import { Spin } from "antd";

export default function Loader() {
    return (
        <div
            className="spinner-container"
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                backdropFilter: "blur(12px)",
            }}
        >
            <Spin size="large" />
        </div>
    )
}
