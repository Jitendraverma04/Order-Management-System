import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  categoryName: { type: String, required:true},
  categoryImage: { type: String },
  categoryStatus:{type:Boolean,default:true},
  items: [
    {
      itemStatus:{type:Boolean,default:true},
      itemName: { type: String, required: true },
      price: { type: Number, required: true },
      description: { type: String, required: true },
      itemImage: { type: String }
    }
  ]
});

const Category = mongoose.model('Category', CategorySchema);

export default Category;
