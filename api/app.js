const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const multer = require('multer')
const { randomInt } = require('crypto')
const cors = require('cors')

const app = express()
app.use(cors())

app.use(express.static('public'))

mongoose.connect('mongodb://localhost:27017/profiledetails')
.then(()=> console.log('Connected to DB'))
.catch(err => console.log('Error: ', err))

const profileSchema = mongoose.Schema({
    name: String,
    phone: String,
    filename: String,
    path: String,
    url: String
})

const Profile = mongoose.model('Profile', profileSchema)

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, 'public/Images')
    },
    filename: (req, file, cb) =>{
        cb(null, randomInt(100000) + path.extname(file.originalname))
    }
})

const upload = multer({storage: storage}) 

app.post('/pushData', upload.single('image'), async (req, res) =>{
    const body = req.body
    const file = req.file
    const url = `Images/${file.filename}`
    const user = new Profile({
        name: body.name,
        phone: body.phone,
        filename: file.filename,
        path: file.path,
        url: url
    })  
    
    await user.save()
    res.status(200).send({msg : 'Data saved successfully'})
})

app.get('/fetchData', async (req, res)=>{
    const data = await Profile.find()
    res.status(200).send(data)
})

app.listen(4000, ()=>{
    console.log('App running on http://localhost:4000')
})