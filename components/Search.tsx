import React, { useEffect, useMemo, useState } from "react";
import { AUTOCOMPLETE } from "../ts/autocomplete";
import Link from "next/link";

const Search = () => {
  const [query, setQuery] = useState("");

  const filteredAuto = useMemo(
    () =>
      AUTOCOMPLETE.filter(auto =>
        auto.keywords.some(keyword => keyword.includes(query.toLowerCase()))
      ),
    [query]
  );

  useEffect(() => console.log(query), [query]);

  return (
    <div id="nav-search">
      <input type="text" onChange={e => setQuery(e.target.value)} placeholder="Szukaj" />
      <div>
        {filteredAuto.map((auto, index) => {
          return (
            <Link key={"key" + index} href={auto.path}>
              <h3>{auto.title}</h3>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Search;
