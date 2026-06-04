import React, { useEffect, useRef, useState } from "react";
import allCountries from "../../database/countries.json";

export type Country = {
  name: string;
  code: string;
  flag?: string;
};

const countries: Country[] = allCountries;

const CountrySelect: React.FC<{
  value?: Country | null;
  onChange?: (country: Country) => void;
}> = ({ value, onChange }) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const codeToFlag = (code: string): string => {
    try {
      return code
        .toUpperCase()
        .replace(/./g, (c: string) =>
          String.fromCodePoint(127397 + c.charCodeAt(0)),
        );
    } catch {
      return "";
    }
  };

  const countriesWithFlags = countries.map((c) => ({
    ...c,
    flag: codeToFlag(c.code),
  }));

  const filtered = countriesWithFlags.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setSearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={wrapperRef}
      style={{ position: "relative", width: "100%", boxSizing: "border-box" }}
    >
      <input
        type="text"
        value={open ? search : value?.name || ""}
        placeholder="Choose Country"
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setSearch(e.target.value);
          setOpen(true);
        }}
        className="input-main"
        style={{
          width: "100%",
          boxSizing: "border-box",
        }}
      />

      {open && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            maxHeight: 240,
            overflowY: "auto",
            border: "1px solid var(--stroke)",
            borderRadius: "0.5rem",
            background: "#fff",
            zIndex: 1000,
          }}
        >
          {filtered.map((country) => (
            <div
              key={country.code}
              onClick={() => {
                onChange?.(country);
                setSearch("");
                setOpen(false);
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--surface)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
              style={{
                padding: "0.75rem",
                cursor: "pointer",
                borderBottom: "1px solid var(--stroke)",
                transition: "background 0.4s ease-in-out",
              }}
            >
              <p className="body">
                {country.flag} {country.name} ({country.code})
              </p>
            </div>
          ))}

          {filtered.length === 0 && (
            <div style={{ padding: 10 }}>
              <p className="label">No results</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CountrySelect;
