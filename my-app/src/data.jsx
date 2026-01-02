/**
 * Product Data File
 * 
 * Central data source for all products in the e-commerce store.
 * Each product includes:
 * - id: Unique identifier
 * - image: Product image (imported from assets)
 * - title: Product name and description
 * - price: Product price in currency
 * - category: Product category for filtering
 * - isNew: (optional) Shows "NEW" badge
 * - onSale: (optional) Shows "SALE" badge
 * - outOfStock: (optional) Shows "SOLD OUT" badge and disables purchase
 */

// Import all product images
import img1 from './assets/product.img/3d.jpeg';
import img2 from './assets/product.img/earphone.jpeg';
import img3 from './assets/product.img/jbl.headphone.webp';
import img4 from './assets/product.img/kids.jpeg';
import img5 from './assets/product.img/notthing-phone.webp';
import img6 from './assets/product.img/onpeplus.webp';
import img7 from './assets/product.img/phonemax.webp';
import img8 from './assets/product.img/pixel-9.webp';
import img9 from './assets/product.img/Samsung-s7.webp';
import img10 from './assets/product.img/smart-glass.jpeg';
import img11 from './assets/product.img/smartglass2.jpeg';
import img12 from './assets/product.img/smartpen.jpeg';
import img13 from './assets/product.img/smartpen3.jpeg';
import img14 from './assets/product.img/virtual3d.jpeg';

// Product array - exported for use throughout the application
export const productsData = [{ 
    id: 1,
    image : img1,
    title: 'Virtual reality  3d ',
    price: 59.99,
    category: 'Virtual Reality',
    isNew: true,
    description: 'Experience the future of entertainment with our cutting-edge Virtual Reality 3D Glasses. Featuring integrated audio for a fully immersive experience, these glasses transport you to new worlds with stunning visuals and crystal-clear sound. Perfect for gaming, movies, and virtual tours, they are lightweight and comfortable for extended use. Step into the future today!'
},{
    id: 2,
    image : img2,
    title: 'Wireless Bluetooth 5.0 Earphones, Enjoy clear sound and stable connection with these wireless earphones',
    price: 29.99,
    category: 'Audio',
    onSale: true,
},
{
    id: 3,
    image : img3,
    title: 'JBL Noise-Cancelling Headphones, Immerse yourself in music with these high-quality JBL headphones',
    price: 99.99,
    category: 'Audio',
    outOfStock: true,
},{
    id: 4,
    image : img4,
    title: 'Smartwatch for Kids with GPS Tracking, Keep your children safe and connected with this smart watch',
    price: 49.99,
    category: 'Wearable',
},{
    id: 5,
    image : img5,
    title: 'the best phone in the world,',
    price: 399.99,
    category: 'Smartphone',
    onSale: true,
},{
    id: 6,
    image : img6,
    title: 'OnePlus 11 Smartphone with Ultra-Fast Performance, Enjoy speed and efficiency with this next-generation smartphone',
    price: 699.99,
    category: 'Smartphone',
},{
    id: 7,
    image : img7,
    title: 'iPhone 14 Pro Max com Câmera Avançada, Capture momentos incríveis com este smartphone premium da Apple',
    price: 1099.99,
    category: 'Smartphone',
    outOfStock: true,
},{
    id: 8,
    image : img8,
    title: 'Google Pixel 9 with Computational Photography, Capture stunning photos with this innovative Google smartphone',
    price: 799.99,
    category: 'Smartphone',
    isNew: true,
},{
    id: 9,
    image : img9,
    title: 'Samsung Galaxy S23 Ultra com Tela Infinita, Desfrute de uma experiência visual imersiva com este smartphone topo de linha',
    price: 999.99,
    category: 'Smartphone',
},{
    id: 10,
    image : img10,
    title: 'Óculos Inteligentes com Realidade Aumentada, Explore o mundo digital com estes óculos inteligentes de última geração',
    price: 249.99,
    category: 'Wearable',
    outOfStock: true,
},{
    id: 11,
    image : img11,
    title: 'Óculos Inteligentes com Tela Heads-Up, Mantenha-se conectado com estilo usando estes óculos inteligentes inovadores',
    price: 279.99,
    category: 'Wearable',
    isNew: true,
},{
    id: 12,
    image : img12,
    title: 'Caneta Inteligente com Digitalização de Notas, Transforme suas anotações em formato digital com esta caneta inteligente',
    price: 89.99,
    category: 'Wearable',
    onSale: true,
}
,{
    id: 13,
    image : img13,
    title: 'Caneta Inteligente Avançada com Reconhecimento de Escrita, Melhore sua produtividade com esta caneta inteligente de última geração',
    price: 129.99,
    category: 'Wearable',
},{
    id: 14,
    image : img14,
    title: 'Óculos de Realidade Virtual 3D com Áudio Integrado, Mergulhe em mundos virtuais com estes óculos de realidade virtual avançados',
    price: 79.99,
    category: 'Virtual Reality',
}];