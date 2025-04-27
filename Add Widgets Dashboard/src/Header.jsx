import { useEffect, useState } from "react";
import { map } from "lodash";
import { icons } from "./icon.config";

export const Header = () => {
  const [headerData, setHeaderData] = useState({});
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    fetchHeader();
  }, []);
  const fetchHeader = async () => {
    try {
      const res = await fetch("/jsons/header.json");
      const data = await res.json();
      setHeaderData(data);
      setIsFetching(false);
    } catch (err) {
      console.error("Error fetching JSON:", err);
    }
  };

  const { path, search, actions } = headerData;

  return isFetching ? (
    <div className="loadingHeader">Loading.....</div>
  ) : (
    <div className="header">
      <div className="path">
        {map(path, (value, index) => {
          return (
            <div className="pathPiece">
              {index > 0 && <span className="path-Separator">&gt;</span>}
              <span className="pathName">{value?.name}</span>
            </div>
          );
        })}
      </div>
      <div className="search">
        <span
          className="searchIcon"
          dangerouslySetInnerHTML={{ __html: icons[search?.icon] }}
        />
        <input
          className="searchBox"
          type="text"
          placeholder={search?.placeholder}
        />
      </div>
      <div className="headerActions">
        {map(actions, (value) => {
          return <span className="headerAction">{value?.name}</span>;
        })}
      </div>
    </div>
  );
};
