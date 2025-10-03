import { registerApplication, start } from 'single-spa';
 
registerApplication({
  name: '@food-ecommerce/navbar',
  app: () => System.import('@food-ecommerce/navbar'),
  activeWhen: () => true, 
  customProps: { domElement: document.getElementById('navbar') }
});

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

registerApplication({
  name: '@food-ecommerce/product-detail',
  app: () => System.import('@food-ecommerce/product-detail'),
  activeWhen: ['/product/'],
  customProps: { domElement: document.getElementById('root') }
});

registerApplication({
  name: '@food-ecommerce/cart',
  app: () => System.import('@food-ecommerce/cart'),
  activeWhen: ['/cart'],
  customProps: { domElement: document.getElementById('root') }
});


registerApplication({
  name: '@food-ecommerce/supplier',
  app: () => System.import('@food-ecommerce/supplier'),
  activeWhen: ['/supplier'],
  customProps: { domElement: document.getElementById('root'), authRequired: true, role: 'supplier' }
});

registerApplication({
  name: '@food-ecommerce/data-steward',
  app: () => System.import('@food-ecommerce/data-steward'),
  activeWhen: ['/data-steward'],
  customProps: { domElement: document.getElementById('root'), authRequired: true, role: 'data-steward' }
});


registerApplication({
  name: '@food-ecommerce/auth',
  app: () => System.import('@food-ecommerce/auth'),
  activeWhen: ['/auth'],
  customProps: { domElement: document.getElementById('root') }
});


registerApplication({
  name: '@food-ecommerce/footer',
  app: () => System.import('@food-ecommerce/footer'),
  activeWhen: () => true, 
  customProps: { domElement: document.getElementById('footer') }
});

start();
