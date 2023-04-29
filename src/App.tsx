import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import axios from '../node_modules/axios/index';
import './App.css';
import { INewCharcter, Result } from './api/types';

// Ф-я получения данных
const fetchGetCharacters = async (page: number) => {
  const { data } = await axios.get<Result[]>(`https://633e73820dbc3309f3b5d032.mockapi.io/file_manager`);

  return data;
};
// Ф-я отправки данных
const fetchPostCharacter = async (newCharacter: INewCharcter) => {
  const data = newCharacter;

  return await axios.post(`https://633e73820dbc3309f3b5d032.mockapi.io/file_manager`, data);
};

function App() {
  // Состояния
  const [page, setPage] = useState(1);

  // RQ - в данном случае, для работы с POST методом
  const queryClient = useQueryClient();

  // Получение данных
  // page в массиве идет как зависимость - подобие useEffect
  const { data: characters, isLoading } = useQuery(['characters', page], () => fetchGetCharacters(page), {
    keepPreviousData: true, // Убирает перерендер всего компонента
    refetchOnWindowFocus: true, // Рефетч при возвращении на страницу
  });

  // Изменение данных на сервере
  const mutation = useMutation((newDate: INewCharcter) => fetchPostCharacter(newDate), {
    onSuccess: () => queryClient.invalidateQueries(['characters']), // Если отправка данных прошла успешно - произойдет переполучение данных и отображение актуальных данных
  });

  // Хэндлер отправки формы
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Убираю дефолтное поведение

    const formData = new FormData(event.currentTarget); // Введенные значения в инпуты
    const fields = Object.fromEntries(formData); // Возвращает из массива объект с key и value

    mutation.mutate(fields as unknown as INewCharcter); // Отправка данных на сервер

    event.currentTarget.reset(); // Сбрасывает значение полей
  };

  // ////////////////////////////////////////////////////////////////
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
                <img className="w-6" src={item.image ? item.image : item.avatar} alt={item.name} />
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
        <button disabled={page <= 1} onClick={() => setPage((prev) => prev - 1)} className="p-2 bg-slate-500 rounded-md">
          prev
        </button>
        <button onClick={() => setPage((prev) => prev + 1)} className="p-2 bg-slate-500 rounded-md">
          next
        </button>
      </div>

      <div className="max-w-sm w-full mx-auto text-gray-600">
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <input
            placeholder="Имя персонажа"
            name="name"
            type="text"
            required
            className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
          />
          <input
            placeholder="Статус персонажа"
            name="status"
            type="text"
            required
            className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
          />
          <button className="w-full px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150">
            Отправить
          </button>
        </form>
      </div>
    </>
  );
}

export default App;
