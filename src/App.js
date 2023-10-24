import { useEffect, useState } from "react";
import Auth from "./components/auth";
import { db, auth, storage } from "./config/firebase"
import { getDoc, getDocs, addDoc, deleteDoc, updateDoc, collection, doc } from "firebase/firestore"
import {toast} from "react-hot-toast";
import { ref, uploadBytes } from "firebase/storage";

function App() {

  //movie list
  const [movieList, setMovieList] = useState([]);

  //add new movie states
  const [newMovieTitle, setNewMovieTitle] = useState("");
  const [newMovieReleaseDate, setNewMovieReleaseDate] = useState(Date(null));
  const [isNewMovieOscar, setIsNewMovieOscar] = useState(false);

  //update states
  const [updatedTitle, setUpdatedTitle] = useState("");

  //file upload state
  const [file, setFile] = useState(null);


  const moviesCollectionRef = collection(db, "movies");

  //get all movies
  const getMoviesList = async() => {
    try{
      const data = await getDocs(moviesCollectionRef);
      
      const filteredData = data.docs.map((doc)=>({
        ...doc.data(),
        id: doc.id,
      }))

      setMovieList(filteredData);
      // console.log(filteredData);
    }
    catch(error){
      toast.error(error.message);
    }
  }

  useEffect(()=>{
    getMoviesList();
  },[])

  //add new movie
  const onSubmitMovie = async(e) => {
    e.preventDefault();

    try{
      await addDoc(moviesCollectionRef, {
        Title: newMovieTitle,
        ReleaseDate: newMovieReleaseDate,
        Oscar: isNewMovieOscar,
        userId: auth?.currentUser?.uid ? auth?.currentUser?.uid : null,
      })
      getMoviesList();
    }
    catch(error){
      toast.error(error.message);
    }

    setNewMovieTitle("");
    setNewMovieReleaseDate(Date(null));
    setIsNewMovieOscar(false);
  }

  //delete movie
  const deleteMovie = async(id) => {
    try{
      const movieDoc = doc(db, "movies", id);

      const movie = await getDoc(movieDoc);
      const data = movie.data();

      await deleteDoc(movieDoc);
      getMoviesList();
      toast.success(`${data.Title} deleted successfully`);
    }
    catch(error){
      toast.error(error.message);
    }
  }

  //update movie
  const updateMovie = async(id) => {
    if(updatedTitle !== ""){
      try{
        const movieDoc = doc(db, "movies", id);
        await updateDoc(movieDoc, {Title: updatedTitle});
        getMoviesList();
        setUpdatedTitle("");
      }
      catch(error){
        toast.error(error.message);
      }
    }
  }

  //file upload
  const uploadFile = async() => {
    if(file){
      const filesFolderRef = ref(storage, `projectFiles/${file.name}`);
      try{
        await uploadBytes(filesFolderRef, file);
        toast.success("File uploaded successfully");
      }
      catch(error){
        toast.error(error.message);
      }
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">Firebase and React Project</h1>
      <div className="min-h-[40px]"></div>
      <p className="text-xl font-semibold">AUTHENTICATION</p>
      <Auth/>
      <div className="min-h-[80px]"></div>
      <p className="text-xl font-semibold">CRUD OPERATIONS</p>


      <div className="mt-4 mb-2 text-lg font-semibold">Create a new movie entry (Adding entry to firestore database)</div>
  
      <form onSubmit={onSubmitMovie}>
        <div className="flex items-center gap-2 mb-2">
          <label htmlFor="title">Title</label>
          <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none"
            id="title"
            value={newMovieTitle}
            onChange={(e)=>setNewMovieTitle(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 mb-2">
          <label htmlFor="releaseDate">Release Date</label>
          <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none"
            id="releaseDate"
            type="date"
            value={newMovieReleaseDate}
            onChange={(e)=>setNewMovieReleaseDate(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 mb-2">
          <label htmlFor="oscar">Oscar Won? </label>
          <input
            id="oscar"
            type="checkbox"
            checked={isNewMovieOscar}
            onChange={(e)=>setIsNewMovieOscar(e.target.checked)}
          />
        </div>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Create Entry</button>
      </form>
      


      <p className="mt-10 text-lg font-semibold">List of movies (Reading from firestore database)</p>
      <div>
        {
          movieList.map((movie)=>(
            <div className="flex justify-between items-center" key={movie.id}>
              <div className="flex gap-2">
                <p className="text-3xl font-bold">.</p>
                <ul className="my-2" key={movie.id}>
                  <li>Id: {movie.id}</li>
                  <li>Title: {movie.Title}</li>
                  <li>Release Date : {movie.ReleaseDate.toString()}</li>
                  <li>Oscar: {movie.Oscar ? "True" : "False"}</li>

                  <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none"
                  value={updatedTitle}
                  onChange={(e)=>setUpdatedTitle(e.target.value)}
                  placeholder="New Title"/>

                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
                  onClick={()=>updateMovie(movie.id)}
                  >
                  Update Title
                  </button>

                </ul>
                </div>
              <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={()=>deleteMovie(movie.id)}
              >Delete</button>
            </div>
          ))
        }
      </div>

      <div className="min-h-[80px]"></div>
      <p className="text-xl font-semibold mb-2">FILE UPLOAD</p>

      <input type="file" onChange={(e)=>setFile(e.target.files[0])}/>

      <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={uploadFile}>Upload File</button>

    </div>
  );
}

export default App;