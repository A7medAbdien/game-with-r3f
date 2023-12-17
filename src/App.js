import GamePart from 'GamePart';
import './App.css';
import DetectionPart from './DetectionPart';


function App() {
    return (
        <div className="App">

            <DetectionPart />
            <div className="game-part">
                <GamePart />
            </div>
        </div>
    );
}

export default App;
