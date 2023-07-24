
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let productSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    photo: {
      type: String,
      default:
        'https://i.dell.com/is/image/DellContent//content/dam/ss2/product-images/dell-client-products/notebooks/latitude-notebooks/14-3420/media-gallery/peripherals_laptop_latitude_3420nt_gallery_3.psd?fmt=png-alpha&pscan=auto&scl=1&wid=3635&hei=2548&qlt=100,1&resMode=sharp2&size=3635,2548&chrss=full&imwidth=5000',
    },
    deleted: { type: Boolean, default: false },
    id: {type: String}
  });
  

let Product = mongoose.model('Product', productSchema) //db collection name-->products
// const Product = mongoose.model('Product', productSchema, 'customCollectionName'); // To specify collection name -->customCollectionName

module.exports = Product;