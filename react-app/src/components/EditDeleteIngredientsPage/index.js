import { useDispatch, useSelector } from "react-redux";
import "./EditDeleteIngredientsPage.css";
import { useEffect, useState } from "react";
import { NavLink, useHistory, useParams } from "react-router-dom";
import { thunkEditDeleteIngredients, thunkAddIngredients, thunkGetAllRecipe, thunkGetSingleRecipe } from "../../store/recipe";

const EditDeleteIngredientsPage = () => {
    const sessionUser = useSelector((state) => state.session.user);
    const dispatch = useDispatch();
    const history = useHistory();
    const { recipeId } = useParams()

    const initArr = [
        {
            name: "",
            quantity: "",
            unit: ""
        }
    ];
    const [ingredientInputArr, setIngredientInputArr] = useState(initArr)

    useEffect(() => {
        dispatch(thunkGetSingleRecipe(recipeId)).then((res) => {
            console.log('res', res.ingredients)
            let output = []
            res.ingredients.forEach((ingredient) => {
                output.push({
                    id: ingredient.id,
                    name: ingredient.name,
                    quantity: ingredient.quantity,
                    unit: ingredient.unit
                })
            })
            console.log('res', output)
            setIngredientInputArr(output)
        })
    }, [dispatch])

    const [errors, setErrors] = useState([]);

    const handleIngredientChange = (index, e) => {
        e.preventDefault()
        let newFormValues = [...ingredientInputArr];

        newFormValues[index][e.target["name"]] = e.target.value;
        setIngredientInputArr(newFormValues);
        console.log(ingredientInputArr)
    }

    const removeInput = (e, index) => {
        e.preventDefault()
        setIngredientInputArr(s => {
            let newS = [...s];
            newS.splice(index, 1)
            return newS;
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);

        let body = []

        ingredientInputArr.forEach((ingredient) => {
            body.push({
                "id": ingredient.id,
                "name": ingredient.name,
                "quantity": Number(ingredient.quantity),
                "unit": ingredient.unit
            })
        })

        try {
            const res = await dispatch(thunkEditDeleteIngredients(body, recipeId))
            console.log('res=================<', res)

            history.push(`/recipes/${recipeId}`)

        } catch (error) {
            let errorObject = JSON.parse(error.message);
            if (errorObject) setErrors(errorObject.errors);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="Global-Form-Container">
                <ul className="Global-Errors-UL">
                    {errors.map((error, idx) => (
                        <li key={idx} className="Global-Errors-LI">
                            {error}
                        </li>
                    ))}
                </ul>
                <div className="instructionFormDiv">
                    <div className="Global-Form-Button-Holder">
                        <div className="Global-Form-Button-Header">Edit/Delete Ingredients</div>

                    </div>
                    {ingredientInputArr.map((item, index) => {
                        return (
                            <div key={index} className="Global-Input-Container">
                                <input
                                    onChange={(e) => handleIngredientChange(index, e)}
                                    value={item.name}
                                    id={index}
                                    placeholder="Name"
                                    required
                                    name="name"
                                    type="text"
                                    className="Global-Input-Text"
                                />
                                <input
                                    onChange={(e) => handleIngredientChange(index, e)}
                                    value={item.unit}
                                    id={index}
                                    placeholder="Unit"
                                    required
                                    name="unit"
                                    type="text"
                                    className="Global-Input-Text unit"
                                />
                                <input
                                    onChange={(e) => handleIngredientChange(index, e)}
                                    value={item.quantity}
                                    placeholder="Quantity"
                                    id={index}
                                    required
                                    name="quantity"
                                    type="number"
                                    className="Global-Input-Text"
                                />
                                <button onClick={(e) => removeInput(e, index)} className="Global-Ingredient-Add-Button"><i class="fa-solid fa-minus add-and-subtract-Icon"></i></button>
                            </div>

                        );
                    })}
                </div>
                <button type="submit" className="Global-SubmitButton">
                    Submit
                </button>
            </form>

        </div>
    )
}

export default EditDeleteIngredientsPage
