import { useState, useEffect,useRef } from "react"; // useEffect might be useful if you want to clear errors on change, but not strictly necessary for basic validation
import axios from 'axios';
import '../Css-components/AddItem.css'; // Ensure you have styles for errors

const AddItem = () => {
    const [itemName, setItemName] = useState("");
    const [category, setCategory] = useState("");
    const [customCategory, setCustomCategory] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [itemImage, setItemImage] = useState(null);
    const [categoryImage, setCategoryImage] = useState(null);
  
  
    const formRef = useRef();


    // New state for validation errors
    const [errors, setErrors] = useState({});
    const [formMessage, setFormMessage] = useState({ type: '', text: '' }); // For success/error messages at form level

    const token = localStorage.getItem("Token");

    // Function to validate form inputs
    const validateForm = () => {
        let newErrors = {};
        let isValid = true;

        // Item Name validation
        if (!itemName.trim()) {
            newErrors.itemName = "Item Name is required.";
            isValid = false;
        } else if (itemName.trim().length < 3) {
            newErrors.itemName = "Item Name must be at least 3 characters.";
            isValid = false;
        }

        // Category validation
        if (!category) {
            newErrors.category = "Please select a category.";
            isValid = false;
        } else if (category === "custom") {
            if (!customCategory.trim()) {
                newErrors.customCategory = "Custom category name is required.";
                isValid = false;
            } else if (customCategory.trim().length < 2) {
                newErrors.customCategory = "Custom category name must be at least 2 characters.";
                isValid = false;
            }
            if (!categoryImage) {
                newErrors.categoryImage = "Category image is required for custom categories.";
                isValid = false;
            }
        }

        // Price validation
        if (!price || isNaN(price) || parseFloat(price) <= 0) {
            newErrors.price = "Price must be a positive number.";
            isValid = false;
        }

        // Description validation (optional, adjust as needed)
        if (!description.trim()) {
            newErrors.description = "Description is required.";
            isValid = false;
        } else if (description.trim().length < 10) {
            newErrors.description = "Description must be at least 10 characters.";
            isValid = false;
        }

        // Item Image validation
        if (!itemImage) {
            newErrors.itemImage = "Item image is required.";
            isValid = false;
        } else if (itemImage.size > 2 * 1024 * 1024) { // Example: 2MB limit
            newErrors.itemImage = "Item image must be less than 2MB.";
            isValid = false;
        }

        setErrors(newErrors); // Update the errors state
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormMessage({ type: '', text: '' }); // Clear previous form messages

        if (!validateForm()) {
            setFormMessage({ type: 'error', text: 'Please correct the errors in the form.' });
            return; // Stop submission if validation fails
        }

        const finalCategory = category === "custom" ? customCategory : category;

        const formData = new FormData();
        formData.append('category', finalCategory);
        formData.append('description', description);
        formData.append('itemName', itemName);
        formData.append('price', price);

        if (itemImage) formData.append('itemImage', itemImage);
        if (category === "custom" && categoryImage) formData.append('categoryImage', categoryImage);

        try {
            console.log("FormData before sending:", formData); // FormData cannot be directly logged like an object, use this for debugging content:
            // for (let pair of formData.entries()) {
            //     console.log(pair[0]+ ', ' + pair[1]);
            // }

            const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/additem`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`
                },
            });

            console.log(response);

            if (response.status === 201) { // Assuming 201 Created for successful resource creation
                setFormMessage({ type: 'success', text: "Item added successfully!" });
                // Clear form fields
             // ... inside the if (response.status === 201) block ...
             setItemName("");
             setCategory("");
             setCustomCategory("");
             setPrice("");
             setDescription("");
             setItemImage(null);
             setCategoryImage(null);
             setErrors({});

             // This line is crucial for clearing file inputs and other native form elements
             if (formRef.current) {
                 formRef.current.reset();
             }
            } else {
                // Handle other successful but non-201 statuses if applicable, or generic error
                setFormMessage({ type: 'error', text: response.data.message || "Failed to add item." });
            }
        } catch (error) {
            console.error("Error adding item:", error);
            // Check for specific error responses from backend
            if (error.response && error.response.data && error.response.data.message) {
                setFormMessage({ type: 'error', text: error.response.data.message });
            } else {
                setFormMessage({ type: 'error', text: "An unexpected error occurred. Please try again." });
            }
        }
    };

    const handleCategoryChange = (e) => {
        const selectedValue = e.target.value;
        setCategory(selectedValue);
        // Clear category-related errors when category changes
        setErrors(prev => ({ ...prev, category: '', customCategory: '', categoryImage: '' }));

        if (selectedValue !== "custom") {
            setCustomCategory("");
            setCategoryImage(null);
        }
    };

    // Helper function to handle input changes and clear relevant errors
    const handleInputChange = (setter, fieldName) => (e) => {
        setter(e.target.value);
        setErrors(prev => ({ ...prev, [fieldName]: '' })); // Clear error for this field
    };

    const handleFileChange = (setter, fieldName) => (e) => {
        setter(e.target.files[0]);
        setErrors(prev => ({ ...prev, [fieldName]: '' })); // Clear error for this field
    };


    return (
        <>
            <div className="AddItem-container"> {/* Use a distinct class for the container */}
            <form ref={formRef} onSubmit={handleSubmit} className="add-item-form">
                    <h2>Add New Menu Item</h2>

                    {formMessage.text && (
                        <div className={`form-message ${formMessage.type}`}>
                            {formMessage.text}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="category">Select Category:</label>
                        <select
                            name="category"
                            id="category"
                            onChange={handleCategoryChange}
                            value={category}
                            className={errors.category ? 'input-error' : ''}
                        >
                            <option value="">-- Select A Category --</option>
                            <option value="pizza">PIZZA</option>
                            <option value="burger">BURGER</option>
                            <option value="coldcoffee">COLD COFFEE</option>
                            <option value="maggie">MAGGIE</option>
                            <option value="sandwich">SANDWICH</option>
                            <option value="custom">Custom</option>
                        </select>
                        {errors.category && <p className="error-message">{errors.category}</p>}
                    </div>

                    {category === "custom" && (
                        <>
                            <div className="form-group">
                                <label htmlFor="customCategory">Custom Category Name:</label>
                                <input
                                    type="text"
                                    id="customCategory"
                                    placeholder="Enter custom category name"
                                    value={customCategory}
                                    onChange={handleInputChange(setCustomCategory, 'customCategory')}
                                    className={errors.customCategory ? 'input-error' : ''}
                                />
                                {errors.customCategory && <p className="error-message">{errors.customCategory}</p>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="categoryImage">Category Image:</label>
                                <input
                                    type="file"
                                    id="categoryImage"
                                    accept="image/*"
                                    onChange={handleFileChange(setCategoryImage, 'categoryImage')}
                                    className={errors.categoryImage ? 'input-error' : ''}
                                />
                                {errors.categoryImage && <p className="error-message">{errors.categoryImage}</p>}
                            </div>
                        </>
                    )}

                    <div className="form-group">
                        <label htmlFor="itemName">Item Name:</label>
                        <input
                            type="text"
                            id="itemName"
                            placeholder="Item Name"
                            value={itemName}
                            onChange={handleInputChange(setItemName, 'itemName')}
                            className={errors.itemName ? 'input-error' : ''}
                        />
                        {errors.itemName && <p className="error-message">{errors.itemName}</p>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="price">Price:</label>
                        <input
                            type="number"
                            id="price"
                            placeholder="Price"
                            value={price}
                            onChange={handleInputChange(setPrice, 'price')}
                            className={errors.price ? 'input-error' : ''}
                        />
                        {errors.price && <p className="error-message">{errors.price}</p>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description:</label>
                        <textarea
                            id="description"
                            placeholder="Description"
                            value={description}
                            onChange={handleInputChange(setDescription, 'description')}
                            className={errors.description ? 'input-error' : ''}
                            rows="4" // Make it a textarea for better description input
                        ></textarea>
                        {errors.description && <p className="error-message">{errors.description}</p>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="itemImage">Item Image:</label>
                        <input
                            type="file"
                            id="itemImage"
                            accept="image/*"
                            onChange={handleFileChange(setItemImage, 'itemImage')}
                            className={errors.itemImage ? 'input-error' : ''}
                        />
                        {errors.itemImage && <p className="error-message">{errors.itemImage}</p>}
                    </div>

                    <button type="submit" className="submit-button">Add Item</button>
                </form>
            </div>
        </>
    );
};

export default AddItem;