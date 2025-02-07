// Get/Homepage
exports.homepage = async (req, res) => {
  const locals = {
    title: 'Aehter Pad',
    description: 'Aether Pad is a simple note taking app',
  };
  res.render('index', { locals, layout: '../views/layouts/front-page' });
};
// Get/about
exports.about = async (req, res) => {
  const locals = {
title: 'About- Aether Pad',
    description: 'Aether Pad is a simple note taking app',
  };
  res.render('about', locals);
};
// Get/features
exports.features = async (req, res) => {
  const locals = {
    title: 'Features-Aether Pad',
    description: 'Aether Pad is a simple note taking app',
  };
  res.render('features', locals);
};
