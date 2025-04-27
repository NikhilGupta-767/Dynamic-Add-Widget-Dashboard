import { useEffect, useState } from "react";
import { map } from "lodash"
import { DoughnutView } from './Doughnut.jsx';
import { Graph } from './Graph.jsx';
import { ProgressBarChart } from './ProgressBarChart.jsx';
import { AddWidgetButton } from './AddWidgetButton.jsx';
import { icons } from "./icon.config";



const cards = {
  doughnut: DoughnutView,
  graph: Graph,
  progressBarChart: ProgressBarChart
}

export const Categories = (props) => {

  const [data, setData] = useState({});

  useEffect(() => {
    fetchHeader();
  }, [])
  
  const fetchHeader = async () => {
    try {
      const res = await fetch('/jsons/categories.json',{});
      const data = await res.json();
      setData(data);
    } catch (err) {
      console.error('Error fetching JSON:', err);
    }
  }

  return (
    <div className="categories">
      <div className="categoriesHeader">
        <div className="categoriesTitle">{data?.title}</div>
        <div className="categoriesAction">
          <AddWidgetButton setOverlayVisible={props?.setOverlayVisible} setActiveId={props?.setActiveId} postPlacement={true} />
          <button className="addWidgetBtn" dangerouslySetInnerHTML={{ __html: icons['refresh'] }} />
          <button className="addWidgetBtn" dangerouslySetInnerHTML={{ __html: icons['hamburger'] }} />
          <button className="btnTime">
            <span
              className="clock"
              dangerouslySetInnerHTML={{ __html: icons['clock'] }}
            />
            <div className="timer">Last 2 days</div>
            <span
              className="menu"
              dangerouslySetInnerHTML={{ __html: icons['menu'] }}
            />
          </button>
        </div>
      </div>
      {
        map(data?.categories, category => {
          const Type = cards[category?.type];
          return (
            <div className="category">
              <div className="categoryTitle">{category?.title}</div>
              <Type category={category} setOverlayVisible={props?.setOverlayVisible} setActiveId={props?.setActiveId} refresh={props?.refresh}/>
            </div>
          )
        })
      }
    </div>
  )
}