import './DetectionPart.css';
import useHandDetection from './hooks/useHandDetection';

export default function DetectionPart() {
    const { landmarkerLoaded, webcamRunning, direction, videoRef, webcamButtonRef, canvasRef } = useHandDetection()


    return (
        <div className="detection-part">
            <button ref={webcamButtonRef} disabled={!landmarkerLoaded} id="webcamButton" className="mdc-button mdc-button--raised button">
                <span className="mdc-button__label">{landmarkerLoaded ? "ENABLE WEBCAM" : "Loading..."}</span>
            </button>
            {webcamRunning && <p className='text'>Direction: {direction !== "" ? direction : "Unknown"}</p>}
            <div className="camera-feed-container">
                <video ref={videoRef} className='camera-feed mirror-scene' id="video" autoPlay></video>
                <canvas ref={canvasRef} className="camera-feed mirror-scene output_canvas" id="output_canvas" />
            </div>
        </div>
    )
};
