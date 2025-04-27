import { icons } from "./icon.config";


export const AddWidgetButton=(props)=>{
    return (
        <button className="addWidgetBtn" onClick={()=>{props?.setOverlayVisible(true); props?.setActiveId(props?.id)}}>
           { !props?.postPlacement && <span
                      className="add"
                      dangerouslySetInnerHTML={{ __html: icons['add'] }}
                    />}
            <div className="addWidgetBtnTitle">Add Widget</div>
            { props?.postPlacement && <span
                      className="add"
                      dangerouslySetInnerHTML={{ __html: icons['add'] }}
                    />}
        </button>
    )
}