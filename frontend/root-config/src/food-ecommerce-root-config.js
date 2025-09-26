import { registerApplication, start } from 'single-spa';

// Register the Navbar microfrontend (visible on all routes except auth)
registerApplication({
  name: '@food-ecommerce/navbar',
  app: () => System.import('@food-ecommerce/navbar'),
  activeWhen: (location) => {
    return !location.pathname.startsWith('/auth');
  },
  customProps: { domElement: document.getElementById('navbar') }
});

// Register the Home & Category Browser microfrontend
registerApplication({
  name: '@food-ecommerce/home',
  app: () => System.import('@food-ecommerce/home'),
  activeWhen: (location) => {
    const path = location.pathname;
    return path === '/' || 
           path === '/products' || 
           path === '/search' || 
           path.startsWith('/category/');
  },
  customProps: { domElement: document.getElementById('root') }
});

// Register the Product Detail microfrontend
registerApplication({
  name: '@food-ecommerce/product-detail',
  app: () => System.import('@food-ecommerce/product-detail'),
  activeWhen: ['/product/'],
  customProps: { domElement: document.getElementById('root') }
});

// Register the Cart Management microfrontend
registerApplication({
  name: '@food-ecommerce/cart',
  app: () => System.import('@food-ecommerce/cart'),
  activeWhen: ['/cart'],
  customProps: { domElement: document.getElementById('root') }
});

// Register the Supplier Dashboard microfrontend
registerApplication({
  name: '@food-ecommerce/supplier',
  app: () => System.import('@food-ecommerce/supplier'),
  activeWhen: ['/supplier'],
  customProps: { domElement: document.getElementById('root'), authRequired: true, role: 'supplier' }
});

// Register the Data Steward Dashboard microfrontend
registerApplication({
  name: '@food-ecommerce/data-steward',
  app: () => System.import('@food-ecommerce/data-steward'),
  activeWhen: ['/data-steward'],
  customProps: { domElement: document.getElementById('root'), authRequired: true, role: 'data-steward' }
});

// Register the Login/Register microfrontend
registerApplication({
  name: '@food-ecommerce/auth',
  app: () => System.import('@food-ecommerce/auth'),
  activeWhen: ['/auth'],
  customProps: { domElement: document.getElementById('root') }
});

// Register the Footer microfrontend (visible on all routes except auth)
registerApplication({
  name: '@food-ecommerce/footer',
  app: () => System.import('@food-ecommerce/footer'),
  activeWhen: (location) => {
    return !location.pathname.startsWith('/auth');
  },
  customProps: { domElement: document.getElementById('footer') }
});

start();
