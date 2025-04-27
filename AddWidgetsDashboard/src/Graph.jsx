import { useEffect, useState } from "react";
import { map, find, isEmpty } from "lodash";
import { icons } from "./icon.config";
import { AddWidgetButton } from './AddWidgetButton.jsx';


export const Graph = (props) => {
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
          return (
            <div className="card">
              <div className="cardTitle">
                {cardInfo?.title}
                </div>
                {isEmpty(cardInfo?.data) ?
                  <div className='noData'>
                    <div className="noDataIcon" dangerouslySetInnerHTML={{ __html: icons['barGraph'] }} />
                    <div className="noDataDescription">{cardInfo?.description}</div>
                  </div>
                  :
                  <div>Data Here</div>
                }
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
