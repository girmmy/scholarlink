import { React, useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="flex items-center">
      <input
        className="w-[600px] rounded-3xl justify-center shadow-md mx-auto py-3 px-8"
        type="text"
        placeholder="Search for Scholarships..."
        value={query}
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchBar;
