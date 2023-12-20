// GiphySearch.js
"use client"
import { useState, useEffect } from "react";
import axios from "axios";
import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import { db } from "../Firebase";

import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  serverTimestamp,
  getDocs,
  query as firestoreQuery, // Import query from firebase/firestore
  orderBy,
} from "firebase/firestore";
// ...

type Gif = {
  id: string;
  url: string;
  title: string;
};

const GiphySearch: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [gifs, setGifs] = useState<Gif[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [showFavorites, setShowFavorites] = useState<boolean>(false);

  const GIPHY_API_KEY: string = "GlVGYHkr3WSBnllca54iNt0yFbjz7L65";
  const GIPHY_API_URL: string = "https://api.giphy.com/v1/gifs/search";

  const searchGifs = async (url: string) => {
    try {
      const response = await axios.get(url, {
        params: {
          api_key: GIPHY_API_KEY,
          q: query,
          offset,
        },
      });
      const newGifs: Gif[] = response.data.data.map((gif: any) => ({
        id: gif.id,
        url: gif.images.fixed_height.url,
        title: gif.title,
      }));
      setTotalPages(Math.ceil(response.data.pagination.total_count / 3));
      if (offset === 0) {
        setGifs(newGifs);
      } else {
        setGifs((prevGifs) => [...prevGifs, ...newGifs]);
      }
    } catch (error) {
      console.error("Oops, Something went wrong!", error);
    }
  };

  const fetchFavorites = async () => {
    try {
      const favoritesSnapshot = await getDocs(
       firestoreQuery(collection(db, "users", "user123", "favorites"), orderBy("timestamp", "desc"))
      );
      const favoriteIds = favoritesSnapshot.docs.map((doc) => doc.id);
      setFavorites(favoriteIds);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  useEffect(() => {
    if (query !== "") {
      searchGifs(GIPHY_API_URL);
    }
    fetchFavorites();
  }, [query, offset]);

  const handleSearch = () => {
    setOffset(0);
    searchGifs(GIPHY_API_URL);
  };

  const handleNext = () => {
    setOffset(offset + 3);
  };

  const handlePrevious = () => {
    if (offset >= 3) {
      setOffset(offset - 3);
    }
  };

  const handleFavorite = async (id: string) => {
    try {
      const isFavorite = favorites.includes(id);
      if (isFavorite) {
        setFavorites((prevFavorites) =>
          prevFavorites.filter((fav) => fav !== id)
        );
        await deleteDoc(
          doc(collection(db, "users", "user123", "favorites"), id)
        );
      } else {
        setFavorites((prevFavorites) => [...prevFavorites, id]);
        await setDoc(
          doc(collection(db, "users", "user123", "favorites"), id),
          {
            timestamp: serverTimestamp(),
          }
        );
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    redirect("/signin");
  };

  const handleToggleFavorites = () => {
    setShowFavorites((prevShowFavorites) => !prevShowFavorites);
  };

  return (
    
    <div className="min-h-screen bg-gray-100">
     
      <div className="bg-pink-700 text-white py-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
            GIF Search
          </h1>

          <div className="flex items-center">
            <button
              onClick={handleToggleFavorites}
              className="ml-2 bg-white text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring focus:border-pink-300"
            >
              {showFavorites ? "Hide Favorites" : "Show Favorites"}
            </button>
            <button
              className="ml-2 text-sm md:text-base px-3 py-1 bg-red-500 hover:bg-red-600 rounded-lg"
              onClick={handleSignOut}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      <div className="flex items-center p-16">
        <input
          type="text"
          placeholder="Search for GIFs"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-pink-300"
        />
        <button
          onClick={handleSearch}
          className="ml-2 bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-600 focus:outline-none focus:ring focus:border-pink-300"
        >
          Search
        </button>
      </div>
      <div className="container mx-auto p-4 mt-4">
        {showFavorites && favorites.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4">
              Your Favorites
            </h2>
            <div className="flex flex-wrap -mx-2">
              {gifs
                .filter((gif) => favorites.includes(gif.id))
                .map((gif) => (
                  <div key={gif.id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 p-2">
                    <img
                      src={gif.url}
                      alt={gif.title}
                      className="w-full h-auto rounded-md mb-2"
                    />
                    <button
                      onClick={() => handleFavorite(gif.id)}
                      className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded-md w-full"
                    >
                      Remove from Favorites
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          <div className="flex flex-wrap -mx-2">
            {gifs.slice(offset, offset + 3).map((gif) => (
              <div key={gif.id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 p-2">
                <img
                  src={gif.url}
                  alt={gif.title}
                  className="w-full h-auto rounded-md mb-2"
                />
                <button
                  onClick={() => handleFavorite(gif.id)}
                  className={`${
                    favorites.includes(gif.id)
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-pink-500 hover:bg-pink-600"
                  } text-white py-1 px-2 rounded-md w-full`}
                >
                  {favorites.includes(gif.id)
                    ? "Remove from Favorites"
                    : "Add to Favorites"}
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-4">
            <button
              onClick={handlePrevious}
              disabled={offset === 0}
              className="bg-white text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded-md shadow-sm disabled:opacity-40 hover:bg-gray-200 focus:outline-none focus:ring focus:border-pink-300 mr-2"
            >
              ⬅️ Previous
            </button>
            <button
              onClick={handleNext}
              disabled={offset + 3 >= totalPages * 3}
              className="bg-white text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded-md shadow-sm disabled:opacity-40 hover:bg-gray-200 focus:outline-none focus:ring focus:border-pink-300"
            >
              Next ➡️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiphySearch;
