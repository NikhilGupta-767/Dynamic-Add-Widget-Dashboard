import { useEffect, useState } from "react";
import { map, find, isEmpty, reduce } from "lodash";
import { AddWidgetButton } from './AddWidgetButton.jsx';
import { Doughnut } from 'react-chartjs-2';
import { icons } from "./icon.config";
import { Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export const DoughnutView = (props) => {
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

  const doughnutData = (id)=>{
    const _data=find(cards, { id: id })
    return (
      {
        labels: _data?.labels,
    datasets: [
      {
       ..._data?.datasets,
        hoverBackgroundColor: _data?.datasets?.backgroundColor,
        hoverBorderColor: 'transparent', 
        borderColor: _data?.datasets?.backgroundColor,
        borderWidth: 0, 
      },
    ],
      }
    )
  }  

  const options = {
    responsive: true, 
    plugins: {
      legend: {
        display: false, 
      },
      tooltip: {
        enabled:false
      },
      interaction: {
        mode: 'nearest',
        intersect: false, 
      },
      animation: {
        hover: {
          animationDuration: 0, 
        },
        
      },
      aspectRatio: 1,
      hover: {
        mode: null,
      },
    },
  };

  return isFetching ? (
    <div className="loadingHeader">Loading.....</div>
  ) : (
    <div className="widgetLayout">
      {
        map(activeCards, card => {
          const cardInfo = find(cards, { id: card });
          const _data=doughnutData(card);
          const total = reduce(cardInfo?.datasets?.data,(value,current)=>{
            return (value+current);
          },0);
          return (
            <div className="card">
              <div className="cardTitle">
                {cardInfo?.title}
                </div>
                {isEmpty(cardInfo?.datasets) ?
                  <div className='noData'>
                     <div className="noDataIcon" dangerouslySetInnerHTML={{ __html: icons['barGraph'] }} />
                     <div className="noDataDescription">{cardInfo?.description}</div>
                  </div>
                  :
                  <div className= "cardBodyDoughnut">
                    <div className="doughnut">
                  <Doughnut data={_data} options={options}/>
                  <div className="doughnutTotal"><div className="cardDescriptionValue">{total}</div> <div className="cardDescriptionLabel">{cardInfo?.totalLabel}</div></div>
                  </div>
                  <div className="cardLegendsDoughnut">
                    {
                      map(cardInfo?.labels,(lebal,index)=>{
                        return(
                          <div className="legend legendDoughnut">
                            <div className="legendBox" style={{backgroundColor:cardInfo?.datasets?.backgroundColor[index]}}/>
                            <div className="legendTitle">{`${lebal} (${cardInfo?.datasets?.data[index]})`}</div>
                          </div>
                        )
                      })
                    }
                  </div>
                  </div>
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
