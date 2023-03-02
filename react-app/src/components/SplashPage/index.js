import { useDispatch, useSelector } from "react-redux";
import "./SplashPage.css";
import { useEffect, useState } from "react";
import * as sessionActions from "../../store/session";
import { NavLink, useHistory } from "react-router-dom";
import { thunkGetAllRecipe } from "../../store/recipe";
import SplashRecipeCard from "./SplashRecipeCard";

const SplashPage = () => {
    const allRecipes = useSelector((state) => state.recipes.allRecipes)
    const dispatch = useDispatch();
    const history = useHistory();
    const [loadedPage, setLoadedPage] = useState(false);



    useEffect(() => {
        dispatch(thunkGetAllRecipe()).then(() => setLoadedPage(true));
    }, [dispatch]);

    if (!loadedPage || !allRecipes) {
        return null
    }

    //make a new set of arrays, with arrays with 2 recipes in them
    const recipeValues = Object.values(allRecipes)

    let recipeArray = []
    for (let i = 0; i < recipeValues.length; i = i + 2) {
        recipeArray.push(recipeValues.slice(i, i + 2))
    }

    return (
        <>
            <div className="SplashPage-Container">
                <img className="splashImage" src="https://burst.shopifycdn.com/photos/flatlay-iron-skillet-with-meat-and-other-food.jpg?width=1200&format=pjpg&exif=1&iptc=1" alt=""
                    onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/640px-Image_not_available.png";
                    }} />
            </div>
            <div className="lowerDiv">
                <div className="navLinkContainer">
                    <NavLink exact to='/recipes/explore' className="whatToCookDiv">
                        <div className="whatToCookText">What to Cook This Week</div>
                    </NavLink>
                </div>
                {
                    recipeArray.map((array) => {
                        return (<div className="splashRecipeContainer">
                            {array.map((recipe) => {
                                return (
                                    <NavLink exact to={`/recipes/${recipe.id}`} key={recipe.id} className="splashNavLink">
                                        <SplashRecipeCard recipe={recipe} />
                                    </NavLink>
                                )
                            })}
                        </div>)
                    })
                }
            </div>
        </>
    )
}

export default SplashPage
