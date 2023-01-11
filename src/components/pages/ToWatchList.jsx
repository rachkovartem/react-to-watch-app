import { useStore } from "effector-react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { $userFilmsList } from "../../models/films";

import FilmList from "../filmList/FilmList";
import AppSidemenu from "../appSidemenu/AppSideMenu";
import KinopoiskServices from "../../services/KinopoiskServices";
import ErrorBoundary from "../errorBoundary/ErrorBoundary";
import PantryServices from "../../services/PantryServices";

import Search from "../search/Search";
import NewFilmDialog from "../newFilmDialog/NewFilmDialog";

const ToWatchList = (props) => {
  const { drawerOpen, setDrawerOpen, setFilmsToWatch } = props;
  const [filterDate, setFilterDate] = useState("Всё время");
  const [filterGenre, setFilterGenre] = useState([]);
  const [filterSearch, setFilterSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isServerDataLoaded, setIsServerDataLoaded] = useState(false);
  const { user, isAuthenticated, isLoading } = useAuth0();
  const userFilmsList = useStore($userFilmsList);

  const {
    loadingPantry,
    errorPantry,
    clearErrorPantry,
    getData,
    putData,
    postData,
  } = PantryServices();
  const { loading, error, getFilmById } = KinopoiskServices();

  const returnNewStockData = () => {
    return [
      {
        title: "Зеленая миля (The Green Mile), 1999",
        subtitle:
          "Пол Эджкомб — начальник блока смертников в тюрьме «Холодная гора», каждый из узников которого однажды проходит «зеленую милю» по пути к месту казни. Пол повидал много заключённых и надзирателей за время работы. Однако гигант Джон Коффи, обвинённый в страшном преступлении, стал одним из самых необычных обитателей блока.",
        id: 435,
        genre: ["детектив", "драма", "криминал", "фантастика", "фэнтези"],
        timestamp: 1609362000,
        posterUrlPreview:
          "https://kinopoiskapiunofficial.tech/images/posters/kp_small/435.jpg",
        ratingImdb: 8.6,
        ratingKinopoisk: 9.1,
      },
      {
        title: "Побег из Шоушенка (The Shawshank Redemption), 1994",
        subtitle:
          "Бухгалтер Энди Дюфрейн обвинён в убийстве собственной жены и её любовника. Оказавшись в тюрьме под названием Шоушенк, он сталкивается с жестокостью и беззаконием, царящими по обе стороны решётки. Каждый, кто попадает в эти стены, становится их рабом до конца жизни. Но Энди, обладающий живым умом и доброй душой, находит подход как к заключённым, так и к охранникам, добиваясь их особого к себе расположения.",
        id: 326,
        genre: ["драма"],
        timestamp: 1611781200,
        posterUrlPreview:
          "https://kinopoiskapiunofficial.tech/images/posters/kp_small/326.jpg",
        ratingImdb: 9.3,
        ratingKinopoisk: 9.1,
      },
      {
        title:
          "Властелин колец: Возвращение короля (The Lord of the Rings: The Return of the King), 2003",
        subtitle:
          "Повелитель сил тьмы Саурон направляет свою бесчисленную армию под стены Минас-Тирита, крепости Последней Надежды. Он предвкушает близкую победу, но именно это мешает ему заметить две крохотные фигурки — хоббитов, приближающихся к Роковой Горе, где им предстоит уничтожить Кольцо Всевластья.",
        id: 3498,
        genre: ["драма", "приключения", "фэнтези"],
        timestamp: 1618347600,
        posterUrlPreview:
          "https://kinopoiskapiunofficial.tech/images/posters/kp_small/3498.jpg",
        ratingImdb: 8.9,
        ratingKinopoisk: 8.6,
      },
      {
        title: "Форрест Гамп (Forrest Gump), 1994",
        subtitle:
          "Сидя на автобусной остановке, Форрест Гамп — не очень умный, но добрый и открытый парень — рассказывает случайным встречным историю своей необыкновенной жизни.\n\nС самого малолетства он страдал от заболевания ног, и соседские хулиганы дразнили мальчика, и в один прекрасный день Форрест открыл в себе невероятные способности к бегу. Подруга детства Дженни всегда его поддерживала и защищала, но вскоре дороги их разошлись",
        id: 448,
        genre: ["военный", "драма", "история", "комедия", "мелодрама"],
        timestamp: 1636405200,
        posterUrlPreview:
          "https://kinopoiskapiunofficial.tech/images/posters/kp_small/448.jpg",
        ratingImdb: 8.8,
        ratingKinopoisk: 8.9,
      },
      {
        title: "Интерстеллар (Interstellar), 2014",
        subtitle:
          "Когда засуха, пыльные бури и вымирание растений приводят человечество к продовольственному кризису, коллектив исследователей и учёных отправляется сквозь червоточину (которая предположительно соединяет области пространства-времени через большое расстояние) в путешествие, чтобы превзойти прежние ограничения для космических путешествий человека и найти планету с подходящими для человечества условиями.",
        id: 258687,
        genre: ["драма", "приключения", "фантастика"],
        timestamp: 1640811600,
        posterUrlPreview:
          "https://kinopoiskapiunofficial.tech/images/posters/kp_small/258687.jpg",
        ratingImdb: 8.6,
        ratingKinopoisk: 8.6,
      },
    ];
  };

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const updateRatingsFromServer = (data) => {
    if (!isMounted) return;
    if (data.length === 0 || typeof data.length !== "object") return;

    const newData = data.map((film) => {
      let newFilm = film;
      getFilmById(newFilm.id).then(
        (response) => {
          newFilm.ratingImdb = response.ratingImdb;
          newFilm.ratingKinopoisk = response.ratingKinopoisk;
        },
        (reasone) => {
          throw new Error(
            "Часть рейтингов фильмов не была обновлена из-за ограничесний сервера. Ошибка: ",
            reasone
          );
        }
      );
      return newFilm;
    });
  };

  const genres = () => {
    let arr = [];
    userFilmsList.forEach((item) => {
      item.genres.forEach((e) => {
        if (!arr.some((arrItem) => arrItem === e)) {
          arr.push(e);
        }
      });
    });
    return arr;
  };

  const filterGenreSetter = (key) => {
    setFilterGenre(key);
  };

  const filterDateSetter = (key) => {
    setFilterDate(key);
  };

  const onFilterGenre = (data, filter) => {
    if (!data) return;
    return data.filter((film) => {
      return filter.every((filterGenre) => {
        return film.genre.includes(filterGenre);
      });
    });
  };

  const onFilterDate = (data, filter) => {
    switch (filter) {
      case "Неделя":
        return data.filter(
          (item) => Date.now() / 1000 - item.timestamp < 604800
        );
      case "Месяц":
        return data.filter(
          (item) => Date.now() / 1000 - item.timestamp < 2629743
        );
      case "Год":
        return data.filter(
          (item) => Date.now() / 1000 - item.timestamp < 31556926
        );
      default:
        return data;
    }
  };

  const filtersReset = () => {
    filterGenreSetter([]);
    filterDateSetter("Всё время");
    setFilterSearch("");
  };

  const onFilterSearch = (data, filter) => {
    if (!data || filter === undefined) return;
    return data.filter((item) => {
      return (
        item.title.toLowerCase().includes(filter.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(filter.toLowerCase())
      );
    });
  };

  const memoizedAllIds = useMemo(() => {
    return userFilmsList.map((film) => {
      return film.id;
    });
  }, [userFilmsList]);

  const isIdAlreadyExists = (id) => {
    if (!memoizedAllIds) return;
    return memoizedAllIds.indexOf(id) > 0;
  };

  const memoizedFiltredData = useMemo(
    () =>
      onFilterGenre(
        onFilterDate(onFilterSearch(userFilmsList, filterSearch), filterDate),
        filterGenre
      ),
    [userFilmsList, filterSearch, filterDate, filterGenre]
  );

  return (
    <>
      <Search setFilterSearch={setFilterSearch} filterSearch={filterSearch} />
      <ErrorBoundary>
        <AppSidemenu
          onClickDrawerToggle={() => setDrawerOpen((drawerOpen) => !drawerOpen)}
          drawerOpen={drawerOpen}
          genres={genres}
          filterSetter={{ genre: filterGenreSetter, date: filterDateSetter }}
          filtersReset={filtersReset}
          filterGenre={filterGenre}
          filterDate={filterDate}
        />
      </ErrorBoundary>

      <ErrorBoundary>
        <FilmList
          loading={loading}
          data={memoizedFiltredData}
          onAdd={() => {}}
          onDelete={() => {}}
          setOpen={setOpen}
          loadingPantry={loadingPantry}
          isLoading={isLoading}
        />
      </ErrorBoundary>

      <ErrorBoundary>
        <NewFilmDialog
          setOpen={setOpen}
          open={open}
          isIdAlreadyExists={isIdAlreadyExists}
        />
      </ErrorBoundary>
    </>
  );
};

export default ToWatchList;
