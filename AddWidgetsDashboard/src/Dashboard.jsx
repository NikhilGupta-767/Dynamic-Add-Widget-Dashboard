import { useState} from "react";
import {Header} from './Header.jsx';
import {Categories} from './Categories.jsx';
import {AddWidget} from './AddWidget.jsx';

export const Dashboard = () => {

    const [overlayVisible, setOverlayVisible] = useState("");
    const [activeId, setActiveId] = useState(0);
    const [refresh, setRefresh] = useState(false);

    return (
      <div className= "dashBoard">
        <Header/>
        <Categories setOverlayVisible={setOverlayVisible} setActiveId={setActiveId} refresh={refresh}/>
       { overlayVisible && <div className="overlay"> 
        <AddWidget setOverlayVisible={setOverlayVisible} id={activeId} setRefresh={setRefresh} refresh={refresh}/> 
        </div>}
      </div>
    )
}