const { transcode } = require('buffer')
const express = require('express')
const app = express()
const port = 8888

const fs = require('fs')

app.set('view engine', 'pug')

app.use('/static', express.static('public'))
app.use(express.urlencoded({extended:false}))

//localhost:8888
app.listen(8888, error => {
    if (error) console.log(error)

    console.log('Server running 8888')
})

app.get('/create', (req, res) => {
    res.render('create')
})

app.get('/home', (req, res) => {
    res.render('home')
})

//create
app.post('/create', (req, res) => {
    const Name = req.body.Name
    const Description = req.body.Description

    if(Name.trim()==='' && Description.trim()=== ''){
        res.render('create', {error:true})
    }else{
        fs.readFile('./data/Medicines.json', (err, data)=>{
            if (err) throw err
            
            const Medicines=JSON.parse(data)

            Medicines.push({
                id : id (),
                Name : Name,
                Description : Description 
            })

            fs.writeFile('./data/Medicines.json', JSON.stringify(Medicines), err =>{
                if (err) throw err

                res.render('create', {success:true})
            })
        })
    }
})

app.get('/', (req, res) => {
    res.render('home')
})


app.get('/Medicines', (req, res)=>{
    fs.readFile('./data/Medicines.json', (err, data)=>{
        if(err) throw err

        const Medicines = JSON.parse(data)

        res.render('Medicines', {Medicines : Medicines})
    })
}) 

app.get('/Medicines/:id', (req, res) =>{
    const id = req.params.id

    fs.readFile('./data/Medicines.json', (err, data)=>{
        if(err) throw err

        const Medicines = JSON.parse(data)
        const medicine = Medicines.filter(medicine => medicine.id == id)[0]
        res.render('information', { medicine : medicine})

    })
})

app.get('/api/v1/Medicines', (req, res) => {
    fs.readFile('./data/Medicines.json', (err, data)=>{
        if(err) throw err

        const Medicines = JSON.parse(data)
        res.json(Medicines)

    })
})

//Delete-btn
app.get('/:id/delete', (req, res) => {
    const id =req.params.id

    fs.readFile('./data/Medicines.json', (err, data) => {
        if (err) throw err

        const Medicines = JSON.parse(data)
        const filteredMedicines = Medicines.filter (medicine => medicine.id != id)

        fs.writeFile('./data/medicines.json', JSON.stringify(filteredMedicines), (err) => {
            if (err) throw err

            res.render('Medicines', {Medicines : filteredMedicines, deleted :true})
        })
    })
})

//Update
app.get('/:id/Update', (req, res) => {
    const id = req.params.id
    
    fs.readFile('./data/Medicines.json', (err ,data) => {
        if (err) throw err

        const Medicines = JSON.parse(data)
        const medicine = Medicines.filter(medicine => medicine.id == id)[0]

        const medicineIdx = Medicines.indexOf(medicine)
        const splicemedicine = Medicines.splice(medicineIdx, 1)[0]

        splicemedicine.done = true
        Medicines.push(splicemedicine)

        fs.writeFile('./data/Medicines.json', JSON.stringify(Medicines), (err) => {
            if (err) throw err

            res.render('Medicines', {Medicines : Medicines})
        })
    })
})

//creating random id
function id () {
    return '_' + Math.random().toString(36).substr(2, 9);
}