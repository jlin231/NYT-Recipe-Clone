import { useDispatch, useSelector } from "react-redux";
import "./SingleRecipePage.css";
import { useEffect, useState } from "react";
import { NavLink, useHistory, useParams } from "react-router-dom";
import { thunkDeleteRecipe, thunkGetSingleRecipe } from "../../store/recipe";

const SingleRecipePage = () => {
    const sessionUser = useSelector((state) => state.session.user);
    const singleRecipe = useSelector((state) => state.recipes.singleRecipe)
    const dispatch = useDispatch();
    const history = useHistory();
    const [loadedPage, setLoadedPage] = useState(false);

    let { recipeId } = useParams()

    useEffect(() => {
        dispatch(thunkGetSingleRecipe(recipeId)).then(() => setLoadedPage(true));
    }, [dispatch]);

    if (!loadedPage || !singleRecipe) {
        return null
    }

    const handleEdit = () => {
        history.push(`/recipes/${recipeId}/edit`)
    }

    const handleDelete = () => {
        dispatch(thunkDeleteRecipe(recipeId))
        history.push('/recipes')
    }

    return (
        <div>
            <div className="Top-Info-Container">
                <img className="splashImage" src={`${singleRecipe.previewImage}`} alt="" />
            </div>
            <div>{singleRecipe.title}</div>
            <div>{singleRecipe.description}</div>
            {
                (sessionUser && singleRecipe.author_id === sessionUser.id) ?
                    <div>
                        <div onClick={handleEdit}>Edit Recipe</div>
                        <div onClick={handleDelete}>Delete Recipe</div>
                    </div> : null
            }
        </div>
    )
}

export default SingleRecipePage
