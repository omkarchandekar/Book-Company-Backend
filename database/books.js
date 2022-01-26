const mongoose = require("mongoose");

//create book schema
const BookSchema = mongoose.Schema(
    {
      ISBN: {type: String , required: true },
      title: {type: String , required: true },
      pubDate: {type: String , required: true },
      language: {type: String , required: true },
      numOfPage: {type: Number , required: true },
      authors: [{type: Number , required: true }],
      category: [{type: String , required: true }],
      publications: [{type: Number , required: true }]
   }
);

const BookModel = mongoose.model("books",BookSchema);

module.exports = BookModel;