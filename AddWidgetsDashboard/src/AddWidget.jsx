import {useEffect, useState} from "react";
import {map,find, reduce,filter} from "lodash"

export const AddWidget = (props) => {
    const [data,setData] = useState({});
    const [active,setActive] = useState(props?.id || 0);
    const [selected,setSelected]=useState([])
    const ActiveTabObj=find(data?.tabs,{id:active});
    const original=selected;


    useEffect(() => {
      fetchData();
    }, [])
    const fetchData= async() =>{
        try {
            const res= await fetch('/jsons/overlay.json');
            const _data = await res.json();
            setData(_data);
            setSelected(reduce(_data?.tabs,(acc, tab) => {
              acc[tab?.id] = tab?.activeWidgets;
              return acc;
            }, {}))
          } catch (err) {
            console.error('Error fetching JSON:', err);
          }
    }

    const handleSubmit=(action)=>{
      if(action?.title==="Confirm")
      {
        props?.setRefresh(selected)
      }
      else{
        setSelected(original);
      }
      props?.setOverlayVisible(false)
    }
    const updateCheck=(e)=>{
      const value=e.target.value - 0;
      if(e.target.checked){
        setSelected({
          ...selected,
          [ActiveTabObj?.id]: [...selected[ActiveTabObj?.id], value]
        })
      }
      else
      {
        setSelected({
          ...selected,
          [ActiveTabObj?.id]: filter(selected[ActiveTabObj?.id], val=>val !== value)
        })

      }
    }

    return (
      <div className= "overlay">
        <div className="addWidgetOverlay">
          <div className="overlayHeader">
            <div className="overlayTitle">{data?.overlayTitle}</div>
            <button className="crossBtn" onClick={()=>{props?.setOverlayVisible(false)}}>X</button>
          </div>
          <div className="overlayDescription">{data?.description}</div>
          <div className="overlayTabs">
          {
            map(data?.tabs,(tab)=>{
              return ( <div className={tab?.id !== ActiveTabObj?.id?'overlayTab' : 'overlayTab overlayTabSelected'} onClick={()=>{setActive(tab?.id)}}>
                  {tab.title}
              </div>)
            })
          }
          </div>
          <div className="overlayTabWidgets">
          { 
            map(ActiveTabObj?.widgets,widget=>{
              return ( <div className="overlayWidgetsOptions">
               <input type="checkbox" value={widget?.id} checked={selected?.[ActiveTabObj?.id]?.includes(widget?.id)} onChange={(e) => {updateCheck(e)}}/>
                  {widget.name}
              </div>)
            })
          }
          </div>
          <div className="overlayActions">
          {
            map(data?.actions,action=>{
              return ( <button className={`overlayAction overlayAction-${action.title}`}  onClick={()=>{handleSubmit(action)}}>{action.title}</button>)
            })
          }
          </div>
        </div>
      </div>
    )
}