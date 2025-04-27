import { useEffect, useState } from "react";
import { map, find,reduce,isEmpty } from "lodash";
import { icons } from "./icon.config";
import { AddWidgetButton } from './AddWidgetButton.jsx';


export const ProgressBarChart = (props) => {
  const [data, setData] = useState({});
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {

    if(!props?.refresh){
      fetchHeader();
    }
    else{
      setData({...data,activeCards:props?.refresh[data?.id]});
    }
  }, [props?.refresh]);
  
  const fetchHeader = async () => {
    try {
      const res = await fetch(props?.category?.url);
      const data = await res.json();
      setData(data);
      setIsFetching(false);
    } catch (err) {
      console.error("Error fetching JSON:", err);
    }
  };

  const { activeCards, cards } = data;

  return isFetching ? (
    <div className="loadingHeader">Loading.....</div>
  ) : (
    <div className="widgetLayout">
      {
        map(activeCards, card => {
          const cardInfo = find(cards, { id: card });
          const total = reduce(cardInfo?.legends,(value,current)=>{
            return (value+current.value);
          },0);
          return (
            <div className="card">
              <div className="cardTitle">
                {cardInfo?.title}
                </div>
                <div className="cardBody">
                  <div className= "cardDescription">
                    <div className="cardDescriptionValue">{total}</div>
                    <div className="cardDescriptionLabel">{cardInfo?.valueLabel}</div>
                  </div>
                  <div className="progressBar">
                  {
                      map(cardInfo?.legends,legend=>{
                        return(
                          <div className="progressBarElements" style={{backgroundColor:legend?.color, width:`${(legend?.value/total*100)}%`}}/>
                        )
                      })
                    }
                  </div>
                {total<=0 ?
                  <div className='noData'>
                    <div className="noDataIcon" dangerouslySetInnerHTML={{ __html: icons['barGraph'] }} />
                    <div className="noDataDescription">{cardInfo?.description}</div>
                  </div>
                  :
                  <div className="cardLegends">
                    {
                      map(cardInfo?.legends,legend=>{
                        return(
                          <div className="legend">
                            <div className="legendBox" style={{backgroundColor:legend?.color}}/>
                            <div className="legendTitle">{`${legend?.title} (${legend?.value})`}</div>
                          </div>
                        )
                      })
                    }
                  </div>
                }
                </div>
            </div>
          )
        })}
      { activeCards.length!==cards.length && <div className="card cardAdd">
        <AddWidgetButton setOverlayVisible={props?.setOverlayVisible} setActiveId={props?.setActiveId} id={props?.category?.id} />
      </div>
      }
    </div>
  );
};
