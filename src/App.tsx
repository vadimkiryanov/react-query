import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import axios from '../node_modules/axios/index';
import './App.css';
import { Root } from './api/types';

const fetchCharacters = async (page: number) => {
  const { data } = await axios.get<Root>(`https://rickandmortyapi.com/api/character/?page=${page}`);

  return data.results;
};

function App() {
  const [page, setPage] = useState(1);
  const {
    data: characters,
    isError,
    isLoading,
  } = useQuery(['characters', page], () => fetchCharacters(page), {
    keepPreviousData: true, // ? Убирает перерендер всего компонента
    refetchOnWindowFocus: false,
  }); // ? page в массиве идет как зависимость - подобие useEffect

  // Что исчезло:
  // const [characters, setCharacters] = useState<any>([]);
  // const [isLoading, setIsLoading] = useState(true);
  // const [isError, setIsError] = useState(false);
  // useQuery

  // const fetchCharacters = async () => {
  //   try {
  //     const { data } = await axios.get('https://rickandmortyapi.com/api/character/?page=1');
  //     setCharacters(data);
  //   } catch (error) {
  //     setIsError(true);
  //     setIsLoading(false);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // useEffect(() => {
  // fetchCharacters();
  // }, []);

  if (isLoading) {
    return <h2>Loading</h2>;
  }
  if (isError) {
    return <h2>Error</h2>;
  }

  if (!characters) {
    return <h2>Нет данных</h2>;
  }

  return (
    <>
      <div className="flex text-left">
        <div className="p-2 w-full border border-solid border-gray-100">ID:</div>
        <div className="p-2 w-full border border-solid border-gray-100">Персонаж:</div>
        <div className="p-2 w-full border border-solid border-gray-100">Описание:</div>
      </div>
      <div className="flex mb-4">
        <div className="flex flex-col w-full text-left ">
          {characters?.map((item) => {
            return (
              <span key={item.id} className="p-2 border border-solid border-gray-100">
                {item.id}
              </span>
            );
          })}
        </div>
        <div className="flex flex-col w-full text-left">
          {characters?.map((item) => {
            return (
              <span key={item.id} className="p-2 flex items-center gap-4 border border-solid border-gray-100">
                <img className="w-6" src={item.image} alt={item.name} />
                {item.name}
              </span>
            );
          })}
        </div>
        <div className="flex flex-col w-full text-left">
          {characters?.map((item) => {
            return (
              <span key={item.id} className="p-2 border border-solid border-gray-100">
                {item.status}
              </span>
            );
          })}
        </div>
      </div>
      {page}
      <div className="flex justify-center items-center gap-4">
        <button onClick={() => setPage((prev) => prev - 1)} className="p-2 bg-slate-500 rounded-md">
          prev
        </button>
        <button onClick={() => setPage((prev) => prev + 1)} className="p-2 bg-slate-500 rounded-md">
          next
        </button>
      </div>
    </>
  );
}

export default App;
