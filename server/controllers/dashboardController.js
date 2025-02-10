const Note = require('../models/Notes');
const mongoose = require('mongoose');

// Get/daSHBOARD
exports.dashboard = async (req, res, next) => {
  const locals = {
    title: 'Dashboard',
    description: 'Aether Pad is a simple note-taking app',
  };

  try {
    const perPage = 10;
    let page = parseInt(req.query.page) || 1; 

    if (page < 1) page = 1; 

    const notes = await Note.aggregate([
      { $sort: { updatedAt: -1 } },
      { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
      {
        $project: {
          title: { $substr: ['$title', 0, 30] },
          body: { $substr: ['$body', 0, 100] },
        },
      },
    ])
      .skip(perPage * (page - 1))
      .limit(perPage);

    const count = await Note.countDocuments();

    res.render('dashboard/index', {
      userName: req.user.firstName,
      locals,
      notes,
      layout: '../views/layouts/dashboard',
      current: page,
      pages: Math.ceil(count / perPage),
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//Get a specific note

exports.dashboardViewNote = async (req, res) => {
  const note = await Note.findById({ _id: req.params.id })
    .where({ user: req.user.id })
    .lean();
  if (note) {
    res.render('dashboard/view-notes', {
      noteID: req.params.id,
      note,
      layout: '../views/layouts/dashboard',
    });
  } else {
    res.send('Something went wrong.');
  }
};

//Update Specific note
exports.dashboardUpdateNote = async (req, res) => {
  try {
    await Note.findOneAndUpdate(
      { _id: req.params.id },
      { title: req.body.title, body: req.body.body,updatedAt: Date.now() }
    ).where({ user: req.user.id });
    res.redirect('/dashboard');
  } catch (error) {
    console.log(error);
  }
};

//Delete
exports.dashboardDeleteNote = async (req, res) => {
  console.log("DELETE Request Received for ID:", req.params.id);
  console.log("Request Method:", req.method);

  try {
    await Note.deleteOne({ _id: req.params.id, user: req.user.id });
    res.redirect('/dashboard');
  } catch (error) {
    console.log(error);
    res.status(500).send('Error deleting note');
  }
};

//GET Add NOtes

exports.dashboardAddNote = async (req, res) => {
  res.render('dashboard/add', {
    layout: '../views/layouts/dashboard',
  });
};

// POst Add NOtes

exports.dashboardAddNoteSubmit = async (req,res) => {
  try {
    req.body.user = req.user.id;
    await Note.create(req.body);
    res.redirect('/dashboard')
  } catch (error) {
    console.log(error);
  }
};


//Get/search

exports.dashboardSearch=async (req,res) => {

try{
  res.render('dashboard/search',{
    searchResults:'',
    layout:'../views/layouts/dashboard'
  })
} catch(error){


}


}



//Search

exports.dashboardSearchSubmit=async (req,res)=>{
try{
let searchTerm = req.body.searchTerm;
const searchNoSpecialChars= searchTerm.replace(/[a-zA-Z0-9]/g,"");
const searchResults=await Note.find({
$or:[
{title:{$regex:new RegExp(searchNoSpecialChars,'i')}},
{body:{$regex:new RegExp(searchNoSpecialChars,'i')}}
]



}).where({user:req.user.id});
res.render('dashboard/search',{
  searchResults,
  layout:'../views/layouts/dashboard'
})

} catch (error){

console.log(error)

}






}