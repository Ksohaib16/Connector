import { Search } from "lucide-react";
import "./searchbox.css";
import { useState } from "react";
interface SearchBoxProps {
  handleSearch: (search: string) => void;
}

export const SearchBox = ({ handleSearch }: SearchBoxProps) => {

  const [search, setSearch] = useState("");

  return (
    <div className="search-box">
      <input
      className="search-box-input"
        value={search}
        type="text"
        placeholder="Search Friend"
        onChange={(e) => setSearch(e.target.value)}
      />
      <button className="search-btn" onClick={() => {handleSearch(search)}}>
        <Search color="#FFFF" />
      </button>
    </div>
  );
};
