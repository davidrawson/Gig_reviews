const express = require ('express');
const MongoClient = require ('mongodb').MongoClient;
const ObjectID = require ('mongodb').ObjectID;
const server = express();
const parser = require ('body-parser');

server.use(parser.json());
// directory from which to serve static assets
// server.use(express.static('client/build'));
server.use(parser.urlencoded({extended: true}));

MongoClient.connect('mongodb://localhost:27017', function(err, client){
  if (err){
    console.log(err);
    return;
  }

  const db = client.db('gig_reviews');
  console.log('Connected to db');

  // CREATE a review
  server.post('/reviews', function(req, res){
    const reviewsCollection = db.collection('user_reviews');
    const reviewToSave = req.body;
    console.log(req.body);

    reviewsCollection.save(reviewToSave, function(err, result){
      if (err){
        concole.log(err);
        res.status(500);
        res.send();
      }

      res.status(201);
      res.json(result.ops[0]);
      console.log('Saved to db.')
    })

  })

  // INDEX of reviews
  server.get('/reviews', function(req, res){
    const reviewsCollection = db.collection('user_reviews');
    reviewsCollection.find().toArray(function(err, allReviews){
      if(err){
        console.log(err);
        res.status(500);
        res.send();
      }

      console.log ('Reached the get route')
      res.json(allReviews);
    })
  })

  // DELETE_ALL reviews
  server.delete('/reviews', function(req, res){
    const reviewsCollection = db.collection('user_reviews');
    filterObject = {};
    reviewsCollection.deleteMany(filterObject, function(err, result){
      if (err){
        console.log(err);
        res.status(500);
        res.send();
      }

      console.log("Delete all successful.");
      res.status(204);
      res.send();
    })
  })

  server.listen(3000, function(){
    console.log("Listening on port 3000");
  });

})
