const express = require("express")
const movieRouter = express.Router()
const {movieModel} = require("../model/moviemodel")
const {authenticate}=require("../middlewares/authenticate")
const {authorize}=require("../middlewares/authorize")


movieRouter.get("/",async(req,res)=>{
    let q = req.query
    try {
        const movie = await movieModel.find(q)
        res.send(movie)
    } catch (error) {
        console.log(error)
        res.send("somthing went wrong")
    }
})

movieRouter.get("/display", async (req, res) => {
	try {
		const page = parseInt(req.query.page) - 1 || 0;
		const limit = parseInt(req.query.limit) || 5;
		const search = req.query.search || "";
		let sort = req.query.sort || "rating";
		let genre = req.query.genre || "All";

		const genreOptions = [
			"Action",
			"Romance",
			"Fantasy",
			"Drama",
			"Crime",
			"Adventure",
			"Thriller",
			"Sci-fi",
			"Music",
			"Family",
		];

		genre === "All"
			? (genre = [...genreOptions])
			: (genre = req.query.genre.split(","));
		req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

		let sortBy = {};
		if (sort[1]) {
			sortBy[sort[0]] = sort[1];
		} else {
			sortBy[sort[0]] = "asc";
		}

		const movies = await movieModel.find({ name: { $regex: search, $options: "i" } })
			.where("genre")
			.in([...genre])
			.sort(sortBy)
			.skip(page * limit)
			.limit(limit);

		const total = await movieModel.countDocuments({
			genre: { $in: [...genre] },
			name: { $regex: search, $options: "i" },
		});

		const response = {
			error: false,
			total,
			page: page + 1,
			limit,
			genres: genreOptions,
			movies,
		};

		res.status(200).json(response);
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: true, message: "Internal Server Error" });
	}
});

movieRouter.post("/add",authenticate,authorize("admin"), async(req,res)=>{
	const data = req.body
    try {
        const movie = new movieModel(data)
       await movie.save()
       res.send(movie)
       console.log("added new movie")
        
    } catch (error) {
        console.log(error)
        res.send("somthing went wrong")
    }
})



movieRouter.patch("/edit/:id",authenticate,authorize("admin"), async(req,res)=>{
    let id = req.params.id
    const payload = req.body
    try {
    await movieModel.findByIdAndUpdate({_id:id},payload)
    res.send("updated")
    
    } catch (error) {
        console.log(error)
        res.send("somthing went wrong")
    }
})

movieRouter.delete("/delete/:id",authenticate,authorize("admin"),async(req,res)=>{
    const id = req.params.id
    const payload = req.body
    try {
    await movieModel.findByIdAndDelete({_id:id},payload)
    res.send("deleted the movie data")
    
    } catch (error) {
        console.log(error)
        res.send("somthing went wrong")
    }
})


module.exports = {movieRouter}