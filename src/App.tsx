import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Pokemon, getAll, getByName } from "./API";
import "./styles.css";

const calculatePower = (pokemon: Pokemon) =>
  pokemon.hp +
  pokemon.attack +
  pokemon.defense +
  pokemon.special_attack +
  pokemon.special_defense +
  pokemon.speed;

interface PokemonwithPower extends Pokemon {
  power: number;
}

const PokemonTable: React.FunctionComponent<{
  pokemon: PokemonwithPower[];
}> = ({ pokemon }) => {
  return (
    <table>
      <thead>
        <tr>
          <td>ID</td>
          <td>Name</td>
          <td>Type</td>
          <td colSpan={6}>Stats</td>
          <td> Power </td>
        </tr>
      </thead>
      <tbody>
        {pokemon.map((p) => (
          <tr key={p.id}>
            <td>{p.id}</td>
            <td>{p.name}</td>
            <td>{p.type.join(",")}</td>
            <td>{p.hp}</td>
            <td>{p.attack}</td>
            <td>{p.defense}</td>
            <td>{p.special_attack}</td>
            <td>{p.special_defense}</td>
            <td>{p.speed}</td>
            <td>{p.power}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default function App() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [threshold, setThreshold] = useState(0);
  const [search, setSearch] = useState("");

  function handleThreshold(event: React.ChangeEvent<HTMLInputElement>) {
    setThreshold(Number(event.target.value));
  }

  useEffect(() => {
    getByName(search).then(setPokemon);
  }, [search]);

  const pokemonWithPower = useMemo(() => {
    return pokemon.map((pk) => ({
      ...pk,
      power: calculatePower(pk),
    }));
  }, [pokemon]);

  const countOverThreshold = useMemo(() => {
    return pokemonWithPower.filter((pk) => pk.power > threshold).length;
  }, [pokemonWithPower, threshold]);

  const onSetSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(event.target.value);
    },
    []
  );

  const min = useMemo(() => {
    return Math.min(...pokemonWithPower.map((p) => p.power));
  }, [pokemonWithPower]);

  const max = useMemo(() => {
    return Math.max(...pokemonWithPower.map((p) => p.power));
  }, [pokemonWithPower]);

  return (
    <div>
      <div className="top-bar">
        <div>Search</div>
        <input type="text" onChange={onSetSearch} value={search} />
        <div>Power threshold: {threshold}</div>
        <input value={threshold} type="text" onChange={handleThreshold}></input>
        <div>Count over threshold: {countOverThreshold}</div>
      </div>
      <div className="two-column">
        <PokemonTable pokemon={pokemonWithPower} />
        <div>
          <div>Min: {min}</div>
          <div>Max: {max}</div>
        </div>
      </div>
    </div>
  );
}
