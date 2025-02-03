// Get/Homepage
exports.homepage = async (req, res) => {
  const locals = {
    title: 'NodeJS Notes App',
    description: 'Free NodeJS Notes App',
  };
  res.render('index', { locals, layout: '../views/layouts/front-page' });
};
// Get/about
exports.about = async (req, res) => {
  const locals = {
    title: 'About- Notes App',
    description: 'Free NodeJS Notes App',
  };
  res.render('about', locals);
};
// Get/features
exports.features = async (req, res) => {
  const locals = {
    title: 'Features- Notes App',
    description: 'Free NodeJS Notes App',
  };
  res.render('features', locals);
};
