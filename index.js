const express = require('express');
const fs = require('fs');
const app = express();
app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));
const writeData = (data) => {
    fs.writeFileSync('data.json',JSON.stringify(data,null,2));
}
const readData = () => {
    return JSON.parse(fs.readFileSync('data.json'));
}
// Parent Route
app.get("/",(req,res) => {
    res.render('index')
});
// Add Data Code
app.get('/add',(req,res) => {
    res.render('add')
});
app.post("/add",(req,res) => {
    const data = readData();
    const newEntry = {
        id:parseInt(req.body.id),
        name: req.body.name,
        age:req.body.age
    };
    data.push(newEntry);
    writeData(data);
    res.redirect('/views');
});
// Displaying Data code
app.get('/views', (req, res) => {
    res.render('home', { data: readData() }); // Correctly pass data to the template
});
// View Data Code
app.get('/view/:id', (req, res) => {
    const id = parseInt(req.params.id); // Get the ID from the URL
    const data = readData(); // Read all data
    const item = data.find(entry => entry.id === id); // Find the item by ID

    if (item) {
        res.render('view', { item }); // Pass the item to the view page
    } else {
        res.status(404).send('Item not found'); // Handle invalid IDs
    }
});
// Update Data Code
app.get('/update/:id', (req, res) => {
    const id = parseInt(req.params.id); // Get the ID from the URL
    const data = readData(); // Read all data
    const item = data.find(entry => entry.id === id); // Find the item by ID

    if (item) {
        res.render('update', { item }); // Pass the item to the update page
    } else {
        res.status(404).send('Item not found'); // Handle invalid IDs
    }
});

app.post('/update/:id', (req, res) => {
    const id = parseInt(req.params.id); // Get the ID from the URL
    const data = readData(); // Read all data
    const itemIndex = data.findIndex(entry => entry.id === id); // Find the index of the item by ID

    if (itemIndex !== -1) {
        // Update the item details
        data[itemIndex] = {
            id: id,
            name: req.body.name,
            age: req.body.age
        };
        writeData(data); // Save the updated data to the file
        res.redirect('/views'); // Redirect to the list page
    } else {
        res.status(404).send('Item not found'); // Handle invalid IDs
    }
});
// Delete Data Code
app.get('/delete/:id', (req, res) => {
    const id = parseInt(req.params.id); // Get the ID from the URL
    const data = readData(); // Read all data
    const filteredData = data.filter(entry => entry.id !== id); // Filter out the item with the matching ID

    if (data.length !== filteredData.length) {
        writeData(filteredData); // Save the updated data to the file
        res.redirect('/views'); // Redirect to the list page
    } else {
        res.status(404).send('Item not found'); // Handle invalid IDs
    }
});
 
app.listen(2000,() => {
    console.log("Server Is Running On Port 2000");
});