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
    negotiable: true,

    description: 'Experience the future of entertainment with our cutting-edge Virtual Reality 3D Glasses. Featuring integrated audio for a fully immersive experience, these glasses transport you to new worlds with stunning visuals and crystal-clear sound. Perfect for gaming, movies, and virtual tours, they are lightweight and comfortable for extended use. Step into the future today!'
},{
    id: 2,
    image : img2,
    title: 'Wireless Bluetooth 5.0 Earphones',
    price: 29.99,
    category: 'Audio',
    description: 'Experience the freedom of wireless listening with our Wireless Bluetooth 5.0 Earphones. Designed for comfort and superior sound quality, these earphones feature advanced Bluetooth 5.0 technology for a stable connection and extended range. Enjoy crystal-clear audio, deep bass, and hands-free calls on the go. Perfect for workouts, commutes, and everyday use, these earphones are your ideal audio companion.',
    onSale: true,
},
{
    id: 3,
    image : img3,
    title: 'JBL Noise-Cancelling Headphones',
    price: 99.99,
    category: 'Audio',
    description: 'Experience unparalleled sound quality with JBL Noise-Cancelling Headphones. Designed to immerse you in your favorite music, these headphones feature advanced noise-cancelling technology that blocks out unwanted ambient sounds. Enjoy deep bass, clear highs, and a comfortable fit for extended listening sessions. Whether you\'re traveling, working, or relaxing, these headphones deliver an exceptional audio experience.',
    outOfStock: true,
},{
    id: 4,
    image : img4,
    title: 'Smartwatch for Kids with GPS Tracking',
    price: 49.99,
    description: 'Keep your children safe and connected with our Smartwatch for Kids with GPS Tracking. This kid-friendly smartwatch features real-time location tracking, allowing parents to monitor their child\'s whereabouts easily. With fun educational games, a built-in camera, and fitness tracking, it\'s designed to keep kids engaged while promoting healthy habits. Durable and water-resistant, this smartwatch is perfect for active kids on the go.',
    category: 'Wearable',
    negotiable: true,
},{
    id: 5,
    image : img5,
    title: 'the best phone in the world,',
    price: 399.99,
    category: 'Smartphone',
    onSale: true,
    negotiable: true,
},{
    id: 6,
    image : img6,
    title: 'OnePlus 11 Smartphone with Ultra-Fast Performance',
    price: 699.99,
    description: 'Experience ultra-fast performance and seamless multitasking with the OnePlus 11 Smartphone. Equipped with the latest processor and ample RAM, this smartphone delivers smooth and efficient operation for all your needs. Enjoy a stunning display, advanced camera system, and long-lasting battery life, making it the perfect companion for work and play.',
    category: 'Smartphone',
    negotiable: true,
},{
    id: 7,
    image : img7,
    title: 'iPhone 14 Pro Max com Câmera Avançada',
    price: 1099.99,
    description: 'Capture stunning photos and videos with the iPhone 14 Pro Max, featuring an advanced camera system that takes your photography to the next level. With its powerful processor, vibrant display, and sleek design, this premium Apple smartphone offers an unparalleled user experience. Stay connected, productive, and entertained with the iPhone 14 Pro Max.',
    category: 'Smartphone',
    outOfStock: true,
},{
    id: 8,
    image : img8,
    title: 'Google Pixel 9 with Computational Photography',
    price: 799.99,
    category: 'Smartphone',
    description: 'Experience the future of photography with the Google Pixel 9, featuring cutting-edge computational photography technology. Capture breathtaking images in any lighting condition, from vibrant landscapes to detailed portraits. With its sleek design, powerful performance, and seamless integration with Google services, the Pixel 9 is the ultimate smartphone for photography enthusiasts and everyday users alike.',
    isNew: true,
},{
    id: 9,
    image : img9,
    title: 'Samsung Galaxy S23 Ultra com Tela Infinita',
    price: 999.99,
    description: 'Immerse yourself in a world of vibrant colors and stunning visuals with the Samsung Galaxy S23 Ultra, featuring an Infinity Display that stretches from edge to edge. Enjoy a cinematic viewing experience, whether you\'re watching movies, playing games, or browsing the web. With its powerful performance, advanced camera system, and sleek design, the Galaxy S23 Ultra is the perfect smartphone for those who demand the best.',
    category: 'Smartphone',
    negotiable: false,
},{
    id: 10,
    image : img10,
    title: 'Smart Glasses with Augmented Reality',
    price: 249.99,
    description: 'Explore the digital world with these state-of-the-art smart glasses featuring augmented reality technology. Perfect for immersive experiences, navigation, and hands-free information access, these glasses combine style and functionality for the modern user.',
    category: 'Wearable',
    outOfStock: true,
},{
    id: 11,
    image : img11,
    title: 'Smart Glasses with Heads-Up Display',
    price: 279.99,
    category: 'Wearable',
    description: 'Stay connected and informed with these innovative smart glasses featuring a heads-up display. Ideal for professionals and tech enthusiasts, these glasses provide real-time notifications, navigation, and more, all while keeping your hands free.',
    isNew: true,
    negotiable: true,
},{
    id: 12,
    image : img12,
    title: 'Smart Pen with Note Digitization',
    price: 89.99,
    description: 'Enhance your productivity with this smart pen that digitizes your handwritten notes in real-time. Perfect for students and professionals, this pen seamlessly transfers your notes to your devices, making organization and sharing effortless.',
    category: 'Wearable',
    onSale: true,
}
,{
    id: 13,
    image : img13,
    title: 'Advanced Smart Pen with Handwriting Recognition',
    price: 129.99,
    description: 'Improve your productivity with this advanced smart pen featuring handwriting recognition technology. Ideal for professionals and students, this pen accurately converts your handwritten notes into digital text, making organization and sharing easier than ever.',
    category: 'Wearable',
    negotiable: false,
},{
    id: 14,
    image : img14,
   
    title: '3D Virtual Reality Glasses with Integrated Audio',
    description: 'Immerse yourself in virtual worlds with these advanced 3D virtual reality glasses featuring integrated audio. Experience stunning visuals and immersive sound for gaming, entertainment, and more.',
    price: 79.99,
    category: 'Virtual Reality',
    isNew: true,
}];